<div align="center">

# 📚 EntQha - English Vocabulary Guide

### *Your Interactive Platform for Mastering English Vocabulary*

A modern, full-stack English teaching web application with powerful CMS functionality. Built for teachers to manage comprehensive vocabulary lessons and students to practice with engaging interactive word cards.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.8-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-5.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[🚀 Live Demo](#) • [📖 Documentation](#-documentation) • [🐛 Report Bug](../../issues) • [✨ Request Feature](../../issues)

---

</div>

## 📑 Table of Contents

- [✨ Features](#-features)
- [🛠 Tech Stack](#-tech-stack)
- [📸 Screenshots](#-screenshots)
- [🏗 Database Schema](#-database-schema)
- [🚀 Getting Started](#-getting-started)
- [📖 Usage Guide](#-usage-guide)
- [🌐 API Documentation](#-api-documentation)
- [🚀 Deployment](#-deployment)
- [🎨 Design Features](#-design-features)
- [🔧 Configuration](#-configuration)
- [🤝 Contributing](#-contributing)
- [📚 Documentation](#-documentation)
- [📱 Contact](#-contact)
- [📄 License](#-license)

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 👨‍🎓 For Students (Public Access)

- 🎯 **Hierarchical Learning Path**  
  Study Levels → Units → Lessons → Words
  
- 🎴 **Interactive Word Cards**  
  - Large, readable English words with Arabic translations
  - Full RTL (Right-to-Left) support for Arabic text
  - Color-coded part of speech tags
  
- 🔊 **Dual Pronunciation System**  
  Text-to-speech with American 🇺🇸 and British 🇬🇧 accents
  
- 📱 **Progressive Web App**  
  - Install on mobile devices
  - Offline mode support
  - Fast, app-like experience
  
- 🌙 **Dark Mode Support**  
  Eye-friendly interface for day and night study
  
- 🔓 **No Login Required**  
  Instant access to all learning materials

</td>
<td width="50%">

### 👨‍🏫 For Teachers (Dashboard)

- 📊 **Complete CMS Dashboard**  
  Full content management for all learning materials
  
- 🗂 **Hierarchical Content Structure**  
  - Create and manage study levels
  - Organize units within levels
  - Design lessons with custom vocabulary
  
- 📋 **Accordion Interface**  
  Intuitive toggle navigation for easy content management
  
- 📥 **Bulk Word Import**  
  JSON-based import system for efficient data entry
  
- 🏷 **Smart Word Categorization**  
  - "Key Words" for essential vocabulary
  - "Additional Words" for supplementary learning
  
- 📈 **Real-time Analytics**  
  Word count and progress tracking per lesson
  
- 🔐 **Secure Access**  
  Authentication-protected admin panel

</td>
</tr>
</table>

---

## 🛠 Tech Stack

<div align="center">

### Frontend
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js) 
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react) 
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript) 
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?logo=tailwind-css)

### Backend
![Next.js API](https://img.shields.io/badge/Next.js_API_Routes-black?logo=next.js)
![Prisma](https://img.shields.io/badge/Prisma_ORM-5.0-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)

### Development & Deployment
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)
![Vercel](https://img.shields.io/badge/Vercel-Deploy-black?logo=vercel)
![PWA](https://img.shields.io/badge/PWA-Enabled-5A0FC8?logo=pwa)

</div>

**Core Technologies:**
- **Framework**: Next.js 14 with App Router & Server Components
- **Language**: TypeScript for type-safe development
- **Styling**: Tailwind CSS with custom design tokens
- **Icons**: React Icons (FaPlay, FaBook, FaLayerGroup, etc.)
- **Database**: PostgreSQL 16 with Prisma ORM
- **API**: RESTful API with Next.js API Routes
- **Authentication**: NextAuth.js (ready for integration)
- **PWA**: Service Worker with offline caching
- **Deployment**: Docker, Vercel, Railway, Netlify ready

---

## 📸 Screenshots

<div align="center">

### Student Interface
*Interactive word cards with dual pronunciation*

### Teacher Dashboard
*Comprehensive CMS for content management*

### Mobile PWA
*Installable app experience on any device*

</div>

> 📷 *Screenshots coming soon! Will showcase the learning hierarchy, word cards, and teacher dashboard.*

---

## 🏗 Database Schema

The application uses a clean, hierarchical database structure powered by Prisma ORM:

```prisma
model StudyLevel {
  id    Int    @id @default(autoincrement())
  name  String
  units Unit[]
}

model Unit {
  id           Int        @id @default(autoincrement())
  name         String
  studyLevel   StudyLevel @relation(fields: [studyLevelId], references: [id])
  studyLevelId Int
  lessons      Lesson[]
}

model Lesson {
  id     Int    @id @default(autoincrement())
  name   String
  unit   Unit   @relation(fields: [unitId], references: [id])
  unitId Int
  words  Word[]
}

model Word {
  id       Int    @id @default(autoincrement())
  en       String  // English word
  ar       String  // Arabic translation
  part     String  // Part of speech (verb, noun, adjective, etc.)
  category String  // "key" or "additional"
  lesson   Lesson @relation(fields: [lessonId], references: [id])
  lessonId Int
}
```

**Relationship Flow:**  
`StudyLevel` 1→N `Unit` 1→N `Lesson` 1→N `Word`

---

## � Getting Started

Follow these steps to set up the project locally for development.

### 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0 or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **PostgreSQL** 14+ database
  - Local installation, OR
  - Cloud database (Neon, Supabase, Railway, etc.)
- **Git** for cloning the repository

### 📥 Installation

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/vocab-guide-webapp.git
cd vocab-guide-webapp
```

#### 2️⃣ Install Dependencies

```bash
npm install
# or
yarn install
```

#### 3️⃣ Environment Setup

Create a `.env` file in the root directory:

```bash
# Database Connection
DATABASE_URL="postgresql://username:password@localhost:5432/vocab_guide"

# Optional: NextAuth Configuration
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

**Database URL Formats:**

```bash
# Local PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/vocab_guide"

# Neon Database
DATABASE_URL="postgresql://user:pass@ep-cool-name-123456.us-east-2.aws.neon.tech/vocab_guide?sslmode=require"

# Supabase
DATABASE_URL="postgresql://postgres:pass@db.project.supabase.co:5432/postgres"

# Railway
DATABASE_URL="postgresql://postgres:pass@containers-us-west-1.railway.app:5432/railway"
```

#### 4️⃣ Database Setup

Generate Prisma Client and run migrations:

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Seed sample data
npx prisma db seed
```

#### 5️⃣ Start Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at **http://localhost:3000** 🎉

### 🚀 Quick Start (Alternative)

Use this one-liner for quick setup:

```bash
git clone <repo-url> && cd vocab-guide-webapp && npm install && npx prisma generate && npx prisma migrate dev && npm run dev
```

### ✅ Verify Installation

1. Open http://localhost:3000
2. You should see the study levels page
3. Navigate to http://localhost:3000/dashboard for teacher CMS
4. Check http://localhost:3000/api/health for API health status

---

## 📖 Usage Guide

### 👨‍🎓 For Students

#### Step-by-Step Learning Flow

1. **Access the Platform**  
   Visit the homepage at http://localhost:3000 (or production URL)

2. **Choose Your Study Level**  
   Browse available study levels (e.g., "High School", "University", "Advanced")

3. **Select a Unit**  
   Pick a unit within your chosen level (e.g., "Unit 1: Academic Vocabulary")

4. **Pick a Lesson**  
   Choose a specific lesson (e.g., "Lesson 1: Research and Study")

5. **Study with Word Cards**  
   - View large, clear English words
   - See Arabic translations in RTL format
   - Check the part of speech (color-coded)
   - Listen to pronunciations:
     - Click 🇺🇸 for American accent
     - Click 🇬🇧 for British accent

6. **Navigate Freely**  
   Use breadcrumb navigation to explore different lessons and units

#### Tips for Students
- 📱 Install as a PWA for offline access
- 🎧 Use headphones for better pronunciation practice
- 🌙 Enable dark mode for comfortable night study
- 🔄 Revisit lessons regularly for better retention

---

### 👨‍🏫 For Teachers

#### Accessing the Dashboard

Navigate to: **http://localhost:3000/dashboard**

> 🔐 Note: Authentication is ready for integration. Currently accessible without login for development.

#### Creating Content Structure

**1. Create a Study Level**

```typescript
// Example: "High School English" or "IELTS Preparation"
Name: "High School English"
```

**2. Add Units to the Level**

```typescript
// Example: "Unit 1: Academic Vocabulary"
Study Level: High School English
Unit Name: "Unit 1: Academic Vocabulary"
```

**3. Create Lessons within Units**

```typescript
// Example: "Lesson 1: Research and Study"
Unit: Unit 1: Academic Vocabulary
Lesson Name: "Lesson 1: Research and Study"
```

**4. Import Words to Lessons**

Use the JSON import interface to add vocabulary:

#### JSON Word Format

```json
{
  "Key Words": [
    { "en": "accomplish", "ar": "يُنجِز", "part": "verb" },
    { "en": "achievement", "ar": "إنجاز", "part": "noun" },
    { "en": "challenge", "ar": "تحدي", "part": "noun" }
  ],
  "Additional Words": [
    { "en": "absence", "ar": "غياب", "part": "noun" },
    { "en": "accurately", "ar": "بدقة", "part": "adverb" }
  ],
  "Verbs": [
    { "en": "achieve", "ar": "يُحقِّق", "part": "verb" },
    { "en": "analyze", "ar": "يُحلِّل", "part": "verb" }
  ],
  "Adjectives": [
    { "en": "beneficial", "ar": "مُفيد", "part": "adjective" },
    { "en": "crucial", "ar": "حاسم", "part": "adjective" }
  ],
  "Expressions": [
    { "en": "as a result", "ar": "نتيجة لذلك", "part": "other" },
    { "en": "deal with", "ar": "يتعامل مع", "part": "other" }
  ]
}
```

#### Supported Parts of Speech

- `verb` - Verbs
- `noun` - Nouns  
- `adjective` or `adj` - Adjectives
- `adverb` or `adv` - Adverbs
- `other` - Expressions, phrases, or other categories

#### Dashboard Features

- **Accordion Navigation**: Expand/collapse levels, units, and lessons
- **Real-time Counts**: See word counts for each lesson
- **Edit & Delete**: Modify or remove content as needed
- **Bulk Operations**: Import multiple words at once via JSON

#### Best Practices for Teachers

- 📝 Organize lessons thematically (e.g., "Travel Vocabulary", "Business English")
- 🎯 Use "Key Words" for essential vocabulary (10-15 words)
- 📚 Add "Additional Words" for supplementary learning (10-20 words)
- 🔤 Group words by category (Verbs, Adjectives, Expressions)
- ✅ Verify Arabic translations and diacritics
- 🔊 Test pronunciation after importing

---

## 🌐 API Documentation

The application exposes a RESTful API for managing educational content.

### Base URL
```
http://localhost:3000/api
```

### Endpoints Overview

#### 🏷 Study Levels

<table>
<tr>
<th>Method</th>
<th>Endpoint</th>
<th>Description</th>
</tr>
<tr>
<td><code>GET</code></td>
<td><code>/api/levels</code></td>
<td>Get all study levels with full hierarchy</td>
</tr>
<tr>
<td><code>GET</code></td>
<td><code>/api/levels/:id</code></td>
<td>Get specific level by ID</td>
</tr>
<tr>
<td><code>POST</code></td>
<td><code>/api/levels</code></td>
<td>Create new study level</td>
</tr>
<tr>
<td><code>PUT</code></td>
<td><code>/api/levels/:id</code></td>
<td>Update study level</td>
</tr>
<tr>
<td><code>DELETE</code></td>
<td><code>/api/levels/:id</code></td>
<td>Delete study level</td>
</tr>
</table>

#### 📚 Units

<table>
<tr>
<th>Method</th>
<th>Endpoint</th>
<th>Description</th>
</tr>
<tr>
<td><code>GET</code></td>
<td><code>/api/units</code></td>
<td>Get all units</td>
</tr>
<tr>
<td><code>GET</code></td>
<td><code>/api/units/:id</code></td>
<td>Get specific unit by ID</td>
</tr>
<tr>
<td><code>POST</code></td>
<td><code>/api/units</code></td>
<td>Create new unit</td>
</tr>
<tr>
<td><code>PUT</code></td>
<td><code>/api/units/:id</code></td>
<td>Update unit</td>
</tr>
<tr>
<td><code>DELETE</code></td>
<td><code>/api/units/:id</code></td>
<td>Delete unit</td>
</tr>
</table>

#### 📖 Lessons

<table>
<tr>
<th>Method</th>
<th>Endpoint</th>
<th>Description</th>
</tr>
<tr>
<td><code>GET</code></td>
<td><code>/api/lessons</code></td>
<td>Get all lessons</td>
</tr>
<tr>
<td><code>GET</code></td>
<td><code>/api/lessons/:id</code></td>
<td>Get specific lesson by ID</td>
</tr>
<tr>
<td><code>POST</code></td>
<td><code>/api/lessons</code></td>
<td>Create new lesson</td>
</tr>
<tr>
<td><code>PUT</code></td>
<td><code>/api/lessons/:id</code></td>
<td>Update lesson</td>
</tr>
<tr>
<td><code>DELETE</code></td>
<td><code>/api/lessons/:id</code></td>
<td>Delete lesson</td>
</tr>
</table>

#### 📝 Words

<table>
<tr>
<th>Method</th>
<th>Endpoint</th>
<th>Description</th>
</tr>
<tr>
<td><code>GET</code></td>
<td><code>/api/lessons/:id/words</code></td>
<td>Get all words for a lesson</td>
</tr>
<tr>
<td><code>POST</code></td>
<td><code>/api/lessons/:id/words</code></td>
<td>Add words to lesson (JSON format)</td>
</tr>
<tr>
<td><code>PUT</code></td>
<td><code>/api/words/:id</code></td>
<td>Update specific word</td>
</tr>
<tr>
<td><code>DELETE</code></td>
<td><code>/api/words/:id</code></td>
<td>Delete specific word</td>
</tr>
</table>

#### ❤️ Health Check

<table>
<tr>
<th>Method</th>
<th>Endpoint</th>
<th>Description</th>
</tr>
<tr>
<td><code>GET</code></td>
<td><code>/api/health</code></td>
<td>Check API and database health</td>
</tr>
</table>

### Request Examples

#### Create a Study Level

```bash
curl -X POST http://localhost:3000/api/levels \
  -H "Content-Type: application/json" \
  -d '{"name": "High School English"}'
```

#### Create a Unit

```bash
curl -X POST http://localhost:3000/api/units \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Unit 1: Academic Vocabulary",
    "studyLevelId": 1
  }'
```

#### Create a Lesson

```bash
curl -X POST http://localhost:3000/api/lessons \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Lesson 1: Research and Study",
    "unitId": 1
  }'
```

#### Add Words to Lesson (JSON Import)

```bash
curl -X POST http://localhost:3000/api/lessons/1/words \
  -H "Content-Type: application/json" \
  -d '{
    "Key Words": [
      { "en": "accomplish", "ar": "يُنجِز", "part": "verb" },
      { "en": "achievement", "ar": "إنجاز", "part": "noun" }
    ],
    "Additional Words": [
      { "en": "absence", "ar": "غياب", "part": "noun" }
    ]
  }'
```

#### Get All Levels with Full Hierarchy

```bash
curl http://localhost:3000/api/levels
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "High School English",
    "units": [
      {
        "id": 1,
        "name": "Unit 1: Academic Vocabulary",
        "lessons": [
          {
            "id": 1,
            "name": "Lesson 1: Research and Study",
            "words": [
              {
                "id": 1,
                "en": "accomplish",
                "ar": "يُنجِز",
                "part": "verb",
                "category": "key"
              }
            ]
          }
        ]
      }
    ]
  }
]
```

### Response Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `201` | Created successfully |
| `400` | Bad request - Invalid data |
| `404` | Resource not found |
| `500` | Internal server error |

---

## 🚀 Deployment

This application is production-ready and can be deployed to multiple platforms with minimal configuration.

### ⚡ Quick Deploy to Vercel (Recommended)

Vercel provides the fastest deployment with automatic HTTPS, global CDN, and zero configuration.

#### Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy to production
vercel --prod
```

#### Using Vercel Dashboard

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Add environment variables:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `NEXTAUTH_SECRET` - Random secret key
6. Click "Deploy"

**Deployment Time:** ~2 minutes ⚡

---

### 🐳 Deploy with Docker

Perfect for self-hosting or cloud providers like AWS, GCP, DigitalOcean.

#### Using Docker Compose (Includes PostgreSQL)

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

This starts:
- Application on port 3000
- PostgreSQL on port 5432

#### Using Dockerfile Only

```bash
# Build the image
docker build -t vocab-guide .

# Run the container
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  vocab-guide
```

---

### 🚂 Deploy to Railway

Railway provides automatic PostgreSQL provisioning and simple deployment.

#### Method 1: One-Click Deploy

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

#### Method 2: Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add PostgreSQL
railway add

# Deploy
railway up
```

Railway automatically:
- ✅ Provisions PostgreSQL database
- ✅ Sets DATABASE_URL environment variable
- ✅ Runs migrations on deploy
- ✅ Provides HTTPS domain

---

### 🌊 Deploy to Netlify

Netlify supports Next.js with serverless functions.

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

**Required Configuration:**
1. Add build command: `npm run build`
2. Add publish directory: `.next`
3. Add environment variables in Netlify dashboard
4. Use external PostgreSQL (Neon, Supabase, etc.)

---

### ☁️ Deploy to Cloud Providers

#### AWS (Elastic Beanstalk)
```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init

# Create environment
eb create production

# Deploy
eb deploy
```

#### Google Cloud (App Engine)
```bash
# Deploy
gcloud app deploy

# View logs
gcloud app logs tail -s default
```

#### Azure (Web Apps)
```bash
# Create web app
az webapp create --name vocab-guide --resource-group myGroup

# Deploy
az webapp deployment source config-local-git
git push azure main
```

---

### 📋 Pre-Deployment Checklist

Before deploying to production, complete these steps:

- [ ] **Environment Variables**
  ```bash
  DATABASE_URL="your-production-database-url"
  NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
  NEXTAUTH_URL="https://your-domain.com"
  NODE_ENV="production"
  ```

- [ ] **Database Setup**
  ```bash
  # Run migrations on production database
  npx prisma migrate deploy
  
  # (Optional) Seed initial data
  npx prisma db seed
  ```

- [ ] **Build Verification**
  ```bash
  # Test production build locally
  npm run build
  npm run start
  ```

- [ ] **PWA Assets** (Optional)
  - Generate app icons (see [public/manifest.json](public/manifest.json))
  - Update manifest.json with your details
  - Test service worker functionality

- [ ] **Security**
  - [ ] Enable HTTPS (automatic on Vercel/Netlify)
  - [ ] Set secure NEXTAUTH_SECRET
  - [ ] Configure CORS if needed
  - [ ] Add authentication if required

- [ ] **Performance**
  - [ ] Enable gzip compression
  - [ ] Configure CDN (automatic on Vercel)
  - [ ] Set up database connection pooling

---

### 🎯 Production Features

Once deployed, your application includes:

- ✅ **Progressive Web App** - Installable on mobile devices
- ✅ **Offline Mode** - Service worker with caching
- ✅ **Automatic HTTPS** - SSL certificates (platform dependent)
- ✅ **Global CDN** - Fast worldwide access (Vercel/Netlify)
- ✅ **Health Monitoring** - `/api/health` endpoint
- ✅ **Database Migrations** - Automated with Prisma
- ✅ **Error Tracking** - Ready for Sentry integration
- ✅ **SEO Optimized** - Meta tags and sitemap ready
- ✅ **Mobile Responsive** - Works on all devices
- ✅ **Dark Mode** - Theme persistence

---

### 📚 Deployment Documentation

For detailed platform-specific guides, see:

| Guide | Description | Time |
|-------|-------------|------|
| [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) | Fast deployment guide | ~15 min |
| [DEPLOYMENT_FIX.md](./DEPLOYMENT_FIX.md) | Common deployment issues | As needed |
| [DEPLOYMENT_404_FIX.md](./DEPLOYMENT_404_FIX.md) | Fix 404 errors | As needed |

---

## 🎨 Design Features

The application features a modern, accessible interface optimized for learning.

### 🎯 User Interface

- **Academic Aesthetic**: Professional, clean design with Tailwind CSS
- **Card-Based Layout**: Modern card components with hover effects and shadows
- **Hierarchical Navigation**: Clear breadcrumb trails and intuitive flow
- **Color-Coded Tags**: Visual distinction for parts of speech
  - 🟦 Verbs - Blue
  - 🟩 Nouns - Green
  - 🟨 Adjectives - Yellow
  - 🟧 Adverbs - Orange
  - 🟪 Others/Expressions - Purple

### 🌍 Internationalization

- **RTL Support**: Full right-to-left layout for Arabic text
- **Bidirectional Text**: English (LTR) and Arabic (RTL) in one interface
- **Unicode Support**: Proper rendering of Arabic diacritics
- **Font Optimization**: Readable fonts for both English and Arabic

### 📱 Responsive Design

- **Mobile-First**: Optimized for phones, tablets, and desktops
- **Breakpoints**:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px
- **Touch-Friendly**: Large tap targets for mobile devices
- **Adaptive Layouts**: Content reflows based on screen size

### 🌙 Dark Mode

- **System Preference**: Automatically detects OS theme
- **Manual Toggle**: User can switch themes manually
- **Persistent**: Theme preference saved in localStorage
- **Smooth Transitions**: Animated theme switching
- **High Contrast**: Optimized colors for readability

### 🎭 Accessibility

- **Screen Reader Friendly**: Semantic HTML and ARIA labels
- **Keyboard Navigation**: Full keyboard support
- **Focus Indicators**: Clear focus states for interactive elements
- **Color Contrast**: WCAG AA compliant contrast ratios
- **Text Sizing**: Responsive typography that scales properly

### 🎵 Audio Features

- **Text-to-Speech**: Web Speech API integration
- **Dual Accents**:
  - 🇺🇸 American English (en-US)
  - 🇬🇧 British English (en-GB)
- **Pronunciation Buttons**: Clear visual feedback
- **Audio Controls**: Pause, replay functionality

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Database Configuration
DATABASE_URL="postgresql://user:password@host:5432/database"

# NextAuth Configuration (Optional)
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Node Environment
NODE_ENV="development"  # or "production"
```

### Prisma Configuration

Prisma is configured in [prisma/schema.prisma](prisma/schema.prisma):

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

### Next.js Configuration

Customize [next.config.ts](next.config.ts) for:

- Image optimization
- Internationalization
- API rewrites
- Custom headers
- Security policies

### PWA Configuration

Progressive Web App settings in [public/manifest.json](public/manifest.json):

```json
{
  "name": "EntQha - English Vocabulary Guide",
  "short_name": "EntQha",
  "description": "Interactive English vocabulary learning platform",
  "theme_color": "#1e40af",
  "background_color": "#ffffff",
  "display": "standalone",
  "start_url": "/",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Tailwind Configuration

Customize theme in [tailwind.config.ts](tailwind.config.ts):

- Colors and typography
- Spacing and breakpoints
- Custom plugins
- Dark mode settings

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### How to Contribute

1. **Fork the Repository**
   ```bash
   gh repo fork yourusername/vocab-guide-webapp
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make Your Changes**
   - Write clean, documented code
   - Follow existing code style
   - Add tests if applicable

4. **Commit Your Changes**
   ```bash
   git commit -m "Add: amazing new feature"
   ```

5. **Push to Your Fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Describe your changes
   - Reference any related issues
   - Wait for review

### Commit Convention

We follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

### Development Guidelines

- ✅ Write TypeScript, not JavaScript
- ✅ Use functional components and hooks
- ✅ Follow React best practices
- ✅ Ensure responsive design
- ✅ Test on multiple browsers
- ✅ Document complex logic
- ✅ Keep components small and focused
- ✅ Use Tailwind CSS for styling
- ✅ Maintain accessibility standards

### What We're Looking For

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- 🌍 Internationalization (new languages)
- ♿ Accessibility improvements
- ⚡ Performance optimizations
- 🧪 Test coverage

### Questions?

Feel free to open an issue for:
- Feature requests
- Bug reports
- Documentation clarification
- General questions

---

## 📚 Documentation

Comprehensive guides and documentation for all aspects of the project:

### 📖 Core Documentation

| Document | Description | Status |
|----------|-------------|--------|
| [README.md](./README.md) | Main project documentation | ✅ Current |
| [TODO.md](./TODO.md) | Project roadmap and tasks | 📝 Active |
| [CHANGELOG.md](./CHANGELOG.md) | Version history and changes | 📝 Updated |

### 🚀 Deployment Guides

| Guide | Platform | Difficulty | Time |
|-------|----------|------------|------|
| [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) | Vercel | ⭐ Easy | ~15 min |
| [DEPLOYMENT_FIX.md](./DEPLOYMENT_FIX.md) | All | ⭐⭐ Medium | As needed |
| [DEPLOYMENT_404_FIX.md](./DEPLOYMENT_404_FIX.md) | Vercel/Netlify | ⭐ Easy | 5 min |

### 📱 Mobile & PWA

| Guide | Topic | Focus |
|-------|-------|-------|
| [MOBILE_VOICE_GUIDE.md](./MOBILE_VOICE_GUIDE.md) | Voice features | Mobile audio |
| [public/manifest.json](./public/manifest.json) | PWA config | Installation |
| [public/service-worker.js](./public/service-worker.js) | Offline mode | Caching |

### 📊 Database

| Document | Purpose | Usage |
|----------|---------|-------|
| [prisma/schema.prisma](./prisma/schema.prisma) | Database schema | Core structure |
| [prisma/RESET_SEQUENCES.md](./prisma/RESET_SEQUENCES.md) | Reset DB sequences | Maintenance |
| [prisma/seed.ts](./prisma/seed.ts) | Sample data | Development |

### 📝 Sample Data

| File | Type | Purpose |
|------|------|---------|
| [exampledata.json](./exampledata.json) | JSON | Word import example |
| [SAMPLE_WORDS.md](./SAMPLE_WORDS.md) | Markdown | Word list reference |

### 🔧 Scripts & Tools

| Script | Function | When to Use |
|--------|----------|-------------|
| [scripts/check-data.ts](./scripts/check-data.ts) | Data validation | Before deployment |
| [scripts/pre-deploy-check.js](./scripts/pre-deploy-check.js) | Build verification | CI/CD pipeline |
| [scripts/prewarm-cache.ts](./scripts/prewarm-cache.ts) | Cache optimization | After deployment |

---

## 📱 Contact

<div align="center">

### Mr Khaled Morcy
*English Language Instructor*

📞 **Phone**: [01023144722](tel:+201023144722)  
📧 **Email**: contact@example.com  
🌐 **Website**: Visit Website

---

### Developer

**Developed by**: [3mr 5aled](https://3mr5aled.vercel.app/)  
💼 **Portfolio**: [3mr5aled.vercel.app](https://3mr5aled.vercel.app/)  
💻 **GitHub**: @yourusername  
📧 **Email**: dev@example.com

</div>

---

## 📄 License

This project is created for **educational purposes**.

### Usage Terms

- ✅ Free to use for educational purposes
- ✅ Can be modified and adapted
- ✅ Can be used in classrooms and learning institutions
- ⚠️ Please provide attribution when using
- ⚠️ Not for commercial use without permission

### Attribution

When using or modifying this project, please include:

```
Original Project: EntQha - English Vocabulary Guide
Created by: Mr Khaled Morcy
Developer: 3mr 5aled (https://3mr5aled.vercel.app/)
```

---

## 🌟 Acknowledgments

This project was built with the help of:

- **Next.js Team** - For the amazing React framework
- **Vercel** - For excellent deployment platform
- **Prisma** - For the intuitive database ORM
- **Tailwind CSS** - For the utility-first CSS framework
- **React Icons** - For beautiful icon library
- **Open Source Community** - For inspiration and tools

---

## 🗺 Roadmap

Future enhancements planned for the project:

### Phase 1: Core Features ✅
- [x] Hierarchical content structure
- [x] Interactive word cards
- [x] Teacher dashboard
- [x] Dual pronunciation (US/UK)
- [x] Dark mode
- [x] PWA support

### Phase 2: Enhanced Features 🚧
- [ ] User authentication & profiles
- [ ] Progress tracking for students
- [ ] Spaced repetition algorithm
- [ ] Quiz and assessment tools
- [ ] Flashcard study mode
- [ ] Audio recording for practice

### Phase 3: Advanced Features 🔮
- [ ] AI-powered word recommendations
- [ ] Speech recognition for pronunciation practice
- [ ] Social learning features
- [ ] Gamification (points, badges, leaderboards)
- [ ] Mobile native apps (iOS/Android)
- [ ] Multi-language support (Spanish, French, etc.)

### Phase 4: Analytics & Admin 📊
- [ ] Learning analytics dashboard
- [ ] Student performance tracking
- [ ] Custom report generation
- [ ] Bulk import/export tools
- [ ] API documentation portal

---

## 🔍 FAQ

<details>
<summary><strong>Q: Do students need to create an account?</strong></summary>

No, the learning interface is completely open. Students can access all study materials without any login or account creation.
</details>

<details>
<summary><strong>Q: Can I use this with other languages?</strong></summary>

Yes! While designed for English-Arabic, the system can be adapted for any language pair. You'll need to modify the text-to-speech configuration for different languages.
</details>

<details>
<summary><strong>Q: Is there a mobile app?</strong></summary>

The web app is a Progressive Web App (PWA), which means it can be installed on mobile devices and works like a native app with offline support.
</details>

<details>
<summary><strong>Q: How do I backup my data?</strong></summary>

Use Prisma's export tools or database backup utilities. For PostgreSQL:
```bash
pg_dump DATABASE_URL > backup.sql
```
</details>

<details>
<summary><strong>Q: Can multiple teachers manage content?</strong></summary>

Currently, the dashboard is open. For multi-teacher support, you'll need to implement authentication and role-based access control.
</details>

<details>
<summary><strong>Q: What browsers are supported?</strong></summary>

All modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

Text-to-speech requires browser support for the Web Speech API.
</details>

<details>
<summary><strong>Q: How do I add more pronunciation options?</strong></summary>

Edit the voice selection in the WordCards component. The Web Speech API supports multiple languages and accents. See [MOBILE_VOICE_GUIDE.md](./MOBILE_VOICE_GUIDE.md) for details.
</details>

---

## 🐛 Troubleshooting

### Common Issues

**Issue: Database connection fails**
```bash
# Check DATABASE_URL format
# Ensure PostgreSQL is running
# Verify network connectivity to database host
npx prisma db pull  # Test connection
```

**Issue: Build errors**
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

**Issue: Text-to-speech not working**
- Check browser compatibility (Chrome/Edge recommended)
- Ensure microphone permissions granted (some browsers require this)
- Test on different browser
- See [MOBILE_VOICE_GUIDE.md](./MOBILE_VOICE_GUIDE.md)

**Issue: Arabic text displays incorrectly**
- Verify RTL CSS is applied
- Check font supports Arabic characters
- Ensure proper Unicode encoding

**Issue: Dark mode not persisting**
- Check localStorage is enabled
- Clear browser cache
- Verify theme toggle logic

### Getting Help

1. 📖 Check the documentation files
2. 🔍 Search existing issues on GitHub
3. 💬 Open a new issue with:
   - Description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, browser, Node version)

---

<div align="center">

## ⭐ Star This Repository

If you find this project helpful, please consider giving it a star! It helps others discover the project and motivates continued development.

[![GitHub Stars](https://img.shields.io/github/stars/yourusername/vocab-guide-webapp?style=social)](../../stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/yourusername/vocab-guide-webapp?style=social)](../../network/members)
[![GitHub Issues](https://img.shields.io/github/issues/yourusername/vocab-guide-webapp)](../../issues)

---

### 📚 Happy Learning! 🎓

Made with ❤️ for education by [Mr Khaled Morcy](tel:+201023144722) and [3mr 5aled](https://3mr5aled.vercel.app/)

**Copyright © 2026 EntQha Project**

---

[🔝 Back to Top](#-EntQha---english-vocabulary-guide)

</div>
