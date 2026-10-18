@echo off
echo ====================================================
echo  Iniciando Backend FastAPI - Ticket Triage AI
echo ====================================================
cd /d "%~dp0backend"
if not exist "venv\Scripts\python.exe" (
    echo Creando entorno virtual venv...
    python -m venv venv
    call venv\Scripts\pip install -r requirements.txt
)
if not exist "tickets.db" (
    echo Inicializando base de datos y datos semilla...
    call venv\Scripts\python seed_data.py
)
echo Servidor Uvicorn iniciando en http://127.0.0.1:8000 ...
call venv\Scripts\uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
