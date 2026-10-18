import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# Inspección y normalización resiliente de DATABASE_URL
raw_db_url = os.getenv("DATABASE_URL")
if raw_db_url:
    if raw_db_url.startswith("postgres://"):
        raw_db_url = raw_db_url.replace("postgres://", "postgresql://", 1)
    if raw_db_url.startswith("postgresql://"):
        raw_db_url = raw_db_url.replace("postgresql://", "postgresql+psycopg2://", 1)
    DB_PATH = raw_db_url
else:
    DB_PATH = f"sqlite:///{BASE_DIR / 'tickets.db'}"

API_TITLE = "Ticket Triage AI - Corporate Support API"
API_VERSION = "1.0.0"
API_DESCRIPTION = "API de triaje inteligente, clasificación y resolución de incidencias corporativas."
CORS_ORIGINS = ["*"]
