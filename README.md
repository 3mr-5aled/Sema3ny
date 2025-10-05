# Sema3ny - English Vocabulary Guide

A full-stack English teaching web application with CMS functionality, built for English teachers to manage vocabulary lessons and students to practice with interactive word cards.

## 🚀 Features

### For Students (Public Access)
- **Hierarchical Learning Structure**: Study Levels → Units → Lessons → Words
- **Interactive Word Cards**: 
  - Large English words with Arabic translations (RTL support)
  - Part of speech tags with color coding
  - Text-to-speech with American 🇺🇸 and British 🇬🇧 accent options
- **Responsive Design**: Mobile-first approach with dark mode support
- **No Login Required**: Direct access to learning materials

### For Teachers (Dashboard)
- **Content Management System**:
  - Create and manage study levels, units, and lessons
  - Accordion/toggle interface for easy navigation
  - Bulk word import via JSON format
- **Word Organization**:
  - Support for "key" and "additional" word categories
  - JSON-based word input system
  - Real-time word count and progress tracking

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Frontend**: React, TypeScript, TailwindCSS
- **Icons**: React Icons (FaPlay, FaBook, FaLayerGroup, etc.)
- **Database**: PostgreSQL with Prisma ORM
- **Backend**: Next.js API Routes
- **Styling**: Tailwind CSS with dark mode support

## 📋 Database Schema

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
  en       String
  ar       String
  part     String
  category String // "key" or "additional"
  lesson   Lesson @relation(fields: [lessonId], references: [id])
  lessonId Int
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (local or Supabase)

### Installation

1. **Clone and install dependencies**:
```bash
git clone <repository-url>
cd vocab-guide-webapp
npm install
```

2. **Set up your database**:
```bash
# Start local Prisma dev database
npx prisma dev

# Or update .env with your PostgreSQL URL
DATABASE_URL="postgresql://username:password@localhost:5432/vocab_guide"
```

3. **Run database migrations**:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. **Start the development server**:
```bash
npm run dev
```

5. **Open your browser**: http://localhost:3000

## 📖 Usage

### For Students
1. Visit the homepage
2. Select a study level
3. Choose a unit, then a lesson
4. Practice with interactive word cards
5. Use the pronunciation buttons for American/British accents

### For Teachers
1. Go to `/dashboard`
2. Create study levels, units, and lessons
3. Add words using JSON format:

```json
{
  "key": [
    { "en": "awkward", "ar": "مُحرِج/غير مُريح", "part": "adj" },
    { "en": "laughter", "ar": "ضِحك", "part": "n" }
  ],
  "additional": [
    { "en": "absence", "ar": "غياب", "part": "n" },
    { "en": "physically", "ar": "جسدياً", "part": "adv" }
  ]
}
```

## 🌐 API Endpoints

- `GET /api/levels` - Get all study levels with hierarchy
- `POST /api/levels` - Create new study level
- `POST /api/units` - Create new unit
- `POST /api/lessons` - Create new lesson
- `POST /api/lessons/[id]/words` - Add words to lesson (JSON)

## 🎨 Design Features

- **Academic Feel**: Professional styling with Tailwind CSS
- **RTL Support**: Proper Arabic text display
- **Color-coded Tags**: Different colors for parts of speech
- **Card-based Layout**: Modern design with hover effects
- **Dark Mode**: Full dark mode support
- **Responsive**: Works on all screen sizes

## 📱 Contact Information

**Teacher**: Mr Khaled Morcy  
**Phone**: 01023144722  
**Developer**: [3mr 5aled](https://3mr5aled.vercel.app/)

## 📄 License

This project is created for educational purposes.

## 🚀 Deployment

This project is production-ready and can be deployed to various platforms.

### Quick Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to production
vercel --prod
```

**Detailed Guides:**
- 📘 **Quick Start**: See [`QUICK_DEPLOY.md`](./QUICK_DEPLOY.md) (15 min setup)
- 📖 **Complete Guide**: See [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md) (all platforms)
- ✅ **Ready Check**: See [`DEPLOYMENT_READY.md`](./DEPLOYMENT_READY.md) (status)

### Other Deployment Options
- **Docker**: Use included `Dockerfile` and `docker-compose.yml`
- **Netlify**: Deploy with one click
- **Railway**: Automated PostgreSQL setup
- **Self-hosted**: Full instructions in deployment guide

### Pre-Deployment Checklist
1. Generate app icons (see `ICON_TODO.md`)
2. Set up production database (PostgreSQL)
3. Configure environment variables
4. Run `npm run build` to verify
5. Follow platform-specific guide

**Production Features:**
- ✅ PWA support (installable on mobile)
- ✅ Offline mode with service worker
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Health check endpoint
- ✅ Database migrations
- ✅ Error tracking ready

## 📚 Documentation

- [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md) - Complete deployment guide
- [`QUICK_DEPLOY.md`](./QUICK_DEPLOY.md) - Quick start deployment
- [`PWA_GUIDE.md`](./PWA_GUIDE.md) - Progressive Web App features
- [`ICON_TODO.md`](./ICON_TODO.md) - Icon generation instructions
- [`API_CLIENT_GUIDE.md`](./API_CLIENT_GUIDE.md) - API usage guide
