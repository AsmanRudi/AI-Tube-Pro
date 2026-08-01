import json

from app.clients.gemini_client import (
    GeminiClient
)

from app.models.voice_model import (
    VoiceoverRequest,
    VoiceoverResponse
)


class VoiceoverGenerator:

    def __init__(self, api_key: str | None = None):
        self.api_key = api_key

    def generate(
        self,
        data: VoiceoverRequest
    ) -> VoiceoverResponse:

        ai = GeminiClient(self.api_key)

        prompt = f"""
You are a professional voiceover director.

Analyze the following script and provide voiceover production details.

Script:
{data.script}

Language:
{data.language}

Voice Style:
{data.voice_style}

Requirements:
1. Calculate estimated duration based on script length (average 150 words per minute).
2. Count total words.
3. Recommend speaking pace and tone for each section.
4. Break script into segments with timing.
5. Provide speaking tips for natural delivery.

Return ONLY valid JSON.
Do not use markdown.
Do not use ```json.

JSON structure:
{{
    "estimated_duration_seconds": 300,
    "word_count": 750,
    "voice_style": "{data.voice_style}",
    "speaking_tips": ["tip1", "tip2", "tip3"],
    "script_segments": [
        {{"text": "segment text", "duration_seconds": 30, "tone": "enthusiastic"}}
    ]
}}
"""

        result = ai.generate(prompt)

        try:
            data_json = json.loads(result)
        except json.JSONDecodeError:
            raise RuntimeError(
                "AI menghasilkan JSON yang tidak valid untuk Voiceover"
            )

        return VoiceoverResponse(
            estimated_duration_seconds=data_json["estimated_duration_seconds"],
            word_count=data_json["word_count"],
            voice_style=data_json["voice_style"],
            speaking_tips=data_json["speaking_tips"],
            script_segments=data_json["script_segments"]
        )
