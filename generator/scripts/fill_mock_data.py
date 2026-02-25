import sqlite3
from utils.db import (
    db_connection,
    get_or_create_category,
    insert_sentences,
    insert_session_log,
)
from config.mock_data import CATEGORIES, SESSION_LOGS


def fill_mock_categories(conn: sqlite3.Connection):
    for category in CATEGORIES:
        category_id = get_or_create_category(
            conn,
            category["title"],
        )
        sentence_data = [
            (
                category_id,
                sentence["number"],
                {
                    "en": sentence.get("en", []),
                    "ru": sentence.get("ru", []),
                    "kk": sentence.get("kk", []),
                },
            )
            for sentence in category["sentences"]
        ]
        insert_sentences(conn, sentence_data)


def fill_mock_session_logs(conn: sqlite3.Connection):
    for log in SESSION_LOGS:
        insert_session_log(
            conn,
            log["category_id"],
            log["native_lang"],
            log["target_lang"],
            log["total_time_ms"],
            log["ideal_time_ms"],
            log["accuracy"],
            log["confidence"],
            log["time_efficiency"],
            log["time_overuse_ms"],
            log["final_score"],
        )


if __name__ == "__main__":
    with db_connection() as conn:
        fill_mock_categories(conn)
        fill_mock_session_logs(conn)
    print("✅ Mock деректер сәтті енгізілді!")
