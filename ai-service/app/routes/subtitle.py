from fastapi import APIRouter, Header

from app.models.subtitle_model import (
    SubtitleRequest,
    SubtitleResponse
)

from app.services.subtitle_generator import (
    SubtitleGenerator
)


router = APIRouter()


@router.post(
    "/generate",
    response_model=SubtitleResponse
)
def generate(
    body: SubtitleRequest,
    x_api_key: str | None = Header(None, alias="X-API-Key")
):

    generator = SubtitleGenerator(api_key=x_api_key)

    return generator.generate(body)

