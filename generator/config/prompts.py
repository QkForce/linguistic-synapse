from typing import TypedDict, Any, Dict


class AIConfig(TypedDict):
    prompt: str
    response_schema: Dict[str, Any]


CORRECTOR_TASK: AIConfig = {
    "prompt": (
        "Сен — кәсіби ағылшын тілі мұғалімі және лингвист-редакторсың. "
        "Саған YouTube видеосынан OCR арқылы алынған шикі сөйлемдер беріледі.\n\n"
        "Тапсырма:\n"
        "1. OCR қателерін түзе (мысалы, 'h3llo' -> 'hello').\n"
        "2. Сөйлемді табиғи орыс тіліне аудар.\n"
        "3. Форматты сақта: ID өзгермеуі тиіс."
    ),
    "response_schema": {
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
                "id": {"type": "integer"},
                "en": {"type": "string"},
                "ru": {"type": "string"},
            },
            "required": ["id", "en", "ru"],
        },
    },
}
