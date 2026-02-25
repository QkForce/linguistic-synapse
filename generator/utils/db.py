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


def get_or_create_category(conn: sqlite3.Connection, title):
    cursor = conn.cursor()
    cursor.execute(
        "INSERT OR IGNORE INTO categories (title) VALUES (?)",
        (title,),
    )
    cursor.execute("SELECT id FROM categories WHERE title = ?", (title,))
    row = cursor.fetchone()
    return row[0] if row else None


def get_parsed_lessons(conn: sqlite3.Connection):
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT id, title, number
        FROM lessons
        WHERE parse_start IS NOT NULL AND parse_end IS NOT NULL
        ORDER BY number ASC
    """
    )
    return cursor.fetchall()


def insert_sentences(conn: sqlite3.Connection, data):
    """
    data: list of tuples (category_id, number, translations_dict)
    translations_dict: {'en': ['text1', 'text2'], 'ru': 'text1;text2'}
    """
    cursor = conn.cursor()
    sentence_ids = []
    for category_id, number, translations in data:
        cursor.execute(
            "INSERT INTO sentences (category_id, number) VALUES (?, ?)",
            (category_id, number),
        )
        sentence_id = cursor.lastrowid
        sentence_ids.append(sentence_id)
        for lang, content in translations.items():
            if not content:
                continue
            variants = content if isinstance(content, list) else content.split(";")
            for text in variants:
                clean_text = text.strip()
                if clean_text:
                    cursor.execute(
                        """
                        INSERT INTO sentence_translations 
                        (sentence_id, lang, text) 
                        VALUES (?, ?, ?)
                        """,
                        (sentence_id, lang.lower(), clean_text),
                    )
    return sentence_ids


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


def mark_lesson_correcting(conn: sqlite3.Connection, lesson_id, state):
    cursor = conn.cursor()
    column = "correct_start" if state == "start" else "correct_end"
    cursor.execute(
        f"UPDATE lessons SET {column} = CURRENT_TIMESTAMP WHERE id = ?",
        (lesson_id,),
    )


def insert_session_log(
    conn: sqlite3.Connection,
    category_id,
    native_lang,
    target_lang,
    total_time_ms,
    ideal_time_ms,
    accuracy,
    confidence,
    time_efficiency,
    time_overuse_ms,
    final_score,
):
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO session_logs 
        (
            category_id,
            native_lang,
            target_lang,
            total_time_ms,
            ideal_time_ms,
            accuracy,
            confidence,
            time_efficiency,
            time_overuse_ms,
            final_score
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            category_id,
            native_lang,
            target_lang,
            total_time_ms,
            ideal_time_ms,
            accuracy,
            confidence,
            time_efficiency,
            time_overuse_ms,
            final_score,
        ),
    )
    return cursor.lastrowid
