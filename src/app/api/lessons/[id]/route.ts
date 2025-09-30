import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// PUT /api/lessons/[id] - Update a lesson
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const lessonId = parseInt(id)
    const { name } = await request.json()

    if (isNaN(lessonId)) {
      return NextResponse.json({ error: "Invalid lesson ID" }, { status: 400 })
    }

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const lesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: { name },
    })

    return NextResponse.json(lesson)
  } catch (error) {
    console.error("Error updating lesson:", error)
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
