# Electus: AI-Powered Applicant Tracking System (ATS)
<img width="1893" height="1004" alt="image" src="https://github.com/user-attachments/assets/7b60959a-9c3e-45a1-90ea-6624d3cc9808" />

Electus is a state-of-the-art Applicant Tracking System (ATS) designed to revolutionize the hiring process. Built for modern HR teams, Electus goes beyond simple keyword matching by implementing **Retrieval-Augmented Generation (RAG)** and Hybrid Semantic Search. It understands the *context* of a candidate's CV and matches them accurately to complex queries using vector embeddings and cosine similarity.

## Key Features

*  **Hybrid Semantic Search (RAG):** Powered by Ollama Embeddings (`nomic-embed-text`) and cosine similarity scoring. Search for candidates using natural language (e.g., *"Find a detail-oriented backend developer with leadership skills"*). Combines vector-based semantic search with full-text search for maximum accuracy.
*  **Automated CV Processing:** Instantly extracts text from uploaded **PDFs** (via `pdf-parse`) and **DOCX** files (via `mammoth`), then generates an AI Summary, Skills Extraction, and Holland Code (RIASEC) personality assessment for every candidate using a local LLM.
*  **Unbiased Hiring (Blind Screening):** A built-in toggle to hide candidate names and photos, promoting objective and equitable talent acquisition.
*  **Smart Dashboard Analytics:** Real-time metrics and talent pool insights (Hiring Pipeline, Skill Distribution, Holland Code Distribution) calculated dynamically from the database and displayed in a responsive Bento-box layout.
* **Liquid Glass UI:** A highly polished, futuristic Glassmorphism interface with a WebGL-powered animated landing page that delivers a premium user experience.
*  **Bulk Management:** Bulk delete tools (Delete All, Remove Duplicates, Clear by Status) with confirmation dialogs to prevent accidental data loss.

##  Tech Stack

**Frontend:**
* React 18 / Vite
* TypeScript
* Tailwind CSS (Glassmorphism / Liquid Glass styling)
* Shadcn/UI
* Recharts (Analytics charts)
* Three.js (WebGL shader for landing page)

**Backend / Services:**
* NestJS API Gateway (`electus-app`)
* NestJS AI Service (`electus-ai`)
* NestJS Document Service (`electus-documents`)
* TypeORM
* PostgreSQL
* Ollama (Local LLM — `llama3.1` for CV analysis, `nomic-embed-text` for vector embeddings)
* Mammoth (DOCX text extraction)
* pdf-parse v2 (PDF text extraction)

##  System Architecture (RAG Pipeline)

```text
 ┌──────────────┐        ┌────────────────────────────┐
 │  Frontend    │───────▶│  electus-app               │
 │  React/Vite  │◀───────│  API Gateway + Candidates  │
 │  :8080/:5173 │        │  :3000                     │
 └──────────────┘        └────┬──────────┬──────────┬─┘
                              │          │          │
    ┌─────────────────────────┘          │          └─────────────────────────┐
    │                                    │                                    │
    ▼                                    ▼                                    ▼
 ┌──────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐      ┌─────────────────────────┐
 │  PostgreSQL      │     │  electus-documents  │     │  electus-ai         │─────▶│  Ollama (Local AI)      │
 │  Candidates DB   │     │  PDF/DOCX extraction│     │  CV analysis + embed│◀─────│  llama3.1 + nomic-embed │
 │  + Embeddings    │     │  :3003              │     │  :3002              │      │  :11434                 │
 └──────────────────┘     └─────────────────────┘     └─────────────────────┘      └─────────────────────────┘
```

### Pipeline Flow

1. **Ingestion:** CVs (PDF/DOCX) are uploaded to `electus-app` → file is sent to `electus-documents` for text extraction → extracted text is sent to `electus-ai` for structured analysis → `nomic-embed-text` generates vector embeddings → candidate data is stored in PostgreSQL by `electus-app`.
2. **Retrieval:** HR enters a semantic query → query is vectorized through `electus-ai` → cosine similarity is computed against stored candidate embeddings → combined with full-text search for hybrid scoring.
3. **Ranking:** Candidates are sorted by combined semantic + text match score → `matchScore` (0-100%) is returned to the frontend for display. The score is a ranking signal, not an absolute hiring confidence.

##  Getting Started

### Prerequisites

