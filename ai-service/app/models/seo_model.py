from pydantic import BaseModel


class SEORequest(BaseModel):

    keyword: str

    script: str

    language: str


class SEOResponse(BaseModel):

    title: str

    description: str

    tags: list[str]

    hashtags: list[str]

    keywords: list[str]

    score: int