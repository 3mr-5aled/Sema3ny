/**
 * Production Database Seeding Script
 *
 * This script seeds the production database with:
 * 1. Admin user (if not exists)
 * 2. Optional: Sample data (if DATABASE_SEED_SAMPLE=true)
 *
 * Usage:
 *   npx tsx prisma/seed-production.ts
 *
 * Environment Variables Required:
 *   - DATABASE_URL
 *   - DEFAULT_ADMIN_EMAIL
 *   - DEFAULT_ADMIN_PASSWORD
 *   - DATABASE_SEED_SAMPLE (optional, default: false)
 */

import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting production database seeding...")

  // Check for required environment variables
  const adminEmail = process.env.DEFAULT_ADMIN_EMAIL
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD
  const seedSample = process.env.DATABASE_SEED_SAMPLE === "true"

  if (!adminEmail || !adminPassword) {
    throw new Error(
      "DEFAULT_ADMIN_EMAIL and DEFAULT_ADMIN_PASSWORD must be set"
    )
  }

  // 1. Create Admin User (if not exists)
  console.log("👤 Creating admin user...")

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  if (existingAdmin) {
    console.log(`✓ Admin user already exists: ${adminEmail}`)
  } else {
    const hashedPassword = await bcrypt.hash(adminPassword, 10)

    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: "Administrator",
      },
    })

    console.log(`✓ Admin user created: ${adminEmail}`)
  }

  // 2. Optional: Seed sample data
  if (seedSample) {
    console.log("📚 Seeding sample data...")

    // Check if data already exists
    const existingLevels = await prisma.studyLevel.count()

    if (existingLevels > 0) {
      console.log(`✓ Sample data already exists (${existingLevels} levels)`)
    } else {
      // Create one sample level with one unit and one lesson
      const level = await prisma.studyLevel.create({
        data: {
          name: "Sample Level",
          slug: "sample-level",
          order: 1,
          units: {
            create: {
              name: "Sample Unit",
              order: 1,
              lessons: {
                create: {
                  name: "Sample Lesson",
                  order: 1,
                  sections: JSON.stringify(["Key Words", "Additional Words"]),
                  words: {
                    create: [
                      {
                        en: "hello",
                        ar: "مرحبا",
                        part: "n",
                        category: "Key Words",
                        order: 1,
                      },
                      {
                        en: "world",
                        ar: "عالم",
                        part: "n",
                        category: "Key Words",
                        order: 2,
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      })

      console.log(`✓ Sample data created: ${level.name}`)
    }
  } else {
    console.log(
      "⏭️  Skipping sample data (set DATABASE_SEED_SAMPLE=true to enable)"
    )
  }

  console.log("✅ Production database seeding completed!")
}

main()
  .catch((e) => {
    console.error("❌ Error seeding production database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
