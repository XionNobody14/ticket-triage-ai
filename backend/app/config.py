import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR / 'tickets.db'}")
API_TITLE = "Ticket Triage AI - Corporate Support API"
API_VERSION = "1.0.0"
API_DESCRIPTION = "API de triaje inteligente, clasificación y resolución de incidencias corporativas."
CORS_ORIGINS = ["*"]
