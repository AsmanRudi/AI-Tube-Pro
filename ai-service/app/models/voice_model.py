from pydantic import BaseModel


class VoiceoverRequest(BaseModel):

    script: str

    language: str

    voice_style: str = "natural"


class VoiceoverResponse(BaseModel):

    estimated_duration_seconds: int

    word_count: int

    voice_style: str

    speaking_tips: list[str]

    script_segments: list[dict]
