@echo off
echo ====================================================
echo  Iniciando Frontend React + Vite - Ticket Triage AI
echo ====================================================
cd /d "%~dp0frontend"
if not exist "node_modules" (
    echo Instalando paquetes npm...
    call npm install
)
echo Dashboard Vite iniciando en http://localhost:5173 ...
call npm run dev
