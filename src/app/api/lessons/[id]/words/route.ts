import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

interface WordData {
  en: string
  ar: string
  part: string
}

interface WordsPayload {
  key?: WordData[]
  additional?: WordData[]
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

    // Validate payload structure
    if (!payload.key && !payload.additional) {
      return NextResponse.json(
        {
          error:
            'At least one of "key" or "additional" arrays must be provided',
        },
        { status: 400 }
      )
    }

    const wordsToCreate = []

    // Process key words
    if (payload.key && Array.isArray(payload.key)) {
      for (const word of payload.key) {
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
          category: "key",
          lessonId,
        })
      }
    }

    // Process additional words
    if (payload.additional && Array.isArray(payload.additional)) {
      for (const word of payload.additional) {
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
          category: "additional",
          lessonId,
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
