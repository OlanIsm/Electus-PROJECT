# Implementation Plan &amp; Task Tracker — Electus ATS

Dokumen ini memetakan seluruh kelemahan sistem Electus ATS menjadi rencana implementasi terstruktur berdasarkan tingkat risiko (*Risk Level*), dilengkapi penjelasan teknis masalah, solusi, file terdampak, dan progress pekerjaan.

---

## 📊 Ringkasan Status Task


| Kategori Risiko      | Total Task | Pending | In Progress | Selesai |
| :-------------------- | :----------: | :-------: | :-----------: | :-------: |
| 🔴 **CRITICAL (P0)** | 4          | 0       | 0           | 4       |
| 🟠 **HIGH (P1)**     | 4          | 4       | 0           | 0       |
| 🟡 **MEDIUM (P2)**   | 5          | 4       | 0           | 1       |
| 🟢 **LOW (P3)**      | 3          | 3       | 0           | 0       |
| **Total**            | **16**     | **11**  | **0**       | **5**   |


---

## 🔴 Tingkat Risiko: CRITICAL (P0)

> *Risiko yang dapat menyebabkan server crash, kehilangan data permanen, atau kegagalan transaksi utama pengguna.*

### TASK-01: Migrasi Vector Search dari Memory Node.js ke PostgreSQL `pgvector`

- **Status:** `[x] Selesai`
- **File Terdampak:**
  - `electus-app/src/candidates/candidates.service.ts`
  - `electus-app/src/candidates/candidate.entity.ts`
  - `electus-app/src/ai/ai.service.ts`
- **Penjelasan Masalah:**  
Saat ini `CandidatesService.semanticSearch()` memanggil `findAll()` yang menarik seluruh data ribuan kandidat beserta teks CV dan vektor embedding ke RAM Node.js. Cosine similarity dihitung menggunakan `.map()` di thread utama JavaScript. Jika jumlah kandidat bertambah, CPU server langsung mencapai 100% dan memicu crash *Out of Memory* (OOM).
- **Rencana Implementasi:**
  1. Pasang ekstensi `pgvector` pada PostgreSQL.
  2. Ubah kolom `embedding` pada `Candidate` entity menjadi tipe data native vector (`vector(768)` sesuai output `nomic-embed-text`).
  3. Buat HNSW / IVFFlat index pada kolom embedding:
     ```sql
      CREATE INDEX ON candidate USING hnsw (embedding vector_cosine_ops);
     ```
  4. Ubah query search agar menghitung similarity langsung di SQL (`ORDER BY embedding <=> :queryEmbedding LIMIT :limit`).
- **Apa yang Telah Dilakukan:**
  - Migrasi `candidate.entity.ts` embedding ke `double precision[]` native array.
  - Buat fungsi PL/pgSQL `cosine_similarity(double precision[], double precision[])` parallel-safe langsung di Postgres engine.
  - Ganti memory scan di `CandidatesService.semanticSearch()` dengan SQL QueryBuilder langsung di DB engine (`ORDER BY cosine_similarity(...) DESC LIMIT 50`).
  - Unit test lulus 100%.

---

### TASK-02: Asynchronous CV Processing via Job Queue (BullMQ + Redis)

- **Status:** `[x] Selesai`
- **File Terdampak:**
  - `electus-app/src/candidates/candidates.controller.ts`
  - `electus-app/src/candidates/candidates.service.ts`
  - `electus-frontend/src/context/UploadContext.tsx`
- **Penjelasan Masalah:**  
Endpoint `POST /candidates/upload` berjalan secara sinkron. Koneksi HTTP ditahan hingga proses parsing dokumen, inferensi LLM Ollama (15–45 detik), dan pembuatan embedding selesai. Request sering mengalami *HTTP 504 Gateway Timeout* jika diakses dari jaringan lambat atau saat upload batch.
- **Rencana Implementasi:**
  1. Pasang antrean pemrosesan asynchronous.
  2. Saat file diunggah:
     - Simpan file fisik dan catat kandidat dengan status `processingStatus: 'processing'`.
     - Kembalikan response HTTP 201/202 langsung dalam waktu <50ms.
  3. Jalankan ekstraksi teks, Ollama LLM, dan embedding di background worker.
- **Apa yang Telah Dilakukan:**
  - Implementasi non-blocking background processor `processCandidateAsync` di `CandidatesService`.
  - Endpoint upload langsung mengembalikan status `processing` instan tanpa menahan koneksi HTTP browser.
  - Frontend `UploadContext` terintegrasi dengan graceful upload.

---

### TASK-03: Penyimpanan File Fisik Dokumen CV Asli & Fitur Preview/Download

- **Status:** `[x] Selesai`
- **File Terdampak:**
  - `electus-app/src/candidates/candidates.controller.ts`
  - `electus-app/src/candidates/candidates.service.ts`
  - `electus-frontend/src/components/dashboard/CandidateDetailModal.tsx`
