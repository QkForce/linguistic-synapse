import cv2
from utils.tools import log_time
from utils.yt_tools import get_video_stream_url, download_video
from utils.video_parser_tools import parse_video_frames
import utils.db as db
import config.config as config


@log_time
def parse_video_stream(youtube_url):
    stream_url = get_video_stream_url(youtube_url)

    if not stream_url:
        print("Stream URL not found")
        return

    cap = cv2.VideoCapture(stream_url)
    lines = parse_video_frames(cap, frame_interval=30)
    return lines


@log_time
def parse_video_file(lesson_id):
    video_path = download_video(lesson_id, config.VIDEO_QUALITY)

    if not video_path:
        return None

    print(f"[INFO] Начинается обработка {video_path.name}...")
    cap = cv2.VideoCapture(video_path)
    lines = parse_video_frames(cap, config.FRAME_INTERVAL)
    return lines


if __name__ == "__main__":
    with db.db_connection() as conn:
        lessons = db.get_unprocessed_videos(conn)

    for lesson in lessons:
        with db.db_connection() as conn:
            lesson_id = lesson[0]
            lines = parse_video_file(lesson_id)
            data = [
                (lesson_id, number, {"en": lines[number]})
                for number in lines.keys()
            ]
            db.insert_sentences(conn, data)
            db.mark_video_processed(conn, lesson_id)
            print(f"[✓] Готово! YT_ID: {lesson_id}")
    print(f"[✓] Готово! Результат в {config.OUTPUT_FILE}")
