# 🚀 Quick Deployment Guide

## Prerequisites

- Node.js 20+ installed
- Git repository set up
- Account on Vercel (free tier)
- 30 minutes of time

---

## Step 1: Generate Icons (5 minutes)

Your app needs icons for PWA installation:

### Quick Option: Use Online Generator
1. Go to https://www.pwabuilder.com/imageGenerator
2. Upload any 512x512 image (logo, letter "V", etc.)
3. Download generated icons
4. Place files in `/public/`:
   - `icon-192x192.png`
   - `icon-512x512.png`

### Or: Create Simple Placeholders
```bash
# Using any image editor, create two PNG files:
# - 192x192 pixels with indigo background (#4f46e5) and white "VG" text
# - 512x512 pixels with same design
```

---

## Step 2: Test Local Build (2 minutes)

```bash
# Build the app
npm run build

# Test production build locally
npm start

# Open http://localhost:3000
# Verify everything works
```

✅ Build should succeed with no errors

---

## Step 3: Deploy to Vercel (10 minutes)

### A. Install Vercel CLI
```bash
npm install -g vercel
```

### B. Login to Vercel
```bash
vercel login
# Follow prompts to authenticate
```

### C. Deploy
```bash
# First deployment (creates project)
vercel

# Answer prompts:
# - Set up and deploy? Yes
# - Which scope? (your account)
# - Link to existing project? No
# - Project name: vocab-guide (or your choice)
# - Directory: ./ (press Enter)
# - Override settings? No

# Wait for deployment (1-2 minutes)
# You'll get a preview URL like: https://vocab-guide-xxxxx.vercel.app
```

### D. Set Up Database

#### Option 1: Vercel Postgres (Easiest)
```bash
# In Vercel Dashboard:
# 1. Go to your project
# 2. Click "Storage" tab
# 3. Click "Create Database"
# 4. Choose "Postgres"
# 5. Click "Create"
# 6. Copy environment variables (automatic)
```

#### Option 2: Supabase (Free PostgreSQL)
```bash
# 1. Sign up at https://supabase.com
# 2. Create new project (takes 2 minutes)
# 3. Go to Settings → Database
# 4. Copy connection string (use Connection Pooling URL)
```

### E. Configure Environment Variables

In Vercel Dashboard:
1. Go to Project → Settings → Environment Variables
2. Add these variables:

```env
# Database (from Vercel Postgres or Supabase)
DATABASE_URL=postgresql://user:pass@host:5432/db

# Auth Secret (generate below)
AUTH_SECRET=your-generated-secret

# Auth URL (your Vercel URL)
AUTH_URL=https://your-app.vercel.app

# Admin credentials (for first login)
DEFAULT_ADMIN_EMAIL=admin@yourdomain.com
DEFAULT_ADMIN_PASSWORD=SecurePassword123!
```

**Generate AUTH_SECRET:**
```bash
# On macOS/Linux:
openssl rand -base64 32

# On Windows PowerShell:
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### F. Update Database Schema

After setting environment variables:

```bash
# Pull environment variables
vercel env pull .env.local

# Update schema to PostgreSQL
# Edit prisma/schema.prisma - change datasource to:
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

# Generate Prisma client
npx prisma generate

# Push schema to production database
npx prisma db push

# Seed admin user
npx tsx prisma/seed-production.ts
```

### G. Deploy to Production

```bash
vercel --prod
```

✅ Your app is now live!

---

## Step 4: Verify Deployment (5 minutes)

Visit your production URL and test:

- [ ] App loads correctly
- [ ] Login with admin credentials works
- [ ] Can create a study level
- [ ] Can create a unit
- [ ] Can create a lesson
- [ ] Can add words
- [ ] PWA install prompt appears (mobile)
- [ ] No console errors

---

## Step 5: Set Custom Domain (Optional, 5 minutes)

In Vercel Dashboard:
1. Go to Project → Settings → Domains
2. Click "Add"
3. Enter your domain (e.g., vocab-guide.com)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (5-10 minutes)

---

## Troubleshooting

### Build Fails
```bash
# Check error message
# Common fixes:
npm install
npx prisma generate
npm run build
```

### Database Connection Error
- Verify DATABASE_URL is correct
- Check if database exists
- Ensure database accepts connections

### Login Not Working
- Verify AUTH_SECRET is set
- Check AUTH_URL matches your domain
- Ensure admin user was seeded

### Icons Not Showing
- Check files exist: `/public/icon-192x192.png`, `/public/icon-512x512.png`
- Verify file names are exact (case-sensitive)
- Clear browser cache

---

## Need Help?

- **Full Guide:** See `DEPLOYMENT_GUIDE.md`
- **Vercel Docs:** https://vercel.com/docs
- **Prisma Deploy:** https://www.prisma.io/docs/guides/deployment

---

## Quick Commands Reference

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Pull environment variables
vercel env pull

# View logs
vercel logs

# Rollback to previous deployment
vercel rollback
```

---

## After Deployment

1. **Change Admin Password:**
   - Login with default credentials
   - Create new admin user
   - Delete default admin (future feature)

2. **Add Content:**
   - Create study levels
   - Add units and lessons
   - Import vocabulary

3. **Share:**
   - Test on mobile devices
   - Install as PWA
   - Share with users

---

## Estimated Costs

**Free Tier (Vercel):**
- 100GB bandwidth/month
- 100 deployments/day
- Serverless functions
- Automatic HTTPS

**Database:**
- Vercel Postgres: Free 256MB
- Supabase: Free 500MB + 2GB bandwidth

**Total:** $0/month for small to medium usage 🎉

---

**Ready?** Run `vercel` to deploy now! 🚀

**Questions?** Check `DEPLOYMENT_GUIDE.md` for detailed instructions.
