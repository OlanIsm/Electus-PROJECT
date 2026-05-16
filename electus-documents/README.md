# Electus Document Service

NestJS microservice for extracting raw text from uploaded CV files.

## Responsibilities

- Extract text from PDF files with `pdf-parse`
- Extract text from DOCX files with `mammoth`
- Accept base64 JSON payloads from `electus-app`
- Accept multipart uploads for direct testing
- Enforce a 10MB multipart upload limit and a 20MB JSON body limit for base64 payloads

## Runtime

Default port: `3003`

Optional environment variables:

```bash
PORT=3003
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
| `GET` | `/documents/health` | Health check |
| `POST` | `/documents/extract` | Extract text from a base64 JSON PDF/DOCX payload |
| `POST` | `/documents/extract-file` | Extract text from a multipart PDF/DOCX upload |
