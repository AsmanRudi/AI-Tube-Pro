from fastapi import APIRouter, Header

from app.models.thumbnail_model import (
    ThumbnailRequest,
    ThumbnailResponse
)

from app.services.thumbnail_generator import (
    ThumbnailGenerator
)


router = APIRouter()


@router.post(
    "/generate",
    response_model=ThumbnailResponse
)
def generate(
    body: ThumbnailRequest,
    x_api_key: str | None = Header(None, alias="X-API-Key")
):

    generator = ThumbnailGenerator(api_key=x_api_key)

    return generator.generate(body)

