import os
import sqlite3
from contextlib import contextmanager
import config.config as config
from config.seeds import LANGUAGES_SEED


@contextmanager
def db_connection(db_path=None):
    conn = sqlite3.connect(db_path or config.DB_PATH)
    try:
        conn.execute("PRAGMA foreign_keys = ON")
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def load_sql_file(file_path):
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"SQL file not found: {file_path}")
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()


def create_tables(conn: sqlite3.Connection):
    sql_script = load_sql_file(config.SQL_CREATE_TABLES)
    conn.executescript(sql_script)
    print("[DB] The database tables have been created successfully.")


def seed_database(conn: sqlite3.Connection):
    cursor = conn.cursor()
    cursor.executemany(
        "INSERT OR IGNORE INTO languages (code, name) VALUES (?, ?)", LANGUAGES_SEED
    )
    print("[DB] The database has been seeded with initial data.")


def get_or_create_source(conn: sqlite3.Connection, name):
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM sources WHERE name = ?", (name,))
    row = cursor.fetchone()
    if row:
        return row[0]

    cursor.execute("INSERT INTO sources (name) VALUES (?)", (name,))
    return cursor.lastrowid


def get_or_create_module(conn: sqlite3.Connection, source_id, title, description):
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id FROM modules WHERE source_id = ? AND title = ?", (source_id, title)
    )
    row = cursor.fetchone()
    if row:
        return row[0]

    cursor.execute(
        "INSERT INTO modules (source_id, title, description) VALUES (?, ?, ?)",
        (source_id, title, description),
    )
    return cursor.lastrowid


def insert_lesson(conn: sqlite3.Connection, module_id, title):
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO lessons (title, module_id) VALUES (?, ?)",
        (title, module_id),
    )
    return cursor.lastrowid


def get_parsed_lessons(conn: sqlite3.Connection):
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT id, title, number
        FROM lessons
        WHERE processed = 'parsed'
        ORDER BY number ASC
    """
    )
    return cursor.fetchall()


def insert_sentences(conn: sqlite3.Connection, data):
    """
    data: list of tuples (lesson_id, number, translations_dict)
    """
    cursor = conn.cursor()
    last_id = None
    for lesson_id, number, translations in data:
        cursor.execute(
            "INSERT INTO sentences (lesson_id, number) VALUES (?, ?)",
            (lesson_id, number),
        )
        sentence_id = cursor.lastrowid
        last_id = sentence_id

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
    return last_id


def get_raw_sentences(conn: sqlite3.Connection, lesson_id: str):
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT s.id, st.text
        FROM sentences s
        JOIN sentence_translations st ON s.id = st.sentence_id
        WHERE s.lesson_id = ? AND st.lang = 'en_raw'
        ORDER BY s.number ASC
    """,
        (lesson_id,),
    )
    rows = cursor.fetchall()
    return [{"id": row[0], "text": row[1]} for row in rows]


def insert_sentence_translations(conn: sqlite3.Connection, translations: list):
    """
    translations: [(sentence_id, lang, text), ...]
    """
    if not translations:
        return
    cursor = conn.cursor()
    cursor.executemany(
        """
        INSERT OR REPLACE INTO sentence_translations (sentence_id, lang, text)
        VALUES (?, ?, ?)
        """,
        translations,
    )


def mark_lesson_corrected(conn: sqlite3.Connection, lesson_id):
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE lessons SET processed = 'corrected' WHERE id = ?", (lesson_id,)
    )


def insert_lesson_log(
    conn: sqlite3.Connection,
    lesson_id,
    accuracy,
    confidence,
    time_efficiency,
    final_score,
):
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO lesson_logs 
        (lesson_id, accuracy, confidence, time_efficiency, final_score) 
        VALUES (?, ?, ?, ?, ?)
        """,
        (lesson_id, accuracy, confidence, time_efficiency, final_score),
    )
    return cursor.lastrowid
