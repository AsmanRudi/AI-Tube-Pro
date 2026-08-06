from google import genai
from google.genai import errors as genai_errors

from ..config.ai_config import (
    GEMINI_API_KEY,
    GEMINI_MODEL
)


class GeminiClient:

    def __init__(self, api_key: str | None = None):

        self.api_key = (api_key or GEMINI_API_KEY or "").strip()

        if not self.api_key:

            raise RuntimeError(
                "API Key Gemini belum diatur. Silakan daftarkan API Key di menu API Key terlebih dahulu."
            )

        self.client = genai.Client(
            api_key=self.api_key
        )

        self.model = GEMINI_MODEL

    def generate(
        self,
        prompt: str
    ) -> str:

        try:

            response = (
                self.client.models.generate_content(
                    model=self.model,
                    contents=prompt
                )
            )

        except genai_errors.ClientError as e:

            # Tangkap error dari Google API dengan detail yang jelas
            error_msg = e.message or str(e)

            if "API key" in error_msg.lower() and ("invalid" in error_msg.lower() or "not valid" in error_msg.lower()):
                raise RuntimeError(
                    "API Key Gemini tidak valid. Periksa kembali API Key Anda di Google AI Studio."
                )

            if "not found" in error_msg.lower() or "model" in error_msg.lower():
                raise RuntimeError(
                    f"Model Gemini tidak ditemukan atau tidak tersedia: {error_msg}"
                )

            raise RuntimeError(
                f"Gemini API error: {error_msg}"
            )

        except Exception as e:

            raise RuntimeError(
                f"Gagal menghubungi Gemini API: {str(e)}"
            )

        if not response.text:

            raise RuntimeError(
                "Gemini tidak menghasilkan response"
            )

        return response.text

