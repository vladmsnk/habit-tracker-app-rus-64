import logging
from fastapi import FastAPI, Request, Response
import httpx
import uvicorn

# Настройка логирования
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s"
)
logger = logging.getLogger("proxy")

app = FastAPI()

# Базовый URL целевого сервера
TARGET_BASE = "http://trackhabits.ru:7001"

@app.api_route("/{full_path:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"])
async def proxy(full_path: str, request: Request):
    if request.method == "OPTIONS":
        response = Response(status_code=200)
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD"
        response.headers["Access-Control-Allow-Headers"] = request.headers.get("access-control-request-headers", "Content-Type")
        return response

    # Формирование целевого URL с учетом query-параметров
    target_url = f"{TARGET_BASE}/{full_path}"
    if request.url.query:
        target_url += f"?{request.url.query}"

    # Копирование заголовков запроса, исключая host
    headers = dict(request.headers)
    headers.pop("host", None)

    # Чтение тела запроса, если оно присутствует
    async with httpx.AsyncClient(http2=False) as client:
        try:
            proxy_response = await client.request(
                method=request.method,
                url=target_url,
                headers=headers,
                content=await request.body(),
                timeout=10.0
            )
            logger.info("Получен ответ от целевого сервера: %s %s", proxy_response.status_code, proxy_response.content)
            logger.info("Заголовки ответа: %s", dict(proxy_response.headers))
        except httpx.RequestError as exc:
            logger.error("Ошибка при обращении к %s: %s", TARGET_BASE, str(exc))
            return Response(
                content=f"Ошибка при обращении к {TARGET_BASE}: {str(exc)}",
                status_code=502,
                media_type="text/plain"
            )

    # Копирование заголовков ответа и добавление CORS-заголовков
    response_headers = dict(proxy_response.headers)
    response_headers["Access-Control-Allow-Origin"] = "*"
    response_headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD"
    response_headers["Access-Control-Allow-Headers"] = request.headers.get("access-control-request-headers", "Content-Type")

    return Response(
        content=proxy_response.content,
        status_code=proxy_response.status_code,
        headers=response_headers,
        media_type=proxy_response.headers.get("content-type", "application/octet-stream")
    )
