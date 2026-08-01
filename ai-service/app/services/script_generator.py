import json

from app.clients.gemini_client import (
    GeminiClient
)

from app.models.script_model import (
    ScriptRequest,
    ScriptResponse
)


class ScriptGenerator:


    def __init__(self, api_key: str | None = None):

        self.api_key = api_key


    def generate(
        self,
        data: ScriptRequest
    ) -> ScriptResponse:

        ai = GeminiClient(self.api_key)

        prompt = f"""
You are a professional YouTube script writer.

Create a high-quality YouTube video script.

Topic:
{data.keyword}

Language:
{data.language}

Target duration:
{data.duration}


Requirements:

1. Create an attention-grabbing title.

2. Create a structured outline.

3. Write the complete YouTube script.

4. Start with a strong hook.

5. Keep viewers interested throughout the video.

6. End with a natural call to action.

7. Create a YouTube description.

8. Generate relevant tags.


Return ONLY valid JSON.

Do not use markdown.

Do not use ```json.


JSON structure:

{{
    "title": "video title",

    "outline": [
        "section 1",
        "section 2"
    ],

    "script": "complete script",

    "description": "youtube description",

    "tags": [
        "tag1",
        "tag2"
    ]
}}
"""


        result = ai.generate(prompt)


        try:

            data_json = json.loads(
                result
            )

        except json.JSONDecodeError:

            raise RuntimeError(
                "AI menghasilkan JSON yang tidak valid"
            )


        return ScriptResponse(

            title=
                data_json["title"],

            outline=
                data_json["outline"],

            script=
                data_json["script"],

            description=
                data_json["description"],

            tags=
                data_json["tags"]

        )