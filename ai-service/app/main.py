from fastapi import FastAPI, Header, HTTPException

from app.clients.gemini_client import (
    GeminiClient
)

from app.routes.script import (
    router as script_router
)

from app.routes.seo import (
    router as seo_router
)

from app.routes.thumbnail import (
    router as thumbnail_router
)

from app.routes.voice import (
    router as voice_router
)

from app.routes.subtitle import (
    router as subtitle_router
)


app = FastAPI(
    title="AI Tube Pro AI Service",
    version="1.0.0"
)


app.include_router(
    script_router,
    prefix="/script",
    tags=["Script"]
)


app.include_router(
    seo_router,
    prefix="/seo",
    tags=["SEO"]
)


app.include_router(
    thumbnail_router,
    prefix="/thumbnail",
    tags=["Thumbnail"]
)


app.include_router(
    voice_router,
    prefix="/voice",
    tags=["Voiceover"]
)


app.include_router(
    subtitle_router,
    prefix="/subtitle",
    tags=["Subtitle"]
)


@app.get("/")
def root():

    return {
        "service": "AI Tube Pro AI Service",
        "status": "running"
    }


@app.get("/health")
def health():

    return {
        "status": "ok"
    }


@app.post("/validate")
def validate(
    x_api_key: str | None = Header(None, alias="X-API-Key")
):

    if not x_api_key:

        raise HTTPException(
            status_code=400,
            detail="X-API-Key header wajib diisi"
        )

    try:

        ai = GeminiClient(api_key=x_api_key)

        ai.generate(
            "Reply with exactly: OK"
        )

        return {
            "valid": True
        }

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=f"API key tidak valid: {str(e)}"
        )

