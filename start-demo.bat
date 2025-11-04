@echo off
echo Starting Islamic Finance Workflows Demo...
echo.
echo [1/3] Starting Backend API on port 8000...
start "Backend API" cmd /k "cd backend && .\venv\Scripts\activate && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
timeout /t 3 /nobreak > nul

echo [2/3] Starting Frontend Dev Server on port 3040...
start "Frontend Dev" cmd /k "npm run dev"
timeout /t 5 /nobreak > nul

echo [3/3] Opening browser...
timeout /t 3 /nobreak > nul
start http://localhost:3040

echo.
echo ========================================
echo   Islamic Finance Workflows Demo
echo ========================================
echo   Frontend: http://localhost:3040
echo   Backend:  http://localhost:8000
echo   Health:   http://localhost:8000/health
echo ========================================
echo.
echo Press any key to stop all servers...
pause > nul
taskkill /FI "WindowTitle eq Backend API*" /T /F
taskkill /FI "WindowTitle eq Frontend Dev*" /T /F
