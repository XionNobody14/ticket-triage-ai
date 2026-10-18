#!/bin/bash
set -e
echo "===================================================="
echo " Iniciando Backend FastAPI - Ticket Triage AI"
echo "===================================================="
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
cd "$DIR/backend"

if [ ! -d "venv" ]; then
    echo "Creando venv e instalando dependencias..."
    python3 -m venv venv
    ./venv/bin/pip install -r requirements.txt
fi

if [ ! -f "tickets.db" ]; then
    echo "Poblando base de datos con semillas..."
    ./venv/bin/python seed_data.py
fi

echo "Iniciando Uvicorn en http://127.0.0.1:8000..."
./venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
