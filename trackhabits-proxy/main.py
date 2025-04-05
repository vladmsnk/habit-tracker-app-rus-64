from fastapi import FastAPI, Request, Response
import httpx
import uvicorn

app = FastAPI()

# Базовый URL целевого сервера
TARGET_BASE = "http://trackhabits.ru:7001"


@app.api_route("/{full_path:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"])
async def proxy(full_path: str, request: Request):
    # Если preflight OPTIONS-запрос, возвращаем нужные заголовки без обращения к целевому серверу
    if request.method == "OPTIONS":
        response = Response(status_code=200)
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD"
        response.headers["Access-Control-Allow-Headers"] = request.headers.get("access-control-request-headers", "Content-Type")
        return response

    # Формируем URL для проксирования с учетом пути и query-параметров
    target_url = f"{TARGET_BASE}/{full_path}"
    if request.url.query:
        target_url += f"?{request.url.query}"

    # Копируем заголовки запроса, исключая host
    headers = dict(request.headers)
    headers.pop("host", None)

    # Читаем тело запроса (если есть)
    body = await request.body()

    async with httpx.AsyncClient(http2=False) as client:
        try:
            proxy_response = await client.request(
                method=request.method,
                url=target_url,
                headers=headers,
                content=body,
                timeout=10.0
            )
        except httpx.RequestError as exc:
            return Response(
                content=f"Ошибка при обращении к {TARGET_BASE}: {str(exc)}",
                status_code=502,
                media_type="text/plain"
            )

    # Копируем заголовки ответа и добавляем CORS-заголовки
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
