@echo off
echo Stopping server...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

echo Clearing MongoDB data...
node clear-and-restart.js

echo Starting fresh server...
timeout /t 2 /nobreak >nul
npm run start:both