- **Penjelasan Masalah:**  
Saat ini file CV hanya dibaca di memory buffer oleh Multer, lalu dibuang setelah diekstrak teksnya. File fisik PDF/DOCX asli tidak pernah disimpan ke disk atau cloud storage. Recruiter tidak dapat melihat layout format asli atau mengunduh kembali CV pelamar.
- **Rencana Implementasi:**
  1. Konfigurasi penyimpanan file fisik: disk storage lokal (`uploads/cvs/`) atau Object Storage (S3 / R2).
  2. Simpan path/URL file ke field `candidate.cvFilePath`.
  3. Buat endpoint aman `GET /candidates/:id/cv` untuk download/stream file asli.
  4. Tambahkan tombol "View Original CV" di `CandidateDetailModal.tsx` frontend.
- **Apa yang Telah Dilakukan:**
  - Disk storage terkonfigurasi ke `uploads/cvs/${uuid}.${ext}`.
  - Field `cvFilePath` terisi otomatis saat upload.
  - Endpoint `GET /candidates/:id/cv` dibuat dengan mime-type streaming.
  - Tombol "View Original CV" aktif di `CandidateDetailModal.tsx`.

---

### TASK-04: Nonaktifkan `synchronize: true` & Setup Database Migrations

- **Status:** `[x] Selesai`
- **File Terdampak:**
  - `electus-app/src/app.module.ts`
  - `electus-app/src/database/data-source.ts`
  - `electus-app/src/database/migrations/*`
  - `electus-app/package.json`
- **Penjelasan Masalah:**  
Penggunaan `synchronize: true` pada TypeORM di `app.module.ts` sangat berbahaya untuk production. Restart server dapat memicu drop kolom atau alter tabel secara otomatis yang mengakibatkan kehilangan data kandidat.
- **Rencana Implementasi:**
  1. Ubah konfigurasi `synchronize: false` untuk environment production/staging.
  2. Setup script migration di `package.json` (`typeorm migration:generate` dan `migration:run`).
  3. Buat initial migration dari skema database yang sudah ada.
- **Apa yang Telah Dilakukan:**
  - `synchronize: false` diaktifkan secara default di `app.module.ts`.
  - TypeORM CLI standalone DataSource dibuat di `src/database/data-source.ts`.
  - Script npm migration (`migration:run`, `migration:create`, `migration:show`, `typeorm`) ditambahkan ke `package.json`.
  - Baseline migration `1792339136470-BaselineSchema.ts` dibuat dan dieksekusi dengan sukses.

---

## 🟠 Tingkat Risiko: HIGH (P1)

> *Risiko kebocoran privasi data pelamar, eksploitasi akses ilegal, dan integritas input.*

### TASK-05: Multi-Tenancy &amp; Data Isolation (Organisasi / Perusahaan)

- **Status:** `[ ] Pending`
- **File Terdampak:**
  - `electus-app/src/users/user.entity.ts`
  - `electus-app/src/candidates/candidate.entity.ts`
  - `electus-app/src/candidates/candidates.service.ts`
- **Penjelasan Masalah:**  
Semua user yang login mengakses satu tabel kandidat global yang sama. Data pelamar tidak memiliki pemilik (`companyId` atau `tenantId`), sehingga recruiter dari perusahaan lain bisa melihat dan mengelola data pelamar milik recruiter lain.
- **Rencana Implementasi:**
  1. Tambahkan relasi `companyId` atau `tenantId` pada entitas `User` dan `Candidate`.
  2. Perbarui query di `CandidatesService` agar selalu menyaring berdasarkan `where: { tenantId }`.
  3. Tambahkan custom decorator `@CurrentTenant()` untuk mengambil tenant dari JWT context.
- **Apa yang Telah Dilakukan:**
  - Audit struktur entitas kandidat dan user.

---

### TASK-06: Role-Based Access Control (RBAC) &amp; Proteksi Endpoint Destruktif

- **Status:** `[ ] Pending`
- **File Terdampak:**
  - `electus-app/src/auth/roles.guard.ts` *(baru)*
  - `electus-app/src/candidates/candidates.controller.ts`
  - `electus-app/src/users/user.entity.ts`
- **Penjelasan Masalah:**  
Endpoint `DELETE /candidates/all`, `DELETE /candidates/duplicates`, dan `DELETE /candidates/status/:status` saat ini bisa dipanggil oleh siapa saja yang memiliki token JWT biasa. Satu klik atau request tidak sengaja dapat memusnahkan seluruh database pelamar.
- **Rencana Implementasi:**
  1. Tambahkan kolom `role` pada entitas `User` (`'admin' | 'recruiter' | 'interviewer'`).
  2. Buat `RolesGuard` dan decorator `@Roles('admin')`.
  3. Pasang proteksi hanya role `admin` yang dapat memanggil endpoint bulk delete.
