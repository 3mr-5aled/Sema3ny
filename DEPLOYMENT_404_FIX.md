# Deployment Troubleshooting for 404 Errors

## Current Status
✅ Local database has data: Level 1 → Unit 1 → Lesson 1 (54 words)
✅ Build locally generates pages successfully
❌ Production shows 404 for `/levels/1`

## Root Causes & Solutions

### Issue 1: Vercel Environment Variables Not Set
The production database might be different from local, or environment variables aren't configured.

**Solution:**
1. Go to https://vercel.com/dashboard
2. Select your project "Sema3ny"
3. Go to **Settings** → **Environment Variables**
4. Verify these are set for **Production**:
   - `DATABASE_URL` (pooled connection)
   - `DIRECT_URL` (direct connection)
   - `AUTH_SECRET`
   - `AUTH_URL` (should be `https://sema3ny.vercel.app`)

### Issue 2: Production Database is Empty
If the production database (Neon) is empty, no pages will be generated.

**Solution - Seed Production Database:**
```bash
# Using Vercel CLI
vercel env pull .env.production.local
# This downloads production environment variables

# Then run the seed script with production env
npx tsx prisma/seed-admin.ts
```

**OR manually through Vercel:**
1. Go to Vercel Dashboard → Your Project
2. Go to **Deployments** → Latest deployment
3. Click **...** (three dots) → **Redeploy**
4. Check "Use existing Build Cache" is **OFF**
5. Click **Redeploy**

### Issue 3: Build Cache Issue
Vercel might be using cached build without the new Prisma queries.

**Solution - Force Fresh Build:**
1. Go to Vercel Dashboard → Your Project → Settings
2. Scroll to **Build & Development Settings**
3. Click **Edit** on Build Command
4. Add this temporarily: `rm -rf .next && npm run build`
5. Go to **Deployments** → **Redeploy** (without cache)
6. After successful deploy, revert the build command to just `npm run build`

### Issue 4: Prisma Client Not Generated in Production
The Prisma Client might not be generated properly in production.

**Solution:**
Check your `package.json` has the postinstall script:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

## Quick Fix (Try This First)

1. **Trigger a fresh deployment:**
   ```bash
   git commit --allow-empty -m "chore: Trigger fresh Vercel deployment"
   git push origin main
   ```

2. **Check Vercel Build Logs:**
   - Go to https://vercel.com/dashboard
   - Click on latest deployment
   - Check **Build Logs** for any errors
   - Look for "Generating static pages" - should show `/levels/1` being generated

3. **Verify Environment Variables:**
   - Ensure `DATABASE_URL` and `DIRECT_URL` are set in Vercel
   - Ensure `AUTH_URL` is set to `https://sema3ny.vercel.app`

## Testing
After redeployment, test these URLs:
- https://sema3ny.vercel.app/
- https://sema3ny.vercel.app/levels/1
- https://sema3ny.vercel.app/levels/1/units/1
- https://sema3ny.vercel.app/levels/1/units/1/lessons/1

## Service Worker Errors (Not Critical)
The errors you're seeing:
```
Failed to execute 'put' on 'Cache': Request scheme 'chrome-extension' is unsupported
```

These are caused by browser extensions and can be safely ignored. They don't affect functionality.
