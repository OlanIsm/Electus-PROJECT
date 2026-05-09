@echo off
title Electus ATS Startup
echo ===================================================
echo     🚀 Starting Electus ATS (1-Click Start) 🚀
echo ===================================================
echo.
echo This will start all necessary services in one window.
echo Press Ctrl+C at any time to stop all services.
echo.

:: We use npx concurrently to run all processes in the same terminal with different colors
npx -y concurrently ^
  -n "OLLAMA,BACKEND,FRONTEND" ^
  -c "magenta,green,blue" ^
  "ollama serve" ^
  "cd electus-app && npm run start:dev" ^
  "cd electus-frontend && npm run dev"
