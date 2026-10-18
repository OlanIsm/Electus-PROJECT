@echo off
title Electus ATS - Modular Monolith Startup
echo ===================================================
echo     Electus ATS - Modular Monolith Architecture
echo ===================================================
echo.
echo Starting all services...
echo   [OLLAMA]    Ollama AI Server     (port 11434)
echo   [BACKEND]   Electus Monolith API (port 3000)
echo   [FRONTEND]  React Frontend       (port 5173)
echo.
echo Press Ctrl+C to stop all services.
echo ===================================================
echo.

npx -y concurrently ^
  -n "OLLAMA,BACKEND,FRONTEND" ^
  -c "magenta,green,blue" ^
  "ollama serve" ^
  "cd electus-app && npm run start:dev" ^
  "cd electus-frontend && npm run dev"
