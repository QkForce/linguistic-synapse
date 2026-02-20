from google.genai.errors import ClientError

from utils.db import (
    db_connection,
    get_parsed_lessons,
    get_raw_sentences,
    insert_sentence_translations,
    mark_lesson_correcting,
)
from utils.helpers import retry_on_error
from utils.ai_client import AIGenerator
from config.config import (
    DB_PATH,
    CORRECTOR_MAX_RETRIES,
    CORRECTOR_RETRY_DELAY_SECONDS,
)
from config.prompts import CORRECTOR_TASK


@retry_on_error(
    retries=CORRECTOR_MAX_RETRIES,
    delay=CORRECTOR_RETRY_DELAY_SECONDS,
    error_types=(ClientError,),
)
def correct_lesson(lesson, ai):
    l_id, title, number = lesson
    with db_connection(DB_PATH) as conn:
        mark_lesson_correcting(conn, l_id, "start")
        raw_sentences = get_raw_sentences(conn, l_id)

        if not raw_sentences:
            raise Exception(f"No raw sentences found for lesson {l_id}")

        print(f"Processing Lesson {number}: {l_id}")

        result = ai.ask_ai(
            system_instruction=CORRECTOR_TASK["prompt"],
            user_data=raw_sentences,
            response_schema=CORRECTOR_TASK["response_schema"],
        )

        if not result or not isinstance(result, list):
            print(f"AI returned no valid result for lesson {l_id}")
            raise Exception("AI returned no valid result")
        if len(result) != len(raw_sentences):
            print(f"AI returned incomplete result for lesson {l_id}")
            raise Exception("AI returned incomplete result")

        db_data = []
        for item in result:
            db_data.append((item["id"], "en", item["en"]))
            db_data.append((item["id"], "ru", item["ru"]))
            db_data.append((item["id"], "kk", item["kk"]))
            db_data.append((item["id"], "aspect", item["aspect"]))

        insert_sentence_translations(conn, db_data)
        mark_lesson_correcting(conn, l_id, "end")
        print(f"Successfully corrected: {title}")


def correct_lessons(ai):
    with db_connection(DB_PATH) as conn:
        lessons = get_parsed_lessons(conn)
    for lesson in lessons:
        correct_lesson(lesson, ai)


if __name__ == "__main__":
    ai = AIGenerator()
    correct_lessons(ai)
