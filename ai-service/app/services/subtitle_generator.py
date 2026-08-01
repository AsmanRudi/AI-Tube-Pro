import json

from app.clients.gemini_client import (
    GeminiClient
)

from app.models.subtitle_model import (
    SubtitleRequest,
    SubtitleResponse,
    SubtitleSegment
)


class SubtitleGenerator:

    def __init__(self, api_key: str | None = None):
        self.api_key = api_key

    def generate(
        self,
        data: SubtitleRequest
    ) -> SubtitleResponse:

        ai = GeminiClient(self.api_key)

        prompt = f"""
You are a professional subtitle/caption creator.

Generate SRT-style subtitles for the following script.

Script:
{data.script}

Language:
{data.language}

Output Format:
{data.format}

Requirements:
1. Break the script into logical subtitle segments.
2. Each segment should be 2-5 seconds long.
3. Each segment should contain complete phrases (don't cut mid-sentence).
4. Assign realistic start and end times (HH:MM:SS,mmm format).
5. Total duration should match natural reading pace.

Return ONLY valid JSON.
Do not use markdown.
Do not use ```json.

JSON structure:
{{
    "segments": [
        {{
            "index": 1,
            "start_time": "00:00:00,000",
            "end_time": "00:00:03,500",
            "text": "Hello and welcome to this video."
        }},
        {{
            "index": 2,
            "start_time": "00:00:03,500",
            "end_time": "00:00:07,000",
            "text": "Today we are going to learn something amazing."
        }}
    ],
    "total_segments": 10,
    "format": "{data.format}",
    "language": "{data.language}"
}}
"""

        result = ai.generate(prompt)

        try:
            data_json = json.loads(result)
        except json.JSONDecodeError:
            raise RuntimeError(
                "AI menghasilkan JSON yang tidak valid untuk Subtitle"
            )

        segments = [
            SubtitleSegment(
                index=seg["index"],
                start_time=seg["start_time"],
                end_time=seg["end_time"],
                text=seg["text"]
            )
            for seg in data_json["segments"]
        ]

        return SubtitleResponse(
            segments=segments,
            total_segments=data_json["total_segments"],
            format=data_json["format"],
            language=data_json["language"]
        )
