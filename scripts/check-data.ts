import { prisma } from "../src/lib/prisma"

async function checkData() {
  try {
    console.log("🔍 Checking database data...\n")

    const levels = await prisma.studyLevel.findMany({
      include: {
        units: {
          include: {
            lessons: {
              include: {
                words: true,
              },
            },
          },
        },
      },
    })

    console.log(`📊 Study Levels: ${levels.length}`)

    levels.forEach((level) => {
      console.log(`\n  Level ${level.id}: ${level.name}`)
      console.log(`    Units: ${level.units.length}`)
      level.units.forEach((unit) => {
        console.log(
          `      Unit ${unit.id}: ${unit.name} (${unit.lessons.length} lessons)`
        )
        unit.lessons.forEach((lesson) => {
          console.log(
            `        Lesson ${lesson.id}: ${lesson.name} (${lesson.words.length} words)`
          )
        })
      })
    })

    if (levels.length === 0) {
      console.log("\n⚠️  No data found in database!")
      console.log("💡 Run: npm run db:seed")
    }
  } catch (error) {
    console.error("❌ Error:", error)
  } finally {
    await prisma.$disconnect()
  }
}

checkData()
