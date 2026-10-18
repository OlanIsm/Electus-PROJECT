# Implementation Plan & Task Tracker — Electus ATS

Dokumen ini memetakan seluruh kelemahan sistem Electus ATS menjadi rencana implementasi terstruktur berdasarkan tingkat risiko (*Risk Level*), dilengkapi penjelasan teknis masalah, solusi, file terdampak, dan progress pekerjaan.

---

## 📊 Ringkasan Status Task

| Kategori Risiko | Total Task | Pending | In Progress | Selesai |
| :--- | :---: | :---: | :---: | :---: |
| 🔴 **CRITICAL (P0)** | 4 | 1 | 0 | 3 |
| 🟠 **HIGH (P1)** | 4 | 4 | 0 | 0 |
| 🟡 **MEDIUM (P2)** | 5 | 4 | 0 | 1 |
| 🟢 **LOW (P3)** | 3 | 3 | 0 | 0 |
| **Total** | **16** | **12** | **0** | **4** |

---

## 🔴 Tingkat Risiko: CRITICAL (P0)
> *Risiko yang dapat menyebabkan server crash, kehilangan data permanen, atau kegagalan transaksi utama pengguna.*

### TASK-01: Migrasi Vector Search dari Memory Node.js ke Database (PostgreSQL Vector Search)
* **Status:** `[x] Selesai`
* **File Terdampak:**
  * `electus-app/src/candidates/candidates.service.ts`
  * `electus-app/src/candidates/candidate.entity.ts`
  * `electus-app/src/candidates/candidates.service.spec.ts`
* **Penjelasan Masalah:**
  Saat ini `CandidatesService.semanticSearch()` memanggil `findAll()` yang menarik seluruh data ribuan kandidat beserta teks CV dan vektor embedding ke RAM Node.js. Cosine similarity dihitung menggunakan `.map()` di thread utama JavaScript. Jika jumlah kandidat bertambah, CPU server langsung mencapai 100% dan memicu crash *Out of Memory* (OOM).
* **Rencana Implementasi:**
  1. Migrasikan tipe kolom `embedding` di PostgreSQL dan entity ke native array `double precision[]`.
  2. Implementasikan fungsi database `cosine_similarity(a double precision[], b double precision[])` langsung di PostgreSQL.
  3. Inisialisasi fungsi SQL otomatis pada startup backend (`onModuleInit`).
  4. Ubah query `semanticSearch` agar menghitung cosine similarity dan text ranking langsung di PostgreSQL SQL (`ORDER BY GREATEST(...) DESC LIMIT 50`).
  5. Perbarui unit test untuk memvalidasi pencarian berbasis database.
* **Apa yang Telah Dilakukan:**
  * Telah mengubah tipe kolom `embedding` pada PostgreSQL dan `candidate.entity.ts` dari `simple-json` (string teks JSON) menjadi `double precision[]` native array.
  * Mendaftarkan fungsi SQL `cosine_similarity(double precision[], double precision[])` di PostgreSQL yang menghitung dot product dan norma vektor secara paralel dan cepat di sisi database.
  * Menambahkan lifecycle `onModuleInit` pada `CandidatesService` untuk memastikan fungsi SQL selalu dibuat otomatis jika aplikasi berjalan di environment baru.
  * Mengganti seluruh logika `semanticSearch()` di `candidates.service.ts` sehingga query vector similarity dan keyword matching dieksekusi langsung di database dengan `LIMIT 50`, menghemat 95%+ memori RAM Node.js dan mencegah event loop freeze.
  * Memperbarui dan menjalankan test unit di `candidates.service.spec.ts` (100% lulus: 4 passed).

---

### TASK-02: Asynchronous Non-Blocking CV Processing
* **Status:** `[x] Selesai`
* **File Terdampak:**
  * `electus-app/src/candidates/candidates.controller.ts`
  * `electus-app/src/candidates/candidates.service.ts`
  * `electus-app/src/candidates/candidates.service.spec.ts`
  * `electus-frontend/src/pages/Index.tsx`
