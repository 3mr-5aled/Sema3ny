import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { validateName, validateNoDuplicates } from "@/lib/validation"

// PUT /api/lessons/[id] - Update a lesson
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const lessonId = parseInt(id)

    if (isNaN(lessonId)) {
      return NextResponse.json({ error: "Invalid lesson ID" }, { status: 400 })
    }

    const body = await request.json()
    const { name, order, sections } = body

    // Validate name if provided
    if (name !== undefined) {
      if (typeof name !== "string") {
        return NextResponse.json(
          { error: "Name must be a string" },
          { status: 400 }
        )
      }

      const nameValidation = validateName(name)
      if (!nameValidation.isValid) {
        return NextResponse.json(
          { error: nameValidation.error || "Invalid name" },
          { status: 400 }
        )
      }

      // Get the lesson with its unit to check for duplicates
      const currentLesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        select: { unitId: true },
      })

      if (!currentLesson) {
        return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
      }

      // Check for duplicate names in the same unit (excluding current lesson)
      const existingLessons = await prisma.lesson.findMany({
        where: {
          unitId: currentLesson.unitId,
          id: { not: lessonId },
        },
        select: { name: true },
      })

      const existingNames = existingLessons.map((lesson) => lesson.name)
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
    }

    // Validate order if provided
    if (order !== undefined && typeof order !== "number") {
      return NextResponse.json(
        { error: "Order must be a number" },
        { status: 400 }
      )
    }

    // Validate sections if provided (should be JSON string or array)
    if (sections !== undefined) {
      if (typeof sections === "string") {
        try {
          JSON.parse(sections)
        } catch {
          return NextResponse.json(
            { error: "Sections must be valid JSON" },
            { status: 400 }
          )
        }
      } else if (!Array.isArray(sections)) {
        return NextResponse.json(
          { error: "Sections must be a JSON string or array" },
          { status: 400 }
        )
      }
    }

    // Build update data
    const updateData: { name?: string; order?: number; sections?: string } = {}
    if (name !== undefined) {
      updateData.name = name.trim()
    }
    if (typeof order === "number") {
      updateData.order = order
    }
    if (sections !== undefined) {
      updateData.sections =
        typeof sections === "string" ? sections : JSON.stringify(sections)
    }

    const lesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: updateData,
    })

    return NextResponse.json(lesson)
  } catch (error) {
    console.error("Error updating lesson:", error)

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON format" },
        { status: 400 }
      )
    }

    if ((error as { code?: string })?.code === "P2025") {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
    }

    return NextResponse.json(
      { error: "Failed to update lesson" },
      { status: 500 }
    )
  }
}

// DELETE /api/lessons/[id] - Delete a lesson
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const lessonId = parseInt(id)

    if (isNaN(lessonId)) {
      return NextResponse.json({ error: "Invalid lesson ID" }, { status: 400 })
    }

    await prisma.lesson.delete({
      where: { id: lessonId },
    })

    return NextResponse.json({ message: "Lesson deleted successfully" })
  } catch (error) {
    console.error("Error deleting lesson:", error)
    if ((error as { code?: string })?.code === "P2025") {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
    }
    return NextResponse.json(
      { error: "Failed to delete lesson" },
      { status: 500 }
    )
  }
}
