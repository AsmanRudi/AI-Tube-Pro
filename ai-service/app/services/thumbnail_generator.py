import json

from app.clients.gemini_client import (
    GeminiClient
)

from app.models.thumbnail_model import (
    ThumbnailRequest,
    ThumbnailResponse
)


class ThumbnailGenerator:

    def __init__(self, api_key: str | None = None):
        self.api_key = api_key

    def generate(
        self,
        data: ThumbnailRequest
    ) -> ThumbnailResponse:

        ai = GeminiClient(self.api_key)

        prompt = f"""
You are a professional YouTube thumbnail designer.

Generate a thumbnail concept for a YouTube video.

Video Title:
{data.title}

Keyword:
{data.keyword}

Style:
{data.style}

Requirements:
1. Create an attention-grabbing thumbnail title overlay text.
2. Describe the visual concept (colors, composition, elements).
3. Recommend a visual style that matches the content.
4. Provide design tips for high CTR.

Return ONLY valid JSON.
Do not use markdown.
Do not use ```json.

JSON structure:
{{
    "title": "Text overlay for thumbnail",
    "description": "Visual concept description",
    "style": "{data.style}",
    "prompt": "Detailed image generation prompt for AI image generator",
    "design_tips": ["tip1", "tip2", "tip3"]
}}
"""

        result = ai.generate(prompt)

        try:
            data_json = json.loads(result)
        except json.JSONDecodeError:
            raise RuntimeError(
                "AI menghasilkan JSON yang tidak valid untuk Thumbnail"
            )

        return ThumbnailResponse(
            title=data_json["title"],
            description=data_json["description"],
            style=data_json["style"],
            prompt=data_json["prompt"],
            design_tips=data_json["design_tips"]
        )