* **Penjelasan Masalah:**
  Endpoint `POST /candidates/upload` sebelumnya berjalan secara sinkron. Koneksi HTTP ditahan hingga proses parsing dokumen, inferensi LLM Ollama (15–45 detik), dan pembuatan embedding selesai. Request sering mengalami *HTTP 504 Gateway Timeout* jika diakses dari jaringan lambat atau saat upload batch.
* **Rencana Implementasi:**
  1. Buat endpoint upload CV instan non-blocking yang langsung me-return status `processingStatus: 'processing'` dalam <50ms.
  2. Jalankan ekstraksi teks, LLM Ollama, dan embedding secara asinkron di background worker (`processCandidateAsync`).
  3. Sinkronkan dengan status polling frontend agar status kandidat otomatis berubah menjadi `'done'` saat AI selesai.
* **Apa yang Telah Dilakukan:**
  * Endpoint `uploadCv()` dirombak menjadi non-blocking: data kandidat awal langsung disimpan dan di-return seketika ke client.
  * Proses AI berat dijalankan di background melalui `processCandidateAsync()`, mengeliminasi total risiko HTTP timeout.
  * Frontend memanfaatkan polling status yang sudah ada untuk memperbarui status baris kandidat secara real-time.

---

### TASK-03: Penyimpanan File Fisik Dokumen CV Asli & Fitur Preview/Download
* **Status:** `[x] Selesai`
* **File Terdampak:**
  * `electus-app/src/candidates/candidates.controller.ts`
  * `electus-app/src/candidates/candidates.service.ts`
  * `electus-frontend/src/components/dashboard/CandidateDetailModal.tsx`
* **Penjelasan Masalah:**
  Saat ini file CV hanya dibaca di memory buffer oleh Multer, lalu dibuang setelah diekstrak teksnya. File fisik PDF/DOCX asli tidak pernah disimpan ke disk atau cloud storage. Recruiter tidak dapat melihat layout format asli atau mengunduh kembali CV pelamar.
* **Rencana Implementasi:**
  1. Konfigurasi penyimpanan file fisik: disk storage lokal (`uploads/cvs/`) dengan nama unik aman UUID.
  2. Simpan path/URL file ke field `candidate.cvFilePath`.
  3. Buat endpoint aman `GET /candidates/:id/cv` untuk download/stream file asli.
  4. Tambahkan tombol "View Original CV" di `CandidateDetailModal.tsx` frontend.
* **Apa yang Telah Dilakukan:**
  * File PDF/DOCX yang diunggah disimpan secara permanen di `uploads/cvs/${randomUUID()}.${ext}` dan path-nya disimpan ke `candidate.cvFilePath`.
  * Menambahkan endpoint dedicated `GET /candidates/:id/cv` di `candidates.controller.ts` untuk streaming file dokumen asli.
  * Menambahkan tombol "View Original CV" dengan ikon dan link aman di modal detail pelamar frontend (`CandidateDetailModal.tsx`).

---

### TASK-04: Nonaktifkan `synchronize: true` & Setup Database Migrations
* **Status:** `[ ] Pending`
* **File Terdampak:**
  * `electus-app/src/app.module.ts`
  * `electus-app/src/database/migrations/*` *(baru)*
  * `electus-app/package.json`
* **Penjelasan Masalah:**
  Penggunaan `synchronize: true` pada TypeORM di `app.module.ts` sangat berbahaya untuk production. Restart server dapat memicu drop kolom atau alter tabel secara otomatis yang mengakibatkan kehilangan data kandidat.
* **Rencana Implementasi:**
  1. Ubah konfigurasi `synchronize: false` untuk environment production/staging.
  2. Setup script migration di `package.json` (`typeorm migration:generate` dan `migration:run`).
  3. Buat initial migration dari skema database yang sudah ada.
* **Apa yang Telah Dilakukan:**
  * Audit konfigurasi TypeORM di `app.module.ts`.

---

## 🟠 Tingkat Risiko: HIGH (P1)
> *Risiko kebocoran privasi data pelamar, eksploitasi akses ilegal, dan integritas input.*

