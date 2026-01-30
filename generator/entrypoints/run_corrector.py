from utils.db import (
    db_connection,
    get_parsed_lessons,
    get_raw_sentences,
    insert_sentence_translations,
    mark_lesson_correcting,
)
from config.config import DB_PATH
from config.prompts import CORRECTOR_TASK
from utils.ai_client import AIGenerator


def correct_db_sentences(ai):
    with db_connection(DB_PATH) as conn:
        lessons = get_parsed_lessons(conn)

    for lesson in lessons:
        l_id, title, number = lesson
        with db_connection(DB_PATH) as conn:
            mark_lesson_correcting(conn, l_id, "start")
            raw_sentences = get_raw_sentences(conn, l_id)

            if not raw_sentences:
                continue

            print(f"Processing Lesson {number}: {l_id}")

            result = ai.ask_ai(
                system_instruction=CORRECTOR_TASK["prompt"],
                user_data=raw_sentences,
                response_schema=CORRECTOR_TASK["response_schema"],
            )

            if result and isinstance(result, list):
                db_data = []
                for item in result:
                    db_data.append((item["id"], "en", item["en"]))
                    db_data.append((item["id"], "ru", item["ru"]))

                insert_sentence_translations(conn, db_data)
                mark_lesson_correcting(conn, l_id, "end")
                print(f"Successfully corrected: {title}")


if __name__ == "__main__":
    ai = AIGenerator()
    correct_db_sentences(ai)
