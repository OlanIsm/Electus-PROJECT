#!/bin/bash
echo "==================================================="
echo "    Electus ATS - Backend Modular Monolith Startup"
echo "==================================================="
echo ""
echo "Starting backend services..."
echo "  [OLLAMA]    Ollama AI Server     (port 11434)"
echo "  [BACKEND]   Electus Monolith API (port 3000)"
echo ""
echo "Press Ctrl+C to stop all services."
echo "==================================================="
echo ""

npx -y concurrently \
  -n "OLLAMA,BACKEND" \
  -c "magenta,green" \
  "ollama serve" \
  "cd electus-app && npm run start:dev"
