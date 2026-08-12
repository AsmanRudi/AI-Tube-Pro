# 🎬 AI-Tube-Pro

> **AI-Powered YouTube Content Automation Platform**

AI-Tube-Pro adalah platform berbasis AI yang dirancang untuk membantu content creator mengotomatisasi proses pembuatan konten YouTube, mulai dari **ide, pembuatan script, SEO, thumbnail, voiceover, subtitle, hingga upload ke YouTube**.

Project ini dibuat sebagai **full-stack AI application** dengan arsitektur terpisah antara frontend, backend, database, dan AI service.

---

## 🚀 Features

### 🤖 AI Script Generator

Membantu membuat draft script YouTube berdasarkan topik atau ide yang diberikan.

**Workflow:**

```text
Content Idea
     ↓
AI Script Generator
     ↓
Generated Script
     ↓
Review & Edit
```

---

### 🔍 AI SEO Optimization

Membantu mengoptimalkan metadata video YouTube.

Fitur:

* SEO Title
* Video Description
* Keywords
* Tags
* SEO Suggestions

**Workflow:**

```text
Video Topic
     ↓
AI SEO Analysis
     ↓
Title + Description + Keywords
     ↓
Creator Review
```

---

### 🖼️ AI Thumbnail

Membantu creator membuat konsep dan workflow thumbnail berdasarkan konten video.

```text
Video Topic
     ↓
AI Thumbnail Concept
     ↓
Thumbnail Generation
     ↓
Preview
```

---

### 🎙️ AI Voiceover

Script dapat diteruskan ke proses voiceover untuk menghasilkan audio berdasarkan konten yang dibuat.

```text
AI Script
     ↓
Voiceover Processing
     ↓
Generated Audio
```

---

### 📝 Subtitle Generation

Membantu menghasilkan subtitle/caption untuk video.

```text
Audio / Video
     ↓
Subtitle Processing
     ↓
Subtitle
```

---

### 📺 YouTube Integration

AI-Tube-Pro dirancang untuk terhubung dengan YouTube menggunakan OAuth.

Workflow:

```text
User
 ↓
Google / YouTube OAuth
 ↓
Authorization
 ↓
YouTube Account
 ↓
Video Upload
 ↓
YouTube
```

---

### 📁 Project Management

Setiap konten dapat dikelola sebagai sebuah project.

```text
Project
├── Script
├── SEO
├── Thumbnail
├── Voiceover
├── Subtitle
└── YouTube Upload
```

Hal ini membantu creator mengelola banyak konten secara lebih terstruktur.

---

# 🔄 Application Workflow

Alur utama AI-Tube-Pro:

```text
┌──────────────────┐
│   Content Idea   │
└────────┬─────────┘
         ↓
┌──────────────────┐
│  AI Script       │
│  Generation      │
└────────┬─────────┘
         ↓
┌──────────────────┐
│  SEO Optimization│
└────────┬─────────┘
         ↓
┌──────────────────┐
│  Thumbnail       │
└────────┬─────────┘
         ↓
┌──────────────────┐
│  Voiceover       │
└────────┬─────────┘
         ↓
┌──────────────────┐
│  Subtitle        │
└────────┬─────────┘
         ↓
┌──────────────────┐
│ Content Review   │
└────────┬─────────┘
         ↓
┌──────────────────┐
│ YouTube Upload   │
└──────────────────┘
```

---

# 🏗️ System Architecture

AI-Tube-Pro menggunakan pemisahan antara frontend, backend, database, dan AI service.

```text
                    ┌─────────────────────┐
                    │    Next.js Frontend  │
                    │                     │
                    │ Dashboard           │
                    │ Projects            │
                    │ AI Tools            │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Node.js Backend  │
                    │                     │
                    │ Authentication      │
                    │ Projects            │
                    │ API                 │
                    │ YouTube Integration │
                    └───────┬───────┬─────┘
                            │       │
                            ▼       ▼
                    ┌────────────┐ ┌───────────────┐
                    │ PostgreSQL │ │ FastAPI       │
                    │            │ │ AI Service    │
                    │ Database   │ │               │
                    └────────────┘ │ Gemini / AI   │
                                   └───────────────┘
```

---

# 🤖 AI Service Architecture

AI processing dipisahkan dari backend utama menggunakan FastAPI.

```text
Next.js
   ↓
Node.js / Express
   ↓
FastAPI AI Service
   ↓
Google Gemini / AI Provider
   ↓
AI Response
   ↓
Backend
   ↓
Frontend
```

Pendekatan ini membuat AI Service lebih mudah dikembangkan dan dipisahkan dari business logic utama aplikasi.

---

# 🛠️ Technology Stack

## Frontend

* Next.js
* React
* TypeScript
* App Router
* shadcn/ui

## Backend

* Node.js
* Express
* TypeScript
* Prisma ORM

## AI Service

* Python
* FastAPI
* Google Gemini / Google AI Studio

## Database

* PostgreSQL

## Infrastructure

* Docker
* Docker Compose

## Integration

* YouTube OAuth
* YouTube API

---

# 📁 Project Structure