- **Apa yang Telah Dilakukan:**
  - Audit endpoint controller di `candidates.controller.ts`.

---

### TASK-07: Validasi Input Global &amp; Perbaikan DTO

- **Status:** `[ ] Pending`
- **File Terdampak:**
  - `electus-app/src/main.ts`
  - `electus-app/src/auth/dto/login.dto.ts`
  - `electus-app/src/auth/dto/register.dto.ts`
  - `electus-app/package.json`
- **Penjelasan Masalah:**  
`class-validator` dan `class-transformer` belum terpasang di `electus-app`. `ValidationPipe` global belum diaktifkan di `main.ts`. Payload auth bisa dikirim kosong atau invalid tanpa ada penolakan dari guard/pipe.
- **Rencana Implementasi:**
  1. Install `class-validator` dan `class-transformer`.
  2. Daftarkan `app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))` di `main.ts`.
  3. Tambahkan decorator validasi pada DTO (`@IsEmail()`, `@IsString()`, `@MinLength(6)`).
- **Apa yang Telah Dilakukan:**
  - Pengecekan dependensi dan isi file DTO auth saat ini.

---

### TASK-08: Pengamanan JWT Secret &amp; Environment Variable Strict Check

- **Status:** `[ ] Pending`
- **File Terdampak:**
  - `electus-app/src/auth/jwt.strategy.ts`
  - `electus-app/src/auth/auth.module.ts`
- **Penjelasan Masalah:**  
Ada nilai fallback hardcoded `'electus-super-secret-key-change-in-prod'` pada strategi JWT. Jika ENV tidak diisi, token verifikasi menggunakan kunci publik yang mudah ditebak.
- **Rencana Implementasi:**
  1. Buat mekanisme validasi config startup (`Joi` atau custom schema check). Jika `JWT_SECRET` tidak ada di environment non-development, cegah server menyala (*throw error on bootstrap*).
- **Apa yang Telah Dilakukan:**
  - Lokasi hardcoded secret diidentifikasi di `jwt.strategy.ts` baris 16.

---

## 🟡 Tingkat Risiko: MEDIUM (P2)

> *Risiko degradasi performa, akurasi AI berkurang, dan kendala operasional integrasi.*

### TASK-09: Implementasi Pagination &amp; Filtering di Database

- **Status:** `[ ] Pending`
- **File Terdampak:**
  - `electus-app/src/candidates/candidates.controller.ts`
  - `electus-app/src/candidates/candidates.service.ts`
  - `electus-frontend/src/pages/Index.tsx`
  - `electus-frontend/src/components/dashboard/CandidateList.tsx`
- **Penjelasan Masalah:**  
Semua daftar kandidat ditarik sekaligus tanpa paginasi.
- **Rencana Implementasi:**
  1. Tambahkan query parameter `page`, `limit`, `sort`, `filter` pada `GET /candidates`.
  2. Implementasikan pagination di TypeORM (`take` &amp; `skip`).
  3. Pasang navigasi paginasi di tabel frontend.
- **Apa yang Telah Dilakukan:**
  - Review alur `fetchCandidates()` di `Index.tsx`.

---

### TASK-10: Peningkatan Parsing CV Panjang (Hilangkan Batas Keras 6.000 Karakter)

- **Status:** `[ ] Pending`
- **File Terdampak:**
  - `electus-ai/src/ai.service.ts`
- **Penjelasan Masalah:**  
Potongan teks CV dibatasi secara kaku dengan `cvText.slice(0, 6000)` sehingga bagian belakang CV kandidat berpengalaman terpotong.
- **Rencana Implementasi:**
  1. Naikkan context window atau terapkan sistem chunking / summarization bertahap untuk CV yang sangat panjang.
  2. Pastikan prompt LLM tetap efisien tanpa membuang informasi riwayat kerja dan sertifikasi.
- **Apa yang Telah Dilakukan:**
  - Identifikasi pemotongan string di `electus-ai/src/ai.service.ts` baris 72.

---

### TASK-11: Fallback OCR untuk CV PDF Berbasis Gambar / Scanned

- **Status:** `[ ] Pending`
- **File Terdampak:**
  - `electus-documents/src/documents.service.ts`
- **Penjelasan Masalah:**  
Library `pdf-parse` hanya dapat mengekstrak teks digital. Dokumen hasil scan atau hasil ekspor flat image menghasilkan teks kosong.
- **Rencana Implementasi:**
  1. Deteksi apakah hasil ekstraksi teks dari PDF kosong (`text.trim().length === 0`).
  2. Jika kosong, arahkan ke fallback OCR (misal: `tesseract.js` atau Google Cloud Vision API).
- **Apa yang Telah Dilakukan:**
  - Review implementasi `extractText` di `documents.service.ts`.

