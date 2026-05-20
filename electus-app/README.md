# Electus App Service

Main NestJS API for Electus. This service owns candidate CRUD, upload orchestration, PostgreSQL persistence, and hybrid search ranking.

## Responsibilities

- Exposes public candidate endpoints under `/candidates`
- Receives PDF/DOCX uploads from the frontend
- Calls `electus-documents` to extract CV text
- Calls `electus-ai` to analyze CV text and generate embeddings
- Stores candidates and embeddings in PostgreSQL
- Computes hybrid semantic + text search scores

## Runtime

Default port: `3000`

Optional environment variables:

```bash
PORT=3000
AI_SERVICE_URL=http://localhost:3002
DOCUMENT_SERVICE_URL=http://localhost:3003
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=electus
```

## Commands

```bash
npm install
npm run start:dev
npm run build
npm run test
```

## Main Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/candidates/upload` | Upload and process a PDF/DOCX CV |
| `GET` | `/candidates` | List all candidates |
| `GET` | `/candidates/search?q=...` | Hybrid semantic + text search |
| `PATCH` | `/candidates/:id/status` | Update candidate review status |
| `DELETE` | `/candidates/:id` | Delete one candidate |
| `DELETE` | `/candidates/all` | Delete all candidates |
| `DELETE` | `/candidates/duplicates` | Remove duplicate candidates |
