import os
import sqlite3
from contextlib import contextmanager
import config.config as config


@contextmanager
def db_connection():
    conn = sqlite3.connect(config.DB_PATH)
    try:
        conn.execute("PRAGMA foreign_keys = ON")
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def create_tables():
    if not os.path.exists(config.SQL_SCHEMA_PATH):
        raise FileNotFoundError(f"SQL schema file not found: {config.SQL_SCHEMA_PATH}")
    with open(config.SQL_SCHEMA_PATH, "r", encoding="utf-8") as f:
        sql_script = f.read()
    with db_connection() as conn:
        conn.executescript(sql_script)
        print("[DB] The database tables have been created successfully.")


def get_unparsed_lessons(conn: sqlite3.Connection):
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT id 
        FROM lessons 
        WHERE parse_start IS NULL OR parse_end IS NULL
        """
    )
    rows = cursor.fetchall()
    return rows


def insert_sentences(conn: sqlite3.Connection, data):
    """
    data: list of tuples (lesson_id, number, translations_dict)
    translations_dict: dict, for example {'en': 'I work here', 'ru': 'Я работаю здесь'}
    """
    cursor = conn.cursor()
    for lesson_id, number, translations in data:
        cursor.execute(
            "INSERT INTO sentences (lesson_id, number) VALUES (?, ?)",
            (lesson_id, number),
        )
        sentence_id = cursor.lastrowid

        for lang, text in translations.items():
            if text and text.strip():
                cursor.execute(
                    """
                    INSERT OR IGNORE INTO sentence_translations 
                    (sentence_id, lang, text) 
                    VALUES (?, ?, ?)
                    """,
                    (sentence_id, lang.lower(), text.strip()),
                )


def mark_lesson_parse_start(conn: sqlite3.Connection, lesson_id):
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE lessons SET parse_start=CURRENT_TIMESTAMP WHERE id=?", (lesson_id,)
    )


def mark_lesson_parse_end(conn: sqlite3.Connection, lesson_id):
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE lessons SET parse_end=CURRENT_TIMESTAMP WHERE id=?", (lesson_id,)
    )


def insert_lesson(conn: sqlite3.Connection, id, title, number, duration):
    conn.execute(
        "INSERT INTO lessons (id, title, number, duration) VALUES (?, ?, ?, ?)",
        (id, title, number, duration),
    )


def get_all_lessons(conn: sqlite3.Connection, properties: list[str] | None = None):
    cursor = conn.cursor()
    if properties is None:
        cursor.execute("SELECT * FROM lessons")
    else:
        props_str = ", ".join(properties)
        cursor.execute(f"SELECT {props_str} FROM lessons")
    return cursor.fetchall()


def get_or_create_tag(conn: sqlite3.Connection, tag_name: str) -> int:
    cursor = conn.cursor()
    cursor.execute(
        "INSERT OR IGNORE INTO tags (name) VALUES (?)", (tag_name.lower().strip(),)
    )
    cursor.execute("SELECT id FROM tags WHERE name = ?", (tag_name.lower().strip(),))
    return cursor.fetchone()[0]


def add_tags_to_lesson(conn: sqlite3.Connection, lesson_id: str, tags: list[str]):
    if not tags:
        return
    cursor = conn.cursor()
    for tag_name in tags:
        tag_id = get_or_create_tag(conn, tag_name)
        cursor.execute(
            "INSERT OR IGNORE INTO lesson_tags (lesson_id, tag_id) VALUES (?, ?)",
            (lesson_id, tag_id),
        )