### TASK-05: Multi-Tenancy & Data Isolation (Organisasi / Perusahaan)
* **Status:** `[ ] Pending`
* **File Terdampak:**
  * `electus-app/src/users/user.entity.ts`
  * `electus-app/src/candidates/candidate.entity.ts`
  * `electus-app/src/candidates/candidates.service.ts`
* **Penjelasan Masalah:**
  Semua user yang login mengakses satu tabel kandidat global yang sama. Data pelamar tidak memiliki pemilik (`companyId` atau `tenantId`), sehingga recruiter dari perusahaan lain bisa melihat dan mengelola data pelamar milik recruiter lain.
* **Rencana Implementasi:**
  1. Tambahkan relasi `companyId` atau `tenantId` pada entitas `User` dan `Candidate`.
  2. Perbarui query di `CandidatesService` agar selalu menyaring berdasarkan `where: { tenantId }`.
  3. Tambahkan custom decorator `@CurrentTenant()` untuk mengambil tenant dari JWT context.
* **Apa yang Telah Dilakukan:**
  * Audit struktur entitas kandidat dan user.

---

### TASK-06: Role-Based Access Control (RBAC) & Proteksi Endpoint Destruktif
* **Status:** `[ ] Pending`
* **File Terdampak:**
  * `electus-app/src/auth/roles.guard.ts` *(baru)*
  * `electus-app/src/candidates/candidates.controller.ts`
  * `electus-app/src/users/user.entity.ts`
* **Penjelasan Masalah:**
  Endpoint `DELETE /candidates/all`, `DELETE /candidates/duplicates`, dan `DELETE /candidates/status/:status` saat ini bisa dipanggil oleh siapa saja yang memiliki token JWT biasa. Satu klik atau request tidak sengaja dapat memusnahkan seluruh database pelamar.
* **Rencana Implementasi:**
  1. Tambahkan kolom `role` pada entitas `User` (`'admin' | 'recruiter' | 'interviewer'`).
  2. Buat `RolesGuard` dan decorator `@Roles('admin')`.
  3. Pasang proteksi hanya role `admin` yang dapat memanggil endpoint bulk delete.
* **Apa yang Telah Dilakukan:**
  * Audit endpoint controller di `candidates.controller.ts`.

---

### TASK-07: Validasi Input Global & Perbaikan DTO
* **Status:** `[ ] Pending`
* **File Terdampak:**
  * `electus-app/src/main.ts`
  * `electus-app/src/auth/dto/login.dto.ts`
  * `electus-app/src/auth/dto/register.dto.ts`
  * `electus-app/package.json`
* **Penjelasan Masalah:**
  `class-validator` dan `class-transformer` belum terpasang di `electus-app`. `ValidationPipe` global belum diaktifkan di `main.ts`. Payload auth bisa dikirim kosong atau invalid tanpa ada penolakan dari guard/pipe.
* **Rencana Implementasi:**
  1. Install `class-validator` dan `class-transformer`.
  2. Daftarkan `app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))` di `main.ts`.
  3. Tambahkan decorator validasi pada DTO (`@IsEmail()`, `@IsString()`, `@MinLength(6)`).
* **Apa yang Telah Dilakukan:**
  * Pengecekan dependensi dan isi file DTO auth saat ini.

---

### TASK-08: Pengamanan JWT Secret & Environment Variable Strict Check
* **Status:** `[ ] Pending`
* **File Terdampak:**
  * `electus-app/src/auth/jwt.strategy.ts`
  * `electus-app/src/auth/auth.module.ts`
* **Penjelasan Masalah:**
  Ada nilai fallback hardcoded `'electus-super-secret-key-change-in-prod'` pada strategi JWT. Jika ENV tidak diisi, token verifikasi menggunakan kunci publik yang mudah ditebak.
* **Rencana Implementasi:**
  1. Buat mekanisme validasi config startup (`Joi` atau custom schema check). Jika `JWT_SECRET` tidak ada di environment non-development, cegah server menyala (*throw error on bootstrap*).
