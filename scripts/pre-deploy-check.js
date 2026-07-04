#!/usr/bin/env node

/**
 * Pre-Deployment Checklist Script
 *
 * Run this before deploying to production to catch common issues
 *
 * Usage: node scripts/pre-deploy-check.js
 */

const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

console.log("🔍 Running Pre-Deployment Checklist...\n")

let errors = 0
let warnings = 0

// Helper functions
function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description}`)
    return true
  } else {
    console.log(`❌ ${description} - MISSING`)
    errors++
    return false
  }
}

function checkCommand(command, description) {
  try {
    execSync(command, { stdio: "pipe" })
    console.log(`✅ ${description}`)
    return true
  } catch (error) {
    console.log(`❌ ${description} - FAILED`)
    errors++
    return false
  }
}

function warn(message) {
  console.log(`⚠️  ${message}`)
  warnings++
}

// 1. Check required files
console.log("📁 Checking required files...")
checkFile("package.json", "package.json exists")
checkFile("prisma/schema.prisma", "Prisma schema exists")
checkFile("next.config.ts", "Next.js config exists")
checkFile(".gitignore", ".gitignore exists")
console.log("")

// 2. Check PWA files
console.log("📱 Checking PWA files...")
checkFile("public/manifest.json", "PWA manifest exists")
checkFile("public/service-worker.js", "Service worker exists")

if (!fs.existsSync("public/icon-192x192.png")) {
  warn("Icon 192x192 missing - PWA will use fallback")
}
if (!fs.existsSync("public/icon-512x512.png")) {
  warn("Icon 512x512 missing - PWA will use fallback")
}
console.log("")

// 3. Check deployment configs
console.log("⚙️  Checking deployment configurations...")
checkFile("vercel.json", "Vercel config exists")
checkFile("Dockerfile", "Docker config exists")
checkFile("docker-compose.yml", "Docker Compose config exists")
checkFile(".env.production.example", "Production env example exists")
console.log("")

// 4. Check environment variables
console.log("🔐 Checking environment setup...")
if (!fs.existsSync(".env")) {
  warn(".env file missing - using defaults")
} else {
  const envContent = fs.readFileSync(".env", "utf8")

  if (envContent.includes("vocabguide-super-secret-key")) {
    warn("Default AUTH_SECRET detected - change in production!")
  }

  if (envContent.includes("ChangeMe123!")) {
    warn("Default admin password detected - change in production!")
  }

  if (envContent.includes("localhost")) {
    console.log("ℹ️  Using localhost URLs (OK for development)")
  }
}
console.log("")

// 5. Check dependencies
console.log("📦 Checking dependencies...")
checkCommand(
  "npm list --depth=0",
  "All dependencies installed"
)
console.log("")

// 6. Run linting
console.log("🧹 Running linter...")
try {
  execSync("npm run lint", { stdio: "pipe" })
  console.log("✅ Linting passed")
} catch (error) {
  warn("Linting found issues (review before deploying)")
}
console.log("")

// 7. Try building
console.log("🏗️  Testing build...")
try {
  console.log("   Building application (this may take a minute)...")
  execSync("npm run build", { stdio: "pipe" })
  console.log("✅ Build succeeded")
} catch (error) {
  console.log("❌ Build failed - fix errors before deploying")
  console.log("\nBuild error:")
  console.log(error.stdout?.toString() || error.message)
  errors++
}
console.log("")

// 8. Check documentation
console.log("📚 Checking documentation...")
checkFile("README.md", "README exists")
checkFile("DEPLOYMENT_GUIDE.md", "Deployment guide exists")
checkFile("QUICK_DEPLOY.md", "Quick deploy guide exists")
console.log("")

// 9. Summary
console.log("═══════════════════════════════════════")
console.log("📊 SUMMARY")
console.log("═══════════════════════════════════════")

if (errors === 0 && warnings === 0) {
  console.log("✅ All checks passed! Ready to deploy! 🚀")
  console.log("\nNext steps:")
  console.log("  1. Generate icons (if missing): see ICON_TODO.md")
  console.log("  2. Review .env.production.example")
  console.log("  3. Run: vercel --prod")
  process.exit(0)
} else {
  console.log(`❌ Found ${errors} error(s) and ${warnings} warning(s)`)

  if (errors > 0) {
    console.log("\n⚠️  Fix errors before deploying!")
    process.exit(1)
  } else {
    console.log("\n⚠️  Review warnings, but deployment is possible")
    console.log("\nNext steps:")
    console.log("  1. Generate icons: see ICON_TODO.md")
    console.log("  2. Change default passwords")
    console.log("  3. Run: vercel --prod")
    process.exit(0)
  }
}
