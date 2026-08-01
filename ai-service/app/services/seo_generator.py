import json

from app.clients.gemini_client import (
    GeminiClient
)

from app.models.seo_model import (
    SEORequest,
    SEOResponse
)


class SEOGenerator:

    def __init__(self, api_key: str | None = None):
        self.api_key = api_key

    def generate(
        self,
        data: SEORequest
    ) -> SEOResponse:

        ai = GeminiClient(self.api_key)

        prompt = f"""
You are a professional YouTube SEO expert.

Analyze the following script and keyword to generate optimal SEO metadata.

Keyword:
{data.keyword}

Script Content:
{data.script}

Language:
{data.language}

Requirements:
1. Create an SEO-optimized video title (maximum 60 characters).
2. Write a compelling YouTube description with keywords (minimum 200 characters).
3. Generate 10-15 relevant tags including long-tail keywords.
4. Generate 5-8 trending hashtags.
5. Extract 5-8 keywords from the script.
6. Provide an SEO score from 0-100 based on keyword density, title optimization, and description quality.

Return ONLY valid JSON.
Do not use markdown.
Do not use ```json.

JSON structure:
{{
    "title": "SEO optimized video title",
    "description": "SEO optimized description with keywords",
    "tags": ["tag1", "tag2", "tag3"],
    "hashtags": ["#tag1", "#tag2"],
    "keywords": ["keyword1", "keyword2"],
    "score": 85
}}
"""

        result = ai.generate(prompt)

        try:
            data_json = json.loads(result)
        except json.JSONDecodeError:
            raise RuntimeError(
                "AI menghasilkan JSON yang tidak valid untuk SEO"
            )

        return SEOResponse(
            title=data_json["title"],
            description=data_json["description"],
            tags=data_json["tags"],
            hashtags=data_json["hashtags"],
            keywords=data_json["keywords"],
            score=data_json["score"]
        )