```text
AI-Tube-Pro/
│
├── frontend/
│   ├── app/
│   ├── components/
│   └── ...
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   └── ...
│   │
│   ├── prisma/
│   └── ...
│
├── ai-service/
│   ├── app/
│   └── ...
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

> Struktur dapat berkembang sesuai penambahan fitur pada project.

---

# 🔐 Authentication

AI-Tube-Pro menggunakan authentication untuk melindungi resource dan fitur yang membutuhkan akses pengguna.

Konsep:

```text
Login
  ↓
Authentication
  ↓
Token
  ↓
Protected API
  ↓
Dashboard
```

---

# 🗄️ Database

AI-Tube-Pro menggunakan **PostgreSQL** sebagai database utama dan **Prisma ORM** untuk pengelolaan database.

Konsep data utama:

```text
User
  ↓
Project
  ├── Script
  ├── SEO
  ├── Thumbnail
  ├── Voiceover
  ├── Subtitle
  └── YouTube Upload
```

---

# ⚙️ Installation

## Requirements

Pastikan sudah terinstall:

* Node.js
* npm
* Python
* PostgreSQL
* Git
* Docker Desktop

---

## 1. Clone Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd AI-Tube-Pro
```

---

## 2. Install Frontend

```bash
cd frontend
npm install
```

---

## 3. Install Backend

```bash
cd ../backend
npm install
```

---

## 4. Setup AI Service

Buat virtual environment:

```bash
python -m venv .venv
```

Aktifkan:

### Windows

```bash
.venv\Scripts\activate
```

Install dependency:

```bash
pip install -r requirements.txt
```

---

# 🔑 Environment Variables

Gunakan file `.env.example` sebagai template.

Contoh:

```env
DATABASE_URL=

JWT_SECRET_KEY=

GEMINI_API_KEY=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

YOUTUBE_CLIENT_ID=
YOUTUBE_CLIENT_SECRET=
```

> Nama environment variable dapat disesuaikan dengan konfigurasi project.

### 🔒 Security

Jangan commit `.env` ke repository.

API key dan credential harus disimpan di environment/backend dan tidak boleh diekspos ke frontend.

---

# 🐳 Docker

Jika menggunakan Docker Compose:

```bash
docker compose up -d
```

Cek container:

```bash
docker compose ps
```

Stop:

```bash
docker compose down
```

---

# ▶️ Running the Application

## Frontend

```bash
cd frontend
npm run dev
```

Frontend:

```text
http://localhost:3000
```

## Backend

```bash
cd backend
npm run dev
```

## AI Service

Jalankan FastAPI sesuai entry point yang digunakan project.

Contoh:

```bash
uvicorn main:app --reload
```

---

# 🧪 Testing & Verification

Sebelum melakukan deployment, lakukan pengecekan:

```bash
npx tsc --noEmit
```

Build:

```bash
npm run build
```

Pastikan workflow berikut berjalan:

* [x] Authentication
* [x] Dashboard
* [x] Project Management
* [x] AI Script Generation
* [x] SEO Workflow
* [x] Thumbnail Workflow
* [x] Voiceover Workflow
* [x] Subtitle Workflow
* [x] YouTube Integration
* [x] Database Integration
* [x] AI Service Integration

---

# 📈 Roadmap

Pengembangan berikutnya:

* [ ] AI Content Planner
* [ ] Content Calendar
* [ ] AI Video Title Scoring
* [ ] AI Thumbnail Scoring
* [ ] Automated Content Pipeline
* [ ] YouTube Analytics
* [ ] Multi-channel Management
* [ ] Scheduled YouTube Publishing
* [ ] YouTube Shorts Generator
* [ ] AI Content Repurposing
* [ ] Performance Analytics
* [ ] Production Deployment
* [ ] CI/CD
* [ ] Monitoring
* [ ] Automated Backup

---

# 🎯 Project Vision

AI-Tube-Pro dikembangkan dengan visi menjadi **end-to-end AI YouTube Content Production Platform**.

```text
IDEA
 ↓
SCRIPT
 ↓
SEO
 ↓
THUMBNAIL
 ↓
VOICEOVER
 ↓
SUBTITLE
 ↓
VIDEO
 ↓
YOUTUBE
 ↓
ANALYTICS
```

Tujuan akhirnya adalah membantu creator mengurangi pekerjaan manual dan mengelola seluruh workflow produksi konten YouTube dari satu platform.

---

# 👨‍💻 Portfolio Purpose

Project ini dikembangkan sebagai portfolio **Full-Stack AI Application** dengan fokus pada:

* Full-stack development
* AI integration
* REST API
* Database architecture
* Authentication
* Repository Pattern
* Service Layer Architecture
* AI microservice
* OAuth integration
* YouTube API integration
* Docker
* TypeScript
* Python
* FastAPI

Project ini menunjukkan bagaimana **AI dapat diintegrasikan ke dalam aplikasi bisnis nyata untuk mengotomatisasi workflow**, bukan hanya digunakan sebagai chatbot.

---

# 📄 License

Project ini dibuat untuk keperluan portfolio dan pengembangan aplikasi.

---

## ⭐ Support

Jika project ini menarik atau bermanfaat, jangan lupa memberikan ⭐ pada repository.

**Built with ❤️ for content creators.**
