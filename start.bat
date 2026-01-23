@echo off
echo Starting MindWeave EduManage Application...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd /d %~dp0 && node backend/server.js"

timeout /t 3 /nobreak >nul

echo Starting Frontend Development Server...
start "Frontend Server" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:4000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit...
pause >nul