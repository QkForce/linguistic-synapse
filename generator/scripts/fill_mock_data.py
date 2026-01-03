from utils.db import (
    db_connection,
    insert_source,
    insert_module,
    insert_lesson,
    insert_lesson_log,
)

MODULES = [
    {
        "title": "Module 1: Основы",
        "description": "Базалық сөйлемдер мен құрылымдар",
        "lessons": [
            {
                "title": "Lesson 1: Сәлемдесу және танысу",
            },
            {
                "title": "Lesson 2: Өзің туралы айту",
            },
        ],
    },
    {
        "title": "Module 2: Грамматика",
        "description": "Күрделі шақтар мен жалғаулар",
        "lessons": [
            {
                "title": "Lesson 1: Өткен шақ",
            }
        ],
    },
    {
        "title": "Module 3: Практика",
        "description": "Күнделікті сөйлесу үлгілері",
        "lessons": [{"title": "Lesson 1: Дүкенде"}],
    },
]

LESSON_LOGS = [
    {
        "lesson_id": 1,
        "accuracy": 85,
        "confidence": 90,
        "time_efficiency": 80,
        "final_score": 85,
    },
]


def fill_mock_data():
    with db_connection() as conn:
        source_id = insert_source(conn, "Mock Source")
        for module in MODULES:
            module_id = insert_module(
                conn, source_id, module["title"], module["description"]
            )
            for lesson in module["lessons"]:
                insert_lesson(conn, module_id, lesson["title"])
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