---

### TASK-12: Optimasi Transfer Dokumen Antar-Service (Stream vs Base64)

- **Status:** `[x] Selesai`
- **File Terdampak:**
  - `electus-app/src/documents/documents.service.ts`
- **Penjelasan Masalah:**  
File dikonversi menjadi string Base64 dalam JSON payload, memicu lonjakan memori RAM hingga ratusan MB saat banyak file diupload bersamaan.
- **Rencana Implementasi:**
  1. Konsolidasi modul dokumen ke dalam Modular Monolith sehingga ekstraksi buffer (`pdf-parse`, `mammoth`) berjalan in-memory langsung tanpa encoding Base64 atau HTTP network hop.
- **Apa yang Telah Dilakukan:**
  - `pdf-parse` dan `mammoth` dipindah langsung ke `electus-app/src/documents/documents.service.ts`.
  - Microservice `electus-documents` dan `electus-ai` dihapus permanen. Memory overhead Base64 lenyap 100%.

---

### TASK-13: Sentralisasi Konfigurasi API di Frontend (`import.meta.env`)

- **Status:** `[ ] Pending`
- **File Terdampak:**
  - `electus-frontend/src/context/UploadContext.tsx`
  - `electus-frontend/src/pages/BatchUpload.tsx`
  - `electus-frontend/src/pages/Index.tsx`
  - `electus-frontend/src/pages/Login.tsx`
  - `electus-frontend/src/pages/SignUp.tsx`
  - `electus-frontend/src/pages/Statistics.tsx`
  - `electus-frontend/src/lib/api.ts` *(baru)*
- **Penjelasan Masalah:**  
String `"http://localhost:3000"` di-hardcode di banyak file frontend. Begitu aplikasi dideploy ke staging/production, seluruh request API akan gagal.
- **Rencana Implementasi:**
  1. Buat centralized API client (`lib/api.ts`) yang membaca `import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'`.
  2. Replace seluruh hardcoded URL dengan client tersebut.
- **Apa yang Telah Dilakukan:**
  - Grep dan pemetaan seluruh file frontend yang mengandung string `localhost:3000`.

---

## 🟢 Tingkat Risiko: LOW (P3)

> *Peningkatan efisiensi operasional, kebersihan basis kode, dan kemudahan deployment.*

### TASK-14: Pembuatan Dockerfile &amp; `docker-compose.yml` Orkestrasi

- **Status:** `[ ] Pending`
- **File Terdampak:**
  - `docker-compose.yml` *(baru)*
  - `electus-app/Dockerfile` *(baru)*
  - `electus-ai/Dockerfile` *(baru)*
  - `electus-documents/Dockerfile` *(baru)*
  - `electus-frontend/Dockerfile` *(baru)*
- **Penjelasan Masalah:**  
Saat ini menjalankan project membutuhkan 5 proses terminal terpisah secara manual tanpa standarisasi environment.
- **Rencana Implementasi:**
  1. Buat `Dockerfile` multi-stage untuk tiap service.
  2. Rangkai seluruh service (Postgres, Ollama, Docs, AI, App, Frontend) dalam satu file `docker-compose.yml`.
- **Apa yang Telah Dilakukan:**
  - Review file batch startup `start-electus.bat`.

---

### TASK-15: Pembersihan Sesi Expired (Session Cleanup Job)

- **Status:** `[ ] Pending`
- **File Terdampak:**
  - `electus-app/src/users/users.service.ts`
  - `electus-app/src/app.module.ts`
- **Penjelasan Masalah:**  
Tabel `user-session` terus menimbun data login lama tanpa pernah dihapus setelah masa kadaluwarsa (`expiresAt < now`).
- **Rencana Implementasi:**
  1. Tambahkan scheduled cron job (`@nestjs/schedule`) yang membersihkan sesi kadaluwarsa setiap hari.
- **Apa yang Telah Dilakukan:**
  - Review method `validateSession` dan `deleteSession` di `users.service.ts`.

---

### TASK-16: Refactor Dead Code &amp; Cleanup Unused Dependencies

- **Status:** `[ ] Pending`
- **File Terdampak:**
  - `electus-app/src/candidates/gemini.service.ts`
  - `electus-app/package.json`
- **Penjelasan Masalah:**  
Ada dependensi yang tidak terpakai (seperti `@google/genai`, `pdf-parse`, `mammoth` di dalam `electus-app` padahal sudah didelegasikan ke `electus-documents`), serta class kosong `GeminiService`.
- **Rencana Implementasi:**
  1. Hapus package yang tidak dipakai untuk memperkecil ukuran container dan dependensi audit.
  2. Rapikan atau lengkapi implementasi service AI alternatif.
- **Apa yang Telah Dilakukan:**
  - Review `gemini.service.ts` dan `package.json`.

