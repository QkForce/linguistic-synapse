from collections import Counter
from utils import db
import re

STOP_WORDS = {
    "английский",
    "язык",
    "с",
    "нуля",
    "до",
    "автоматизма",
    "урок",
    "уроки",
    "английского",
    "языка",
    "часть",
    "английском",
    "в",
    "языке",
    "для",
    "супер",
    "упражнения",
    "hd",
    "new",
}


def run_tag_analyzer(conn: db.sqlite3.Connection):
    all_words = []
    lessons = db.get_all_lessons(conn, properties=["LOWER(title)"])
    for lesson in lessons:
        title = lesson[0]
        words = title.split()
        words = [word.lower() for word in words]
        words = [word for word in words if word not in STOP_WORDS]
        words = [word for word in words if re.match(r"^[a-zA-Zа-яА-ЯёЁ]+$", word)]
        all_words.extend(words)
    counter = Counter(all_words)
    return counter.most_common(100)


if __name__ == "__main__":
    with db.db_connection() as conn:
        common_tags = run_tag_analyzer(conn)
        print("Most common tags in lesson titles:")
        for tag, count in common_tags:
            print(f"{tag}: {count}")
