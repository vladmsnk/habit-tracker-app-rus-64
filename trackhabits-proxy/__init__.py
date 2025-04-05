
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
import httpx
from typing import Dict, Any
import json

app = FastAPI()

TARGET_URL = "http://trackhabits.ru:7001"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def proxy(request: Request, path: str):
    url = f"{TARGET_URL}/{path}"
    
    # Get request headers
    headers = dict(request.headers)
    headers.pop("host", None)
    
    # Get request body if any
    body = None
    if request.method in ["POST", "PUT"]:
        body_bytes = await request.body()
        if body_bytes:
            try:
                body = json.loads(body_bytes)
            except:
                body = body_bytes
    
    # Make request to target API
    async with httpx.AsyncClient() as client:
        try:
            response = await client.request(
                method=request.method,
                url=url,
                headers=headers,
                json=body if body else None,
                params=request.query_params,
                follow_redirects=True,
            )
            
            # Process the response
            response_headers = dict(response.headers)
            response_headers.pop("transfer-encoding", None)
            response_headers.pop("content-encoding", None)
            
            return Response(
                content=response.content,
                status_code=response.status_code,
                headers=response_headers,
            )
        except Exception as e:
            return Response(
                content=f"Error: {str(e)}",
                status_code=500,
            )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8081)
