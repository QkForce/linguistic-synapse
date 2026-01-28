from utils.db import (
    db_connection,
    get_or_create_source,
    get_or_create_module,
    insert_lesson,
    insert_sentences,
    insert_lesson_log,
)
from config.mock_data import MODULES, LESSON_LOGS


def fill_mock_data():
    with db_connection() as conn:
        source_id = get_or_create_source(conn, "Mock Source")
        for module in MODULES:
            module_id = get_or_create_module(
                conn, source_id, module["title"], module["description"]
            )
            for lesson in module["lessons"]:
                lesson_id = insert_lesson(conn, module_id, lesson["title"])
                sentence_data = [
                    (
                        lesson_id,
                        sentence["number"],
                        {
                            "en": sentence.get("en", ""),
                            "ru": sentence.get("ru", ""),
                            "kk": sentence.get("kk", ""),
                        },
                    )
                    for sentence in lesson["sentences"]
                ]
                insert_sentences(conn, sentence_data)
    with db_connection() as conn:
        for log in LESSON_LOGS:
            insert_lesson_log(
                conn,
                log["lesson_id"],
                log["accuracy"],
                log["confidence"],
                log["time_efficiency"],
                log["final_score"],
            )
    print("✅ Mock деректер сәтті енгізілді!")


if __name__ == "__main__":
    fill_mock_data()
