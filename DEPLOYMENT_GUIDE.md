# 🚀 Sema3ny - Production Deployment Guide

This guide details the steps required to deploy the **Sema3ny** (Vocab Guide Webapp) to production, including environment setup, database configuration, PWA assets, and troubleshooting.

---

## 📋 Table of Contents
1. [Prerequisites](#-prerequisites)
2. [Environment Variables](#-environment-variables)
3. [Database Configuration (Neon PostgreSQL)](#-database-configuration-neon-postgresql)
4. [Deployment to Vercel (Recommended)](#-deployment-to-vercel-recommended)
5. [Deployment using Docker](#-deployment-using-docker)
6. [Managing Administrative Credentials](#-managing-administrative-credentials)
7. [Progressive Web App (PWA) Configurations](#-progressive-web-app-pwa-configurations)

---

## 🛠️ Prerequisites

Before deploying, ensure you have the following:
* A **GitHub** repository containing your code.
* A **Neon PostgreSQL** account (or another cloud PostgreSQL database).
* A **Vercel** account connected to your GitHub repository.
* Node.js v20+ and npm installed locally.

---

## 🔐 Environment Variables

Create and configure the following environment variables. They should be set in your Vercel Dashboard under **Settings ➔ Environment Variables** in production, or in your local `.env` file during local testing.

| Variable Name | Description | Example Value |
| --- | --- | --- |
| `DATABASE_URL` | Neon pooled connection string (used by app queries) | `postgresql://neondb_owner:...` |
| `DIRECT_URL` | Neon direct connection string (required by Prisma migrations) | `postgresql://neondb_owner:...` |
| `AUTH_SECRET` | Secret key used by NextAuth to sign JWT tokens | *Generate with: `openssl rand -base64 33`* |
| `AUTH_URL` | Base URL of your web application | `https://sema3ny.vercel.app` |
| `DEFAULT_ADMIN_EMAIL` | Default administrator login email | `admin@EntQha.com` |
| `DEFAULT_ADMIN_PASSWORD` | Default administrator login password | `EntQha@2020*` |

---

## 🐘 Database Configuration (Neon PostgreSQL)

We use Prisma ORM connected to Neon PostgreSQL.

### 1. Initialize Schema
To push the database schema directly to your production database, run:
```bash
npx prisma db push
```

### 2. Seed Initial Admin and Data
To seed initial application structure and default data:
```bash
npm run db:seed
```

To run the production-specific seed script:
```bash
npm run db:seed:prod
```

---

## ☁️ Deployment to Vercel (Recommended)

Vercel provides native, optimized hosting for Next.js applications.

### Automated Git Deployments (Recommended)
1. Push your code to your GitHub repository:
   ```bash
   git add .
   git commit -m "Configure production setup"
   git push origin main
   ```
2. Connect your repository to Vercel.
3. Configure the environment variables in the Vercel project settings.
4. Vercel will automatically build and deploy your app on every push!

### Manual CLI Deployment
If you prefer deploying directly via the command line:
```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Log in and deploy
vercel --prod
```

---

## 🐳 Deployment using Docker

If you prefer self-hosting using Docker:

1. Build and run the containers in detached mode:
   ```bash
   docker-compose up -d --build
   ```
2. The application will be running at `http://localhost:3000`.

---

## 🔑 Managing Administrative Credentials

We have provided a custom, secure credentials synchronization utility script:
```bash
npx tsx scripts/sync-admin-credentials.ts
```

### When to use this script:
* When you change the `DEFAULT_ADMIN_EMAIL` or `DEFAULT_ADMIN_PASSWORD` in your `.env` file and want to synchronize the database records to match.
* Run this command locally (ensure your `.env` points to the correct database url), and it will securely update or insert the credentials directly in your cloud PostgreSQL database.

---

## 📱 Progressive Web App (PWA) Configurations

Sema3ny is pre-configured as an installable Progressive Web App.

* **Manifest**: Located at `public/manifest.json`.
* **Service Worker**: Configured in `public/service-worker.js`.
* **Icons**: Production icons are saved in `public/` as:
  - `launchericon-192x192.png`
  - `launchericon-512x512.png`
  - `logo.png`
  - `nav-logo.png`
