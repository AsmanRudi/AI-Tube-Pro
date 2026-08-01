from pydantic import BaseModel


class ScriptRequest(BaseModel):

    keyword: str

    language: str

    duration: str


class ScriptResponse(BaseModel):

    title: str

    outline: list[str]

    script: str

    description: str

    tags: list[str]