# 🚀 Electus: AI-Powered Applicant Tracking System (ATS)

![Electus Banner](https://via.placeholder.com/1000x300/0f172a/38bdf8?text=Electus+-+AI+Powered+ATS) Electus is a state-of-the-art Applicant Tracking System (ATS) designed to revolutionize the hiring process. Built for modern HR teams, Electus goes beyond simple keyword matching by implementing **Retrieval-Augmented Generation (RAG)** and Semantic Search. It understands the *context* of a candidate's CV and matches them accurately to complex job requirements.

## ✨ Key Features

* 🧠 **Semantic Search (RAG):** Powered by Gemini AI Embeddings and PostgreSQL `pgvector`. Search for candidates using natural language (e.g., *"Find a detail-oriented backend developer with leadership skills"*).
* 📄 **Automated CV Processing:** Instantly extracts text from uploaded PDFs and generates an "AI Summary" and "Holland Code (RIASEC)" personality assessment for every candidate.
* ⚖️ **Unbiased Hiring (Blind Screening):** A built-in toggle to hide candidate names and photos, promoting objective and equitable talent acquisition.
* 📊 **Smart Dashboard Analytics:** Real-time B2B metrics and talent pool insights (Hiring Pipeline, Skill Distribution) displayed in a responsive Bento-box layout.
* 💎 **Liquid Glass UI:** A highly polished, futuristic Neomorphism interface that delivers a premium user experience.

## 🛠️ Tech Stack

**Frontend (Web & Mobile Hybrid):**
* React / Vite
* Tailwind CSS (Liquid Glass Neomorphism styling)
* TypeScript
* Shadcn/UI

**Backend:**
* NestJS (Node.js framework)
* TypeORM
* PostgreSQL (with `pgvector` extension for vector similarity search)
* Gemini API (LLM Generation & Vector Embeddings)

## 🏗️ System Architecture (RAG Pipeline)
1. **Ingestion:** CVs (PDFs) are uploaded -> Text extracted -> Gemini API generates context and Vector Embeddings -> Stored in PostgreSQL.
2. **Retrieval:** HR enters a semantic query -> Query is vectorized -> `pgvector` calculates Cosine Similarity to find the closest matching CVs.
3. **Generation:** Top candidates are passed to Gemini LLM to generate a dynamic `Match Score %` and contextual reasoning for the HR team.

---
*Built with ❤️ for a smarter hiring future.*