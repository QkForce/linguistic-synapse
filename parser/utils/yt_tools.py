import subprocess
from yt_dlp import YoutubeDL
import config.config as config


def get_video_stream_url(youtube_url):
    ydl_opts = {
        "format": "bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4",
        "quiet": True,
        "skip_download": True,
    }
    with YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(youtube_url, download=False)
        # выбираем прямую ссылку на видео
        formats = info.get("formats", [])
        for f in formats:
            if f.get("ext") == "mp4" and f.get("acodec") != "none" and f.get("vcodec") != "none":
                return f["url"]
    return None


def download_video(video_id, quality):
    config.VIDEO_DIR.mkdir(parents=True, exist_ok=True)
    output_path = config.VIDEO_DIR / f"{video_id}.mp4"

    if output_path.exists():
        print(f"[INFO] Видео {video_id} уже скачано.")
        return output_path

    url = f"https://www.youtube.com/watch?v={video_id}"
    print(f"[INFO] Скачиваю видео {video_id}...")

    cmd = [
        "yt-dlp",
        "-f",
        f"bestvideo[height<={quality}][ext=mp4]+bestaudio[ext=m4a]/best[height<={quality}][ext=mp4]",
        "-o",
        output_path,
        url,
    ]

    try:
        subprocess.run(cmd, check=True)
        print(f"[✓] Видео {video_id} скачано.")
        return output_path
    except subprocess.CalledProcessError as e:
        print(f"[✗] yt-dlp не смог скачать видео {video_id}: {e}")
        return None


def get_playlist_videos(playlist_url):
    ydl_opts = {
        "quiet": True,
        "extract_flat": True,  # Не скачивает, а просто парсит ссылки
        "dump_single_json": True,
    }

    with YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(playlist_url, download=False)

    videos = info.get("entries", [])
    number = 0
    result = []
    for video in videos:
        print(video)
        number += 1
        result.append(
            {
                "id": video.get("id"),
                "title": video.get("title"),
                "url": f"https://www.youtube.com/watch?v={video.get('id')}",
                "duration": video.get("duration"),
                "number": number,
            }
        )

    return result
