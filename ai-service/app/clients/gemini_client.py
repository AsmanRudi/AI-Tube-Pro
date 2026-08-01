from google import genai

from ..config.ai_config import (
    GEMINI_API_KEY,
    GEMINI_MODEL
)


class GeminiClient:

    def __init__(self, api_key: str | None = None):

        self.api_key = api_key or GEMINI_API_KEY

        if not self.api_key:

            raise RuntimeError(
                "GEMINI_API_KEY belum diatur"
            )

        self.client = genai.Client(
            api_key=self.api_key
        )

        self.model = GEMINI_MODEL

    def generate(
        self,
        prompt: str
    ) -> str:

        response = (
            self.client.models.generate_content(
                model=self.model,
                contents=prompt
            )
        )

        if not response.text:

            raise RuntimeError(
                "Gemini tidak menghasilkan response"
            )

        return response.text

