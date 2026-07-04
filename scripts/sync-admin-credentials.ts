import fs from "fs"
import path from "path"
import bcrypt from "bcryptjs"

// Manual simple .env parser to load env variables in standard tsx execution
function loadEnv() {
  try {
    const envPath = path.resolve(process.cwd(), ".env")
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8")
      content.split("\n").forEach((line) => {
        const trimmed = line.trim()
        if (trimmed && !trimmed.startsWith("#")) {
          const firstEqual = trimmed.indexOf("=")
          if (firstEqual !== -1) {
            const key = trimmed.substring(0, firstEqual).trim()
            let val = trimmed.substring(firstEqual + 1).trim()
            // remove surrounding quotes
            if (val.startsWith('"') && val.endsWith('"')) {
              val = val.substring(1, val.length - 1)
            } else if (val.startsWith("'") && val.endsWith("'")) {
              val = val.substring(1, val.length - 1)
            }
            process.env[key] = val
          }
        }
      })
    }
  } catch (err) {
    console.error("Failed to load .env file:", err)
  }
}

async function syncAdmin() {
  loadEnv()
  
  const email = process.env.DEFAULT_ADMIN_EMAIL
  const password = process.env.DEFAULT_ADMIN_PASSWORD
  
  if (!email || !password) {
    console.error("❌ Error: DEFAULT_ADMIN_EMAIL or DEFAULT_ADMIN_PASSWORD is not defined in .env")
    process.exit(1)
  }
  
  console.log(`🌐 Target admin credentials from .env:`)
  console.log(`📧 Email: ${email}`)
  console.log(`🔑 Password: ${password}\n`)
  
  // Dynamically import prisma so that process.env.DATABASE_URL is populated before initialization!
  const { prisma } = await import("../src/lib/prisma")
  
  try {
    // 1. Check if there is an existing user with this EXACT email
    const existingByEmail = await prisma.user.findUnique({
      where: { email },
    })
    
    const hashedPassword = await bcrypt.hash(password, 10)
    
    if (existingByEmail) {
      console.log(`🔍 User with email "${email}" already exists. Updating password...`)
      await prisma.user.update({
        where: { id: existingByEmail.id },
        data: {
          password: hashedPassword,
          role: "admin", // Ensure role is admin
        }
      })
      console.log(`✅ Password successfully updated in database for ${email}!`)
    } else {
      // 2. No user with this email. Check if there are ANY users in the database
      const allUsers = await prisma.user.findMany()
      
      if (allUsers.length > 0) {
        // If there's an admin/teacher already, update their credentials to match .env
        const targetUser = allUsers.find(u => u.role === "admin") || allUsers[0]
        
        console.log(`🔍 Found existing user ${targetUser.email} (ID: ${targetUser.id}). Updating their credentials...`)
        await prisma.user.update({
          where: { id: targetUser.id },
          data: {
            email,
            password: hashedPassword,
            role: "admin",
          }
        })
        console.log(`✅ Successfully updated existing user from ${targetUser.email} to ${email} with the new password!`)
      } else {
        // 3. No users exist at all. Create a new admin user
        console.log(`🔍 No users found in the database. Creating new admin user...`)
        await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            name: "Administrator",
            role: "admin",
          }
        })
        console.log(`✅ Successfully created new admin user ${email}!`)
      }
    }
  } catch (error) {
    console.error("❌ Error syncing admin credentials:", error)
  } finally {
    await prisma.$disconnect()
  }
}

syncAdmin()
