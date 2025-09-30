import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Create study levels
  const beginner = await prisma.studyLevel.create({
    data: {
      name: "Beginner Level",
      units: {
        create: [
          {
            name: "Unit 1: Basic Vocabulary",
            lessons: {
              create: [
                {
                  name: "Lesson 1: Greetings & Introductions",
                  words: {
                    create: [
                      {
                        en: "hello",
                        ar: "مرحبا",
                        part: "n",
                        category: "key",
                      },
                      {
                        en: "goodbye",
                        ar: "وداعا",
                        part: "n",
                        category: "key",
                      },
                      {
                        en: "please",
                        ar: "من فضلك",
                        part: "adv",
                        category: "key",
                      },
                      {
                        en: "thank you",
                        ar: "شكرا لك",
                        part: "n",
                        category: "key",
                      },
                      {
                        en: "excuse me",
                        ar: "عذرا",
                        part: "n",
                        category: "additional",
                      },
                    ],
                  },
                },
                {
                  name: "Lesson 2: Family Members",
                  words: {
                    create: [
                      {
                        en: "mother",
                        ar: "أم",
                        part: "n",
                        category: "key",
                      },
                      {
                        en: "father",
                        ar: "أب",
                        part: "n",
                        category: "key",
                      },
                      {
                        en: "brother",
                        ar: "أخ",
                        part: "n",
                        category: "key",
                      },
                      {
                        en: "sister",
                        ar: "أخت",
                        part: "n",
                        category: "key",
                      },
                      {
                        en: "family",
                        ar: "عائلة",
                        part: "n",
                        category: "additional",
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  })

  const intermediate = await prisma.studyLevel.create({
    data: {
      name: "Intermediate Level",
      units: {
        create: [
          {
            name: "Unit 1: Daily Activities",
            lessons: {
              create: [
                {
                  name: "Lesson 1: Work & Business",
                  words: {
                    create: [
                      {
                        en: "meeting",
                        ar: "اجتماع",
                        part: "n",
                        category: "key",
                      },
                      {
                        en: "schedule",
                        ar: "جدول زمني",
                        part: "n",
                        category: "key",
                      },
                      {
                        en: "deadline",
                        ar: "موعد نهائي",
                        part: "n",
                        category: "key",
                      },
                      {
                        en: "presentation",
                        ar: "عرض تقديمي",
                        part: "n",
                        category: "additional",
                      },
                      {
                        en: "colleague",
                        ar: "زميل",
                        part: "n",
                        category: "additional",
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  })

  console.log("✅ Database seeded successfully!")
  console.log(`Created study levels:`)
  console.log(`- ${beginner.name}`)
  console.log(`- ${intermediate.name}`)
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
