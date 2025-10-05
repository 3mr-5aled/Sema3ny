import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { validateName, validateNoDuplicates } from "@/lib/validation"

// POST /api/lessons - Create a new lesson
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, unitId } = body

    // Validate required fields
    if (!name || !unitId) {
      return NextResponse.json(
        { error: "Name and unitId are required" },
        { status: 400 }
      )
    }

    // Validate types
    if (typeof name !== "string") {
      return NextResponse.json(
        { error: "Name must be a string" },
        { status: 400 }
      )
    }

    if (typeof unitId !== "number") {
      return NextResponse.json(
        { error: "unitId must be a number" },
        { status: 400 }
      )
    }

    // Validate name format
    const nameValidation = validateName(name)
    if (!nameValidation.isValid) {
      return NextResponse.json(
        { error: nameValidation.error || "Invalid name" },
        { status: 400 }
      )
    }

    // Verify unit exists and get existing lessons
    const unit = await prisma.unit.findUnique({
      where: { id: unitId },
      include: { lessons: { select: { name: true } } },
    })

    if (!unit) {
      return NextResponse.json({ error: "Unit not found" }, { status: 404 })
    }

    // Check for duplicate lesson names within this unit
    const existingNames = unit.lessons.map((lesson) => lesson.name)
    const duplicateValidation = validateNoDuplicates(
      name,
      existingNames,
      "lesson"
    )

    if (!duplicateValidation.isValid) {
      return NextResponse.json(
        { error: duplicateValidation.error || "Duplicate name" },
        { status: 409 }
      )
    }

    // Get the max order for lessons in this unit and add 1
    const maxOrderLesson = await prisma.lesson.findFirst({
      where: { unitId },
      orderBy: { order: "desc" },
      select: { order: true },
    })
    const nextOrder = (maxOrderLesson?.order ?? -1) + 1

    const lesson = await prisma.lesson.create({
      data: {
        name: name.trim(),
        unitId,
        order: nextOrder,
      },
    })

    return NextResponse.json(lesson, { status: 201 })
  } catch (error) {
    console.error("Error creating lesson:", error)

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON format" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to create lesson" },
      { status: 500 }
    )
  }
}
