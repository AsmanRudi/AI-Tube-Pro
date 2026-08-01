from pydantic import BaseModel


class SubtitleRequest(BaseModel):

    script: str

    language: str

    format: str = "srt"


class SubtitleSegment(BaseModel):

    index: int

    start_time: str

    end_time: str

    text: str


class SubtitleResponse(BaseModel):

    segments: list[SubtitleSegment]

    total_segments: int

    format: str

    language: str
