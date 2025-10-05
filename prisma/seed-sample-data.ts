import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding sample vocabulary data...")

  try {
    // Create Study Level: Grade 1
    const grade1 = await prisma.studyLevel.upsert({
      where: { slug: "grade-1" },
      update: {},
      create: {
        name: "Grade 1",
        slug: "grade-1",
        order: 1,
      },
    })
    console.log("✅ Created Grade 1")

    // Unit 1: Family & Friends
    const unit1 = await prisma.unit.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: "Family & Friends",
        order: 1,
        gradeId: grade1.id,
      },
    })
    console.log("✅ Created Unit: Family & Friends")

    // Lesson 1: Family Members
    const lesson1 = await prisma.lesson.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: "Family Members",
        order: 1,
        sections: JSON.stringify(["Key Vocabulary", "Additional Words"]),
        unitId: unit1.id,
      },
    })
    console.log("✅ Created Lesson: Family Members")

    // Words for Lesson 1
    const lesson1Words = [
      // Key Vocabulary
      { en: "Father", ar: "أب", part: "Noun", category: "key", order: 1 },
      { en: "Mother", ar: "أم", part: "Noun", category: "key", order: 2 },
      { en: "Brother", ar: "أخ", part: "Noun", category: "key", order: 3 },
      { en: "Sister", ar: "أخت", part: "Noun", category: "key", order: 4 },
      { en: "Grandfather", ar: "جد", part: "Noun", category: "key", order: 5 },
      { en: "Grandmother", ar: "جدة", part: "Noun", category: "key", order: 6 },
      { en: "Uncle", ar: "عم / خال", part: "Noun", category: "key", order: 7 },
      { en: "Aunt", ar: "عمة / خالة", part: "Noun", category: "key", order: 8 },
      // Additional Words
      {
        en: "Family",
        ar: "عائلة",
        part: "Noun",
        category: "additional",
        order: 9,
      },
      {
        en: "Parents",
        ar: "والدان",
        part: "Noun",
        category: "additional",
        order: 10,
      },
      { en: "Son", ar: "ابن", part: "Noun", category: "additional", order: 11 },
      {
        en: "Daughter",
        ar: "ابنة",
        part: "Noun",
        category: "additional",
        order: 12,
      },
      {
        en: "Cousin",
        ar: "ابن عم / ابن خال",
        part: "Noun",
        category: "additional",
        order: 13,
      },
    ]

    for (const word of lesson1Words) {
      await prisma.word.create({
        data: {
          ...word,
          lessonId: lesson1.id,
        },
      })
    }
    console.log(`✅ Added ${lesson1Words.length} words to Family Members`)

    // Lesson 2: Greetings
    const lesson2 = await prisma.lesson.upsert({
      where: { id: 2 },
      update: {},
      create: {
        name: "Greetings & Expressions",
        order: 2,
        sections: JSON.stringify(["Key Vocabulary", "Additional Words"]),
        unitId: unit1.id,
      },
    })
    console.log("✅ Created Lesson: Greetings & Expressions")

    const lesson2Words = [
      // Key Vocabulary
      {
        en: "Hello",
        ar: "مرحبا",
        part: "Expression",
        category: "key",
        order: 1,
      },
      {
        en: "Good morning",
        ar: "صباح الخير",
        part: "Expression",
        category: "key",
        order: 2,
      },
      {
        en: "Good evening",
        ar: "مساء الخير",
        part: "Expression",
        category: "key",
        order: 3,
      },
      {
        en: "Good night",
        ar: "تصبح على خير",
        part: "Expression",
        category: "key",
        order: 4,
      },
      {
        en: "Goodbye",
        ar: "مع السلامة",
        part: "Expression",
        category: "key",
        order: 5,
      },
      {
        en: "Please",
        ar: "من فضلك",
        part: "Expression",
        category: "key",
        order: 6,
      },
      {
        en: "Thank you",
        ar: "شكرا لك",
        part: "Expression",
        category: "key",
        order: 7,
      },
      {
        en: "You're welcome",
        ar: "على الرحب والسعة",
        part: "Expression",
        category: "key",
        order: 8,
      },
      // Additional Words
      {
        en: "Sorry",
        ar: "آسف",
        part: "Expression",
        category: "additional",
        order: 9,
      },
      {
        en: "Excuse me",
        ar: "عفوا",
        part: "Expression",
        category: "additional",
        order: 10,
      },
      {
        en: "How are you?",
        ar: "كيف حالك؟",
        part: "Expression",
        category: "additional",
        order: 11,
      },
      {
        en: "I'm fine",
        ar: "أنا بخير",
        part: "Expression",
        category: "additional",
        order: 12,
      },
      {
        en: "See you later",
        ar: "أراك لاحقا",
        part: "Expression",
        category: "additional",
        order: 13,
      },
    ]

    for (const word of lesson2Words) {
      await prisma.word.create({
        data: {
          ...word,
          lessonId: lesson2.id,
        },
      })
    }
    console.log(
      `✅ Added ${lesson2Words.length} words to Greetings & Expressions`
    )

    // Unit 2: School & Education
    const unit2 = await prisma.unit.upsert({
      where: { id: 2 },
      update: {},
      create: {
        name: "School & Education",
        order: 2,
        gradeId: grade1.id,
      },
    })
    console.log("✅ Created Unit: School & Education")

    // Lesson 3: Classroom Objects
    const lesson3 = await prisma.lesson.upsert({
      where: { id: 3 },
      update: {},
      create: {
        name: "Classroom Objects",
        order: 1,
        sections: JSON.stringify(["Key Vocabulary", "Additional Words"]),
        unitId: unit2.id,
      },
    })
    console.log("✅ Created Lesson: Classroom Objects")

    const lesson3Words = [
      // Key Vocabulary
      { en: "Book", ar: "كتاب", part: "Noun", category: "key", order: 1 },
      { en: "Pen", ar: "قلم حبر", part: "Noun", category: "key", order: 2 },
      { en: "Pencil", ar: "قلم رصاص", part: "Noun", category: "key", order: 3 },
      { en: "Eraser", ar: "ممحاة", part: "Noun", category: "key", order: 4 },
      { en: "Ruler", ar: "مسطرة", part: "Noun", category: "key", order: 5 },
      { en: "Desk", ar: "مكتب", part: "Noun", category: "key", order: 6 },
      { en: "Chair", ar: "كرسي", part: "Noun", category: "key", order: 7 },
      {
        en: "Blackboard",
        ar: "سبورة",
        part: "Noun",
        category: "key",
        order: 8,
      },
      // Additional Words
      {
        en: "Notebook",
        ar: "دفتر",
        part: "Noun",
        category: "additional",
        order: 9,
      },
      {
        en: "Bag",
        ar: "حقيبة",
        part: "Noun",
        category: "additional",
        order: 10,
      },
      {
        en: "Scissors",
        ar: "مقص",
        part: "Noun",
        category: "additional",
        order: 11,
      },
      {
        en: "Glue",
        ar: "صمغ",
        part: "Noun",
        category: "additional",
        order: 12,
      },
      {
        en: "Crayon",
        ar: "قلم تلوين شمعي",
        part: "Noun",
        category: "additional",
        order: 13,
      },
    ]

    for (const word of lesson3Words) {
      await prisma.word.create({
        data: {
          ...word,
          lessonId: lesson3.id,
        },
      })
    }
    console.log(`✅ Added ${lesson3Words.length} words to Classroom Objects`)

    // Unit 3: Colors & Numbers
    const unit3 = await prisma.unit.upsert({
      where: { id: 3 },
      update: {},
      create: {
        name: "Colors & Numbers",
        order: 3,
        gradeId: grade1.id,
      },
    })
    console.log("✅ Created Unit: Colors & Numbers")

    // Lesson 4: Colors
    const lesson4 = await prisma.lesson.upsert({
      where: { id: 4 },
      update: {},
      create: {
        name: "Colors",
        order: 1,
        sections: JSON.stringify(["Key Vocabulary", "Additional Words"]),
        unitId: unit3.id,
      },
    })
    console.log("✅ Created Lesson: Colors")

    const lesson4Words = [
      // Key Vocabulary
      { en: "Red", ar: "أحمر", part: "Adjective", category: "key", order: 1 },
      { en: "Blue", ar: "أزرق", part: "Adjective", category: "key", order: 2 },
      {
        en: "Yellow",
        ar: "أصفر",
        part: "Adjective",
        category: "key",
        order: 3,
      },
      { en: "Green", ar: "أخضر", part: "Adjective", category: "key", order: 4 },
      { en: "Black", ar: "أسود", part: "Adjective", category: "key", order: 5 },
      { en: "White", ar: "أبيض", part: "Adjective", category: "key", order: 6 },
      {
        en: "Orange",
        ar: "برتقالي",
        part: "Adjective",
        category: "key",
        order: 7,
      },
      {
        en: "Purple",
        ar: "بنفسجي",
        part: "Adjective",
        category: "key",
        order: 8,
      },
      // Additional Words
      {
        en: "Pink",
        ar: "وردي",
        part: "Adjective",
        category: "additional",
        order: 9,
      },
      {
        en: "Brown",
        ar: "بني",
        part: "Adjective",
        category: "additional",
        order: 10,
      },
      {
        en: "Gray",
        ar: "رمادي",
        part: "Adjective",
        category: "additional",
        order: 11,
      },
      {
        en: "Gold",
        ar: "ذهبي",
        part: "Adjective",
        category: "additional",
        order: 12,
      },
      {
        en: "Silver",
        ar: "فضي",
        part: "Adjective",
        category: "additional",
        order: 13,
      },
    ]

    for (const word of lesson4Words) {
      await prisma.word.create({
        data: {
          ...word,
          lessonId: lesson4.id,
        },
      })
    }
    console.log(`✅ Added ${lesson4Words.length} words to Colors`)

    // Lesson 5: Numbers 1-20
    const lesson5 = await prisma.lesson.upsert({
      where: { id: 5 },
      update: {},
      create: {
        name: "Numbers 1-20",
        order: 2,
        sections: JSON.stringify(["Key Vocabulary", "Additional Words"]),
        unitId: unit3.id,
      },
    })
    console.log("✅ Created Lesson: Numbers 1-20")

    const lesson5Words = [
      // Key Vocabulary (1-10)
      { en: "One", ar: "واحد", part: "Number", category: "key", order: 1 },
      { en: "Two", ar: "اثنان", part: "Number", category: "key", order: 2 },
      { en: "Three", ar: "ثلاثة", part: "Number", category: "key", order: 3 },
      { en: "Four", ar: "أربعة", part: "Number", category: "key", order: 4 },
      { en: "Five", ar: "خمسة", part: "Number", category: "key", order: 5 },
      { en: "Six", ar: "ستة", part: "Number", category: "key", order: 6 },
      { en: "Seven", ar: "سبعة", part: "Number", category: "key", order: 7 },
      { en: "Eight", ar: "ثمانية", part: "Number", category: "key", order: 8 },
      { en: "Nine", ar: "تسعة", part: "Number", category: "key", order: 9 },
      { en: "Ten", ar: "عشرة", part: "Number", category: "key", order: 10 },
      // Additional Words (11-20)
      {
        en: "Eleven",
        ar: "أحد عشر",
        part: "Number",
        category: "additional",
        order: 11,
      },
      {
        en: "Twelve",
        ar: "اثنا عشر",
        part: "Number",
        category: "additional",
        order: 12,
      },
      {
        en: "Thirteen",
        ar: "ثلاثة عشر",
        part: "Number",
        category: "additional",
        order: 13,
      },
      {
        en: "Fourteen",
        ar: "أربعة عشر",
        part: "Number",
        category: "additional",
        order: 14,
      },
      {
        en: "Fifteen",
        ar: "خمسة عشر",
        part: "Number",
        category: "additional",
        order: 15,
      },
      {
        en: "Sixteen",
        ar: "ستة عشر",
        part: "Number",
        category: "additional",
        order: 16,
      },
      {
        en: "Seventeen",
        ar: "سبعة عشر",
        part: "Number",
        category: "additional",
        order: 17,
      },
      {
        en: "Eighteen",
        ar: "ثمانية عشر",
        part: "Number",
        category: "additional",
        order: 18,
      },
      {
        en: "Nineteen",
        ar: "تسعة عشر",
        part: "Number",
        category: "additional",
        order: 19,
      },
      {
        en: "Twenty",
        ar: "عشرون",
        part: "Number",
        category: "additional",
        order: 20,
      },
    ]

    for (const word of lesson5Words) {
      await prisma.word.create({
        data: {
          ...word,
          lessonId: lesson5.id,
        },
      })
    }
    console.log(`✅ Added ${lesson5Words.length} words to Numbers 1-20`)

    // Create Study Level: Grade 2
    const grade2 = await prisma.studyLevel.upsert({
      where: { slug: "grade-2" },
      update: {},
      create: {
        name: "Grade 2",
        slug: "grade-2",
        order: 2,
      },
    })
    console.log("✅ Created Grade 2")

    // Unit 4: Animals
    const unit4 = await prisma.unit.upsert({
      where: { id: 4 },
      update: {},
      create: {
        name: "Animals",
        order: 1,
        gradeId: grade2.id,
      },
    })
    console.log("✅ Created Unit: Animals")

    // Lesson 6: Farm Animals
    const lesson6 = await prisma.lesson.upsert({
      where: { id: 6 },
      update: {},
      create: {
        name: "Farm Animals",
        order: 1,
        sections: JSON.stringify(["Key Vocabulary", "Additional Words"]),
        unitId: unit4.id,
      },
    })
    console.log("✅ Created Lesson: Farm Animals")

    const lesson6Words = [
      // Key Vocabulary
      { en: "Cow", ar: "بقرة", part: "Noun", category: "key", order: 1 },
      { en: "Horse", ar: "حصان", part: "Noun", category: "key", order: 2 },
      { en: "Sheep", ar: "خروف", part: "Noun", category: "key", order: 3 },
      { en: "Goat", ar: "ماعز", part: "Noun", category: "key", order: 4 },
      { en: "Chicken", ar: "دجاجة", part: "Noun", category: "key", order: 5 },
      { en: "Duck", ar: "بطة", part: "Noun", category: "key", order: 6 },
      { en: "Pig", ar: "خنزير", part: "Noun", category: "key", order: 7 },
      { en: "Dog", ar: "كلب", part: "Noun", category: "key", order: 8 },
      // Additional Words
      { en: "Cat", ar: "قطة", part: "Noun", category: "additional", order: 9 },
      {
        en: "Rabbit",
        ar: "أرنب",
        part: "Noun",
        category: "additional",
        order: 10,
      },
      {
        en: "Donkey",
        ar: "حمار",
        part: "Noun",
        category: "additional",
        order: 11,
      },
      {
        en: "Turkey",
        ar: "ديك رومي",
        part: "Noun",
        category: "additional",
        order: 12,
      },
      {
        en: "Rooster",
        ar: "ديك",
        part: "Noun",
        category: "additional",
        order: 13,
      },
    ]

    for (const word of lesson6Words) {
      await prisma.word.create({
        data: {
          ...word,
          lessonId: lesson6.id,
        },
      })
    }
    console.log(`✅ Added ${lesson6Words.length} words to Farm Animals`)

    console.log("\n🎉 Sample data seeding completed!")
    console.log("\n📊 Summary:")
    console.log("   - 2 Study Levels (Grade 1, Grade 2)")
    console.log("   - 4 Units")
    console.log("   - 6 Lessons")
    console.log("   - 91 Vocabulary Words")
    console.log("\n✅ You can now test the application with realistic data!")
  } catch (error) {
    console.error("❌ Error seeding data:", error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