* **Node.js** (v18+)
* **PostgreSQL** (v14+)
* **Ollama** — [Download here](https://ollama.ai)

### 1. Setup Ollama (Local AI)

```bash
# Install and pull required models
ollama pull llama3.1          # For CV analysis (~815MB)
ollama pull nomic-embed-text   # For vector embeddings (~274MB)

# Ensure Ollama is running
ollama serve
```

### 2. Setup Database

```bash
# Create the database in PostgreSQL
psql -U postgres -c "CREATE DATABASE electus;"
```

### 3. Setup Backend Services

```bash
cd electus-app

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials

# Start the development server
npm run start:dev
# API Gateway runs on http://localhost:3000
```

In separate terminals, start the supporting services:

```bash
cd electus-ai
npm install
npm run start:dev
# AI Service runs on http://localhost:3002
```

```bash
cd electus-documents
npm install
npm run start:dev
# Document Service runs on http://localhost:3003
```

Optional service URLs for `electus-app`:

```bash
AI_SERVICE_URL=http://localhost:3002
DOCUMENT_SERVICE_URL=http://localhost:3003
```

Optional Ollama settings for `electus-ai`:

```bash
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1
```

### 4. Setup Frontend

```bash
cd electus-frontend

# Install dependencies
npm install

# Start the development server
npm run dev
# Frontend runs on http://localhost:8080
```

### 5. Open the App

Navigate to `http://localhost:8080` in your browser. You'll see the landing page — click **Try App** to get started!

##  Project Structure

```
electus-project/
├── electus-app/                    # API Gateway + Candidates service (NestJS)
│   └── src/
│       ├── ai/                          # Client for electus-ai
│       ├── candidates/
│       │   ├── candidate.entity.ts      # Database schema
│       │   ├── candidates.controller.ts # REST API endpoints
│       │   ├── candidates.service.ts    # Business logic + Search
│       │   ├── candidates.module.ts     # Module definition
│       │   └── gemini.service.ts        # Backward-compatible AI service alias
│       ├── documents/                   # Client for electus-documents
│       ├── app.module.ts
│       └── main.ts
│
├── electus-ai/                     # AI Service (NestJS + Ollama)
│   └── src/
│       ├── ai.controller.ts             # /ai/analyze, /ai/embed
│       ├── ai.service.ts                # Ollama CV analysis + embeddings
│       ├── app.module.ts
│       └── main.ts
│
├── electus-documents/              # Document Service (NestJS)
│   └── src/
│       ├── documents.controller.ts      # /documents/extract, /documents/extract-file
│       ├── documents.service.ts         # PDF/DOCX text extraction
│       ├── app.module.ts
│       └── main.ts
│
├── electus-frontend/               # Frontend (React + Vite)
│   └── src/
│       ├── pages/
│       │   ├── Landing.tsx              # WebGL landing page
│       │   ├── Login.tsx                # Login page
│       │   ├── SignUp.tsx               # Sign up page
│       │   ├── Index.tsx                # Dashboard
│       │   ├── Statistics.tsx           # Analytics page
│       │   └── BatchUpload.tsx          # CV upload page
│       ├── components/
│       │   ├── layout/                  # Sidebar, Dashboard layout
│       │   ├── dashboard/               # Candidate cards, modals
│       │   └── ui/                      # Shadcn + custom components
│       └── types/
│           └── candidate.ts             # TypeScript interfaces
│
└── README.md
```

##  API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/candidates/upload` | Upload a CV file (PDF/DOCX) for AI processing |
| `GET` | `/candidates` | Get all candidates |
| `GET` | `/candidates/search?q=...` | Hybrid semantic + text search |
| `GET` | `/candidates/:id` | Get single candidate |
| `PATCH` | `/candidates/:id/status` | Update review status |
| `DELETE` | `/candidates/:id` | Delete a candidate |
| `DELETE` | `/candidates/all` | Delete all candidates |
| `DELETE` | `/candidates/duplicates` | Remove duplicate entries |
| `DELETE` | `/candidates/status/:status` | Delete by status |

### Internal Service Endpoints

| Service | Method | Endpoint | Description |
|---------|--------|----------|-------------|
| `electus-ai` | `GET` | `/ai/health` | AI service health check |
| `electus-ai` | `POST` | `/ai/analyze` | Analyze extracted CV text |
| `electus-ai` | `POST` | `/ai/embed` | Generate text embedding |
| `electus-documents` | `GET` | `/documents/health` | Document service health check |
| `electus-documents` | `POST` | `/documents/extract` | Extract text from base64 JSON file payload |
| `electus-documents` | `POST` | `/documents/extract-file` | Extract text from multipart PDF/DOCX upload |

##  Running Tests

```bash
cd electus-app
npm run test
```

---

*Built with ❤️ for a smarter hiring future.*
