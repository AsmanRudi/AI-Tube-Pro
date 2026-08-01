from pydantic import BaseModel


class ThumbnailRequest(BaseModel):

    title: str

    keyword: str

    style: str = "professional"


class ThumbnailResponse(BaseModel):

    title: str

    description: str

    style: str

    prompt: str

    design_tips: list[str]
