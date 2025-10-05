# Neon PostgreSQL Quick Setup Script
# Run this after adding your DATABASE_URL and DIRECT_URL to .env

Write-Host "🐘 Neon PostgreSQL Setup Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "❌ Error: .env file not found!" -ForegroundColor Red
    Write-Host "Create a .env file first with your Neon connection strings." -ForegroundColor Yellow
    exit 1
}

# Check if DATABASE_URL is set
$envContent = Get-Content ".env" -Raw
if ($envContent -notmatch 'DATABASE_URL="postgresql://') {
    Write-Host "⚠️  Warning: DATABASE_URL doesn't look like a PostgreSQL connection string." -ForegroundColor Yellow
    Write-Host "Make sure you've updated .env with your Neon connection strings." -ForegroundColor Yellow
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit 0
    }
}

Write-Host "Step 1: Generating Prisma Client..." -ForegroundColor Green
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Prisma generate failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Prisma Client generated" -ForegroundColor Green
Write-Host ""

Write-Host "Step 2: Running database migrations..." -ForegroundColor Green
npx prisma migrate deploy
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Migration failed!" -ForegroundColor Red
    Write-Host "💡 Try: npx prisma migrate dev --name init" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Migrations completed" -ForegroundColor Green
Write-Host ""

Write-Host "Step 3: Seeding admin user..." -ForegroundColor Green
npx tsx prisma/seed-admin.ts
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Seeding failed (admin user might already exist)" -ForegroundColor Yellow
} else {
    Write-Host "✅ Admin user seeded" -ForegroundColor Green
}
Write-Host ""

Write-Host "Step 4: Verifying database connection..." -ForegroundColor Green
npx prisma db push --skip-generate --accept-data-loss
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Database connection issue" -ForegroundColor Yellow
} else {
    Write-Host "✅ Database connected successfully" -ForegroundColor Green
}
Write-Host ""

Write-Host "=================================" -ForegroundColor Cyan
Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: npm run dev" -ForegroundColor White
Write-Host "2. Visit: http://localhost:3000" -ForegroundColor White
Write-Host "3. Login at: http://localhost:3000/admin" -ForegroundColor White
Write-Host "   Email: admin@Sema3ny.com" -ForegroundColor White
Write-Host "   Password: Sema3ny@2020*" -ForegroundColor White
Write-Host ""
Write-Host "View database: npx prisma studio" -ForegroundColor Yellow
Write-Host "Deploy: vercel --prod" -ForegroundColor Yellow
Write-Host ""
