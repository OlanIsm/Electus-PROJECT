# 🚀 Electus: AI-Powered Applicant Tracking System (ATS)

Electus is a state-of-the-art Applicant Tracking System (ATS) designed to revolutionize the hiring process. Built for modern HR teams, Electus goes beyond simple keyword matching by implementing **Retrieval-Augmented Generation (RAG)** and Hybrid Semantic Search. It understands the *context* of a candidate's CV and matches them accurately to complex queries using vector embeddings and cosine similarity.

## ✨ Key Features

* 🧠 **Hybrid Semantic Search (RAG):** Powered by Ollama Embeddings (`nomic-embed-text`) and cosine similarity scoring. Search for candidates using natural language (e.g., *"Find a detail-oriented backend developer with leadership skills"*). Combines vector-based semantic search with full-text search for maximum accuracy.
* 📄 **Automated CV Processing:** Instantly extracts text from uploaded **PDFs** (via `pdf-parse`) and **DOCX** files (via `mammoth`), then generates an AI Summary, Skills Extraction, and Holland Code (RIASEC) personality assessment for every candidate using a local LLM.
* ⚖️ **Unbiased Hiring (Blind Screening):** A built-in toggle to hide candidate names and photos, promoting objective and equitable talent acquisition.
* 📊 **Smart Dashboard Analytics:** Real-time metrics and talent pool insights (Hiring Pipeline, Skill Distribution, Holland Code Distribution) calculated dynamically from the database and displayed in a responsive Bento-box layout.
* 💎 **Liquid Glass UI:** A highly polished, futuristic Glassmorphism interface with a WebGL-powered animated landing page that delivers a premium user experience.
* 🗑️ **Bulk Management:** Bulk delete tools (Delete All, Remove Duplicates, Clear by Status) with confirmation dialogs to prevent accidental data loss.

## 🛠️ Tech Stack

**Frontend:**
* React 18 / Vite
* TypeScript
* Tailwind CSS (Glassmorphism / Liquid Glass styling)
* Shadcn/UI
* Recharts (Analytics charts)
* Three.js (WebGL shader for landing page)

**Backend:**
* NestJS (Node.js framework)
* TypeORM
* PostgreSQL
* Ollama (Local LLM — `gemma3:1b` for CV analysis, `nomic-embed-text` for vector embeddings)
* Mammoth (DOCX text extraction)
* pdf-parse (PDF text extraction)

## 🏗️ System Architecture (RAG Pipeline)

```
┌──────────────┐    ┌──────────────────┐    ┌─────────────────────────┐
│  Frontend    │───▶│  NestJS Backend  │───▶│  Ollama (Local LLM)     │
│  React/Vite  │◀───│  REST API        │◀───│  gemma3:1b + nomic-embed│
│  :8080       │    │  :3000           │    │  :11434                 │
└──────────────┘    └────────┬─────────┘    └─────────────────────────┘
                             │
                    ┌────────▼─────────┐
                    │   PostgreSQL     │
                    │   Candidates DB  │
                    │   + Embeddings   │
                    └──────────────────┘
```

### Pipeline Flow

1. **Ingestion:** CVs (PDF/DOCX) are uploaded → Text extracted → `gemma3:1b` generates structured analysis (skills, summary, Holland Code) → `nomic-embed-text` generates vector embedding → All data stored in PostgreSQL.
2. **Retrieval:** HR enters a semantic query → Query is vectorized via `nomic-embed-text` → Cosine similarity is computed against all candidate embeddings → Combined with full-text search for hybrid scoring.
3. **Ranking:** Candidates are sorted by combined semantic + text match score → `matchScore` (0-100%) is returned to the frontend for display.

## 🚀 Getting Started

### Prerequisites

* **Node.js** (v18+)
* **PostgreSQL** (v14+)
* **Ollama** — [Download here](https://ollama.ai)

### 1. Setup Ollama (Local AI)

```bash
# Install and pull required models
ollama pull gemma3:1b          # For CV analysis (~815MB)
ollama pull nomic-embed-text   # For vector embeddings (~274MB)

# Ensure Ollama is running
ollama serve
```

### 2. Setup Database

```bash
# Create the database in PostgreSQL
psql -U postgres -c "CREATE DATABASE electus;"
```

### 3. Setup Backend

```bash
cd electus-app

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials

# Start the development server
npm run start:dev
# Backend runs on http://localhost:3000
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

## 📁 Project Structure

```
electus-project/
├── electus-app/                    # Backend (NestJS)
│   └── src/
│       ├── candidates/
│       │   ├── candidate.entity.ts      # Database schema
│       │   ├── candidates.controller.ts # REST API endpoints
│       │   ├── candidates.service.ts    # Business logic + Search
│       │   ├── candidates.module.ts     # Module definition
│       │   └── gemini.service.ts        # AI integration (Ollama)
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

## 📡 API Endpoints

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

## 🧪 Running Tests

```bash
cd electus-app
npm run test
```

---

*Built with ❤️ for a smarter hiring future.*