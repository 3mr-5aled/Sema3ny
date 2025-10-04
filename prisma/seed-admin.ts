import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding admin user...")

  const email = process.env.DEFAULT_ADMIN_EMAIL || "admin@vocabguide.com"
  const password = process.env.DEFAULT_ADMIN_PASSWORD || "ChangeMe123!"

  // Check if admin user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    console.log("⚠️  Admin user already exists:", email)
    return
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email,
      name: "Administrator",
      password: hashedPassword,
      role: "admin",
    },
  })

  console.log("✅ Admin user created successfully!")
  console.log("📧 Email:", admin.email)
  console.log("🔑 Password:", password)
  console.log("⚠️  IMPORTANT: Change this password after first login!")
}

main()
  .catch((e) => {
    console.error("❌ Error seeding admin user:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
