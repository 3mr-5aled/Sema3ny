import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function resetSequences() {
  try {
    console.log("🔄 Resetting database sequences...")

    // Reset StudyLevel (grades) sequence
    await prisma.$executeRaw`
      SELECT setval(pg_get_serial_sequence('grades', 'id'), 1, false);
    `
    console.log("✅ Reset grades sequence to 1")

    // Reset Unit sequence
    await prisma.$executeRaw`
      SELECT setval(pg_get_serial_sequence('units', 'id'), 1, false);
    `
    console.log("✅ Reset units sequence to 1")

    // Reset Lesson sequence
    await prisma.$executeRaw`
      SELECT setval(pg_get_serial_sequence('lessons', 'id'), 1, false);
    `
    console.log("✅ Reset lessons sequence to 1")

    // Reset Word sequence
    await prisma.$executeRaw`
      SELECT setval(pg_get_serial_sequence('words', 'id'), 1, false);
    `
    console.log("✅ Reset words sequence to 1")

    console.log("🎉 All sequences reset successfully!")
  } catch (error) {
    console.error("❌ Error resetting sequences:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

resetSequences()
