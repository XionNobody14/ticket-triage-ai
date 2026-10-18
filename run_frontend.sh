#!/bin/bash
set -e
echo "===================================================="
echo " Iniciando Frontend React + Vite - Ticket Triage AI"
echo "===================================================="
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
cd "$DIR/frontend"

if [ ! -d "node_modules" ]; then
    echo "Instalando paquetes npm..."
    npm install
fi

echo "Iniciando Vite en http://localhost:5173..."
npm run dev
