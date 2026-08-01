from fastapi import APIRouter, Header

from app.models.seo_model import (
    SEORequest,
    SEOResponse
)

from app.services.seo_generator import (
    SEOGenerator
)


router = APIRouter()


@router.post(
    "/generate",
    response_model=SEOResponse
)
def generate(
    body: SEORequest,
    x_api_key: str | None = Header(None, alias="X-API-Key")
):

    generator = SEOGenerator(api_key=x_api_key)

    return generator.generate(body)

