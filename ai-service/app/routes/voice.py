from fastapi import APIRouter, Header

from app.models.voice_model import (
    VoiceoverRequest,
    VoiceoverResponse
)

from app.services.voice_generator import (
    VoiceoverGenerator
)


router = APIRouter()


@router.post(
    "/generate",
    response_model=VoiceoverResponse
)
def generate(
    body: VoiceoverRequest,
    x_api_key: str | None = Header(None, alias="X-API-Key")
):

    generator = VoiceoverGenerator(api_key=x_api_key)

    return generator.generate(body)

