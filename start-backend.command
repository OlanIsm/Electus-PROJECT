#!/bin/bash
echo "==================================================="
echo "    Electus ATS - Backend Services Startup"
echo "==================================================="
echo ""
echo "Starting backend services..."
echo "  [OLLAMA]    Ollama AI Server     (port 11434)"
echo "  [DOCS]      Document Service     (port 3003)"
echo "  [AI]        AI Service           (port 3002)"
echo "  [BACKEND]   Candidate Service    (port 3000)"
echo ""
echo "Press Ctrl+C to stop all services."
echo "==================================================="
echo ""

npx -y concurrently \
  -n "OLLAMA,DOCS,AI,BACKEND" \
  -c "magenta,yellow,cyan,green" \
  "ollama serve" \
  "cd electus-documents && npm run start:dev" \
  "cd electus-ai && npm run start:dev" \
  "cd electus-app && npm run start:dev"
