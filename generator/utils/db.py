import os
import sqlite3
from contextlib import contextmanager
import config.config as config
from config.seeds import LANGUAGES_SEED


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


def insert_source(conn: sqlite3.Connection, name):
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO sources (name) VALUES (?)",
        (name,),
    )
    return cursor.lastrowid


def insert_module(conn: sqlite3.Connection, title, source_id):
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO modules (title, source_id) VALUES (?, ?)",
        (title, source_id),
    )
    return cursor.lastrowid


def insert_lesson(conn: sqlite3.Connection, title, module_id):
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO lessons (title, module_id) VALUES (?, ?)",
        (title, module_id),
    )
    return cursor.lastrowid


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
