@echo off
echo Restarting server...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul
cd backend
start "EduManage Server" node server.js
echo Server restarted!
pause