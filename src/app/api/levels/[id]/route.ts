import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// PUT /api/levels/[id] - Update a study level
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const levelId = parseInt(id)
    const { name, order } = await request.json()

    if (isNaN(levelId)) {
      return NextResponse.json({ error: "Invalid level ID" }, { status: 400 })
    }

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const updateData: { name: string; order?: number } = { name }
    if (typeof order === "number") {
      updateData.order = order
    }

    const level = await prisma.studyLevel.update({
      where: { id: levelId },
      data: updateData,
    })

    return NextResponse.json(level)
  } catch (error) {
    console.error("Error updating level:", error)
    if ((error as { code?: string })?.code === "P2025") {
      return NextResponse.json({ error: "Level not found" }, { status: 404 })
    }
    return NextResponse.json(
      { error: "Failed to update level" },
      { status: 500 }
    )
  }
}

// DELETE /api/levels/[id] - Delete a study level
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const levelId = parseInt(id)

    if (isNaN(levelId)) {
      return NextResponse.json({ error: "Invalid level ID" }, { status: 400 })
    }

    await prisma.studyLevel.delete({
      where: { id: levelId },
    })

    return NextResponse.json({ message: "Level deleted successfully" })
  } catch (error) {
    console.error("Error deleting level:", error)
    if ((error as { code?: string })?.code === "P2025") {
      return NextResponse.json({ error: "Level not found" }, { status: 404 })
    }
    return NextResponse.json(
      { error: "Failed to delete level" },
      { status: 500 }
    )
  }
}
