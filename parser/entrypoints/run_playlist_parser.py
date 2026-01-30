import utils.db as db
import config.config as config
from utils.yt_tools import get_playlist_videos


def parse_and_insert(pl_url):
    lessons = get_playlist_videos(pl_url)
    with db.db_connection() as conn:
        for lesson in lessons:
            video_id = lesson["id"]
            title = lesson["title"]
            number = lesson["number"]
            duration = lesson["duration"]
            db.insert_lesson(conn, video_id, title, number, duration)


if __name__ == "__main__":
    db.create_tables()
    parse_and_insert(config.PL_URL)
