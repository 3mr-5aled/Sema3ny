/**
 * Pre-warm ISR Cache
 * This script visits all dynamic pages to populate Vercel's ISR cache
 */

const BASE_URL = "https://sema3ny.vercel.app"

async function prewarmPages() {
  console.log("🔥 Pre-warming ISR cache for all pages...\n")

  // Get all levels
  const levelsResponse = await fetch(`${BASE_URL}/api/levels`)
  const levels = await levelsResponse.json()

  console.log(`📊 Found ${levels.length} levels\n`)

  let totalPages = 0

  for (const level of levels) {
    console.log(`\n📖 Level ${level.id}: ${level.name}`)

    // Warm level page
    console.log(`  ⏳ Warming /levels/${level.id}...`)
    await fetch(`${BASE_URL}/levels/${level.id}`)
    totalPages++
    console.log(`  ✅ Done`)

    // Warm each unit
    for (const unit of level.units) {
      console.log(`    📦 Unit ${unit.id}: ${unit.name}`)
      console.log(`    ⏳ Warming /levels/${level.id}/units/${unit.id}...`)
      await fetch(`${BASE_URL}/levels/${level.id}/units/${unit.id}`)
      totalPages++
      console.log(`    ✅ Done`)

      // Warm each lesson
      for (const lesson of unit.lessons) {
        console.log(`      📝 Lesson ${lesson.id}: ${lesson.name}`)
        console.log(
          `      ⏳ Warming /levels/${level.id}/units/${unit.id}/lessons/${lesson.id}...`
        )
        await fetch(
          `${BASE_URL}/levels/${level.id}/units/${unit.id}/lessons/${lesson.id}`
        )
        totalPages++
        console.log(`      ✅ Done`)
      }
    }
  }

  console.log(`\n\n✨ Pre-warming complete!`)
  console.log(`🎉 Warmed ${totalPages} pages`)
  console.log(`⚡ All pages are now cached and will load instantly!`)
}

prewarmPages().catch(console.error)
