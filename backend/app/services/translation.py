from google.cloud import translate_v2 as translate
from ..core import settings

def translate_text(text: str, target_language: str) -> str:
    # Initialize the Translation client with the API key
    if "-" in target_language:
        target_language = target_language.split("-")[0]
    api_key = settings.GOOGLE_CLOUD_KEY
    if not api_key:
        return ""

    translate_client = translate.Client(credentials=None, client_options={"api_key": api_key})

    # Translate the text
    result = translate_client.translate(text, target_language=target_language)

    return result["translatedText"]