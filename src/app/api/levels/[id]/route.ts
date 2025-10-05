import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { validateName, validateNoDuplicates } from "@/lib/validation"

// PUT /api/levels/[id] - Update a study level
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const levelId = parseInt(id)

    if (isNaN(levelId)) {
      return NextResponse.json({ error: "Invalid level ID" }, { status: 400 })
    }

    const body = await request.json()
    const { name, order } = body

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

      // Check for duplicate names (excluding current level)
      const existingLevels = await prisma.studyLevel.findMany({
        where: { id: { not: levelId } },
        select: { name: true },
      })
      const existingNames = existingLevels.map((level) => level.name)
      const duplicateValidation = validateNoDuplicates(
        name,
        existingNames,
        "study level"
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

    // Build update data
    const updateData: { name?: string; order?: number } = {}
    if (name !== undefined) {
      updateData.name = name.trim()
    }
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

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON format" },
        { status: 400 }
      )
    }

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
