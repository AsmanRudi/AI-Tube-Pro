from fastapi import APIRouter, Header

from app.models.script_model import (
    ScriptRequest,
    ScriptResponse
)

from app.services.script_generator import (
    ScriptGenerator
)


router = APIRouter()


@router.post(
    "/generate",
    response_model=ScriptResponse
)
def generate(
    body: ScriptRequest,
    x_api_key: str | None = Header(None, alias="X-API-Key")
):

    generator = ScriptGenerator(api_key=x_api_key)

    return generator.generate(body)

