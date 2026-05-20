# Electus AI Service

NestJS microservice for CV analysis and embedding generation. It wraps local Ollama calls so the main API does not talk to the model runtime directly.

## Responsibilities

- Analyze extracted CV text into structured candidate data
- Generate skills, AI summary, education, experience, portfolio fields, and Holland Code data
- Generate vector embeddings for CVs and search queries
- Provide health checks for service orchestration

## Runtime

Default port: `3002`

Optional environment variables:

```bash
PORT=3002
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=gemma3:1b
```

Required Ollama models:

```bash
ollama pull gemma3:1b
ollama pull nomic-embed-text
```

## Commands

```bash
npm install
npm run start:dev
npm run build
npm run test
```

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/ai/health` | Health check |
| `POST` | `/ai/analyze` | Analyze CV text into structured JSON |
| `POST` | `/ai/embed` | Generate vector embedding for text |
