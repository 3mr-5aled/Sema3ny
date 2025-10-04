import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

interface WordData {
  en: string
  ar: string
  part: string
}

interface WordsPayload {
  [sectionName: string]: WordData[]
}

// POST /api/lessons/[id]/words - Add words to a lesson
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const lessonId = parseInt(id)
    const payload: WordsPayload = await request.json()

    if (isNaN(lessonId)) {
      return NextResponse.json({ error: "Invalid lesson ID" }, { status: 400 })
    }

    // Verify lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    })

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
    }

    // Validate payload structure - must be an object with at least one section
    const sections = Object.keys(payload)
    if (sections.length === 0) {
      return NextResponse.json(
        {
          error: "At least one section with words must be provided",
        },
        { status: 400 }
      )
    }

    // Get existing sections from lesson
    let existingSections: string[] = []
    try {
      existingSections = lesson.sections ? JSON.parse(lesson.sections) : []
    } catch {
      existingSections = []
    }

    // Add new sections from payload if they don't exist
    const newSections = sections.filter((s) => !existingSections.includes(s))
    if (newSections.length > 0) {
      const updatedSections = [...existingSections, ...newSections]
      await prisma.lesson.update({
        where: { id: lessonId },
        data: { sections: JSON.stringify(updatedSections) },
      })
    }

    // Get the max order for words in this lesson to start numbering
    const maxOrderWord = await prisma.word.findFirst({
      where: { lessonId },
      orderBy: { order: "desc" },
      select: { order: true },
    })
    let nextOrder = (maxOrderWord?.order ?? -1) + 1

    const wordsToCreate = []

    // Process each section
    for (const sectionName of sections) {
      const words = payload[sectionName]

      if (!Array.isArray(words)) {
        return NextResponse.json(
          { error: `Section "${sectionName}" must be an array of words` },
          { status: 400 }
        )
      }

      for (const word of words) {
        if (!word.en || !word.ar || !word.part) {
          return NextResponse.json(
            { error: 'Each word must have "en", "ar", and "part" fields' },
            { status: 400 }
          )
        }
        wordsToCreate.push({
          en: word.en,
          ar: word.ar,
          part: word.part,
          category: sectionName,
          lessonId,
          order: nextOrder++,
        })
      }
    }

    // Bulk create words
    const createdWords = await prisma.word.createMany({
      data: wordsToCreate,
    })

    return NextResponse.json(
      {
        message: `Successfully added ${createdWords.count} words to lesson`,
        count: createdWords.count,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error adding words to lesson:", error)
    return NextResponse.json(
      { error: "Failed to add words to lesson" },
      { status: 500 }
    )
  }
}
