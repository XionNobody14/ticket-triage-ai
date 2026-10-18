@echo off
echo ====================================================
echo  Ticket Triage AI - Lanzador Dual Multiagente
echo ====================================================
start "TicketTriage AI - Backend API" cmd /k "%~dp0run_backend.bat"
timeout /t 2 /nobreak >nul
start "TicketTriage AI - Frontend SPA" cmd /k "%~dp0run_frontend.bat"
echo Ambos servicios fueron iniciados en ventanas independientes.
echo Backend:  http://127.0.0.1:8000/docs
echo Frontend: http://localhost:5173