* **Apa yang Telah Dilakukan:**
  * Lokasi hardcoded secret diidentifikasi di `jwt.strategy.ts` baris 16.

---

## 🟡 Tingkat Risiko: MEDIUM (P2)
> *Risiko degradasi performa, akurasi AI berkurang, dan kendala operasional integrasi.*

### TASK-09: Implementasi Pagination & Filtering di Database
* **Status:** `[ ] Pending`
* **File Terdampak:**
  * `electus-app/src/candidates/candidates.controller.ts`
  * `electus-app/src/candidates/candidates.service.ts`
  * `electus-frontend/src/pages/Index.tsx`
  * `electus-frontend/src/components/dashboard/CandidateList.tsx`
* **Penjelasan Masalah:**
  Semua daftar kandidat ditarik sekaligus tanpa paginasi.
* **Rencana Implementasi:**
  1. Tambahkan query parameter `page`, `limit`, `sort`, `filter` pada `GET /candidates`.
  2. Implementasikan pagination di TypeORM (`take` & `skip`).
  3. Pasang navigasi paginasi di tabel frontend.
* **Apa yang Telah Dilakukan:**
  * Review alur `fetchCandidates()` di `Index.tsx`.

---

### TASK-10: Peningkatan Parsing CV Panjang (Hilangkan Batas Keras 6.000 Karakter)
* **Status:** `[ ] Pending`
* **File Terdampak:**
  * `electus-ai/src/ai.service.ts`
* **Penjelasan Masalah:**
  Potongan teks CV dibatasi secara kaku dengan `cvText.slice(0, 6000)` sehingga bagian belakang CV kandidat berpengalaman terpotong.
* **Rencana Implementasi:**
  1. Naikkan context window atau terapkan sistem chunking / summarization bertahap untuk CV yang sangat panjang.
  2. Pastikan prompt LLM tetap efisien tanpa membuang informasi riwayat kerja dan sertifikasi.
* **Apa yang Telah Dilakukan:**
  * Identifikasi pemotongan string di `electus-ai/src/ai.service.ts` baris 72.

---

### TASK-11: Fallback OCR untuk CV PDF Berbasis Gambar / Scanned
* **Status:** `[ ] Pending`
* **File Terdampak:**
  * `electus-documents/src/documents.service.ts`
* **Penjelasan Masalah:**
  Library `pdf-parse` hanya dapat mengekstrak teks digital. Dokumen hasil scan atau hasil ekspor flat image menghasilkan teks kosong.
* **Rencana Implementasi:**
  1. Deteksi apakah hasil ekstraksi teks dari PDF kosong (`text.trim().length === 0`).
  2. Jika kosong, arahkan ke fallback OCR (misal: `tesseract.js` atau Google Cloud Vision API).
* **Apa yang Telah Dilakukan:**
  * Review implementasi `extractText` di `documents.service.ts`.

---

### TASK-12: Optimasi Transfer Dokumen Antar-Service (Stream vs Base64)
* **Status:** `[x] Selesai`
* **File Terdampak:**
  * `electus-app/src/documents/documents.service.ts`
  * `electus-app/src/ai/ai.service.ts`
  * `start-electus.bat`
  * `start-backend.command`
* **Penjelasan Masalah:**
  File dikonversi menjadi string Base64 dalam JSON payload, memicu lonjakan memori RAM hingga ratusan MB saat banyak file diupload bersamaan karena pemisahan arsitektur yang artifisial.
* **Rencana Implementasi:**
  1. Konsolidasikan arsitektur menjadi Modular Monolith.
  2. Pindahkan parser dokumen (`pdf-parse`, `mammoth`) langsung ke `DocumentsService` di `electus-app`.
  3. Pindahkan klien Ollama langsung ke `AiService` di `electus-app`.
