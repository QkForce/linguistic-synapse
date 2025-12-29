import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ENV_PATH = os.path.join(BASE_DIR, ".env")
load_dotenv(ENV_PATH)

DB_PATH = os.getenv("DB_PATH", "data/app.db")
SQL_SCHEMA_PATH = os.path.join(os.getcwd(), "migrations", "create_tables.sql")
PL_URL = os.getenv("PL_URL")
TESSERACT_PATH = os.getenv(
    "TESSERACT_PATH", r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)
VIDEO_DIR = Path(os.getenv("VIDEO_DIR", "data/videos"))
OUTPUT_FILE = "output.txt"
FRAME_INTERVAL = int(os.getenv("FRAME_INTERVAL", 30))
VIDEO_QUALITY = os.getenv("VIDEO_QUALITY", "360")
FX_FY = float(os.getenv("FX_FY", 0.75))