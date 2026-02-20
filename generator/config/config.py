import os
from dotenv import load_dotenv

load_dotenv()

GENERATIVE_AI_API_KEY = os.getenv("GENERATIVE_AI_API_KEY")
MODEL_NAME = os.getenv("MODEL_NAME", "gemini-2.5-flash")
DB_PATH = os.getenv("DB_PATH")
SQL_CREATE_TABLES = os.getenv("SQL_CREATE_TABLES")

CORRECTOR_MAX_RETRIES = int(os.getenv("CORRECTOR_MAX_RETRIES", 5))
CORRECTOR_RETRY_DELAY_SECONDS = int(os.getenv("CORRECTOR_RETRY_DELAY_SECONDS", 300))