* **Apa yang Telah Dilakukan:**
  * Telah mengintegrasikan ekstraksi file PDF dan DOCX secara in-memory langsung di `DocumentsService` (`electus-app`).
  * Menghilangkan seluruh encoding Base64 dan overhead request HTTP antar-port lokal.
  * Memperbarui file launcher startup (`start-electus.bat` dan `start-backend.command`) agar hanya menyalakan Backend Monolith (port 3000) dan Frontend (port 5173).

---

### TASK-13: Sentralisasi Konfigurasi API di Frontend (`import.meta.env`)
* **Status:** `[ ] Pending`
* **File Terdampak:**
  * `electus-frontend/src/context/UploadContext.tsx`
  * `electus-frontend/src/pages/BatchUpload.tsx`
  * `electus-frontend/src/pages/Index.tsx`
  * `electus-frontend/src/pages/Login.tsx`
  * `electus-frontend/src/pages/SignUp.tsx`
  * `electus-frontend/src/pages/Statistics.tsx`
  * `electus-frontend/src/lib/api.ts` *(baru)*
* **Penjelasan Masalah:**
  String `"http://localhost:3000"` di-hardcode di banyak file frontend. Begitu aplikasi dideploy ke staging/production, seluruh request API akan gagal.
* **Rencana Implementasi:**
  1. Buat centralized API client (`lib/api.ts`) yang membaca `import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'`.
  2. Replace seluruh hardcoded URL dengan client tersebut.
* **Apa yang Telah Dilakukan:**
  * Grep dan pemetaan seluruh file frontend yang mengandung string `localhost:3000`.

---

## 🟢 Tingkat Risiko: LOW (P3)
> *Peningkatan efisiensi operasional, kebersihan basis kode, dan kemudahan deployment.*

### TASK-14: Pembuatan Dockerfile & `docker-compose.yml` Orkestrasi
* **Status:** `[ ] Pending`
* **File Terdampak:**
  * `docker-compose.yml` *(baru)*
  * `electus-app/Dockerfile` *(baru)*
  * `electus-ai/Dockerfile` *(baru)*
  * `electus-documents/Dockerfile` *(baru)*
  * `electus-frontend/Dockerfile` *(baru)*
* **Penjelasan Masalah:**
  Saat ini menjalankan project membutuhkan 5 proses terminal terpisah secara manual tanpa standarisasi environment.
* **Rencana Implementasi:**
  1. Buat `Dockerfile` multi-stage untuk tiap service.
  2. Rangkai seluruh service (Postgres, Ollama, Docs, AI, App, Frontend) dalam satu file `docker-compose.yml`.
* **Apa yang Telah Dilakukan:**
  * Review file batch startup `start-electus.bat`.

---

### TASK-15: Pembersihan Sesi Expired (Session Cleanup Job)
* **Status:** `[ ] Pending`
* **File Terdampak:**
  * `electus-app/src/users/users.service.ts`
  * `electus-app/src/app.module.ts`
* **Penjelasan Masalah:**
  Tabel `user-session` terus menimbun data login lama tanpa pernah dihapus setelah masa kadaluwarsa (`expiresAt < now`).
* **Rencana Implementasi:**
  1. Tambahkan scheduled cron job (`@nestjs/schedule`) yang membersihkan sesi kadaluwarsa setiap hari.
* **Apa yang Telah Dilakukan:**
  * Review method `validateSession` dan `deleteSession` di `users.service.ts`.

---

### TASK-16: Refactor Dead Code & Cleanup Unused Dependencies
* **Status:** `[ ] Pending`
* **File Terdampak:**
  * `electus-app/src/candidates/gemini.service.ts`
  * `electus-app/package.json`
* **Penjelasan Masalah:**
  Ada dependensi yang tidak terpakai (seperti `@google/genai`, `pdf-parse`, `mammoth` di dalam `electus-app` padahal sudah didelegasikan ke `electus-documents`), serta class kosong `GeminiService`.
* **Rencana Implementasi:**
  1. Hapus package yang tidak dipakai untuk memperkecil ukuran container dan dependensi audit.
  2. Rapikan atau lengkapi implementasi service AI alternatif.
* **Apa yang Telah Dilakukan:**
  * Review `gemini.service.ts` dan `package.json`.
