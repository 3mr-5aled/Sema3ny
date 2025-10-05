import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { validateName, validateNoDuplicates } from "@/lib/validation"

// PUT /api/units/[id] - Update a unit
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const unitId = parseInt(id)

    if (isNaN(unitId)) {
      return NextResponse.json({ error: "Invalid unit ID" }, { status: 400 })
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

      // Get the unit with its level to check for duplicates
      const currentUnit = await prisma.unit.findUnique({
        where: { id: unitId },
        select: { gradeId: true },
      })

      if (!currentUnit) {
        return NextResponse.json({ error: "Unit not found" }, { status: 404 })
      }

      // Check for duplicate names in the same level (excluding current unit)
      const existingUnits = await prisma.unit.findMany({
        where: {
          gradeId: currentUnit.gradeId,
          id: { not: unitId },
        },
        select: { name: true },
      })

      const existingNames = existingUnits.map((unit) => unit.name)
      const duplicateValidation = validateNoDuplicates(
        name,
        existingNames,
        "unit"
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

    const unit = await prisma.unit.update({
      where: { id: unitId },
      data: updateData,
    })

    return NextResponse.json(unit)
  } catch (error) {
    console.error("Error updating unit:", error)

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON format" },
        { status: 400 }
      )
    }

    if ((error as { code?: string })?.code === "P2025") {
      return NextResponse.json({ error: "Unit not found" }, { status: 404 })
    }

    return NextResponse.json(
      { error: "Failed to update unit" },
      { status: 500 }
    )
  }
}

// DELETE /api/units/[id] - Delete a unit
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const unitId = parseInt(id)

    if (isNaN(unitId)) {
      return NextResponse.json({ error: "Invalid unit ID" }, { status: 400 })
    }

    await prisma.unit.delete({
      where: { id: unitId },
    })

    return NextResponse.json({ message: "Unit deleted successfully" })
  } catch (error) {
    console.error("Error deleting unit:", error)
    if ((error as { code?: string })?.code === "P2025") {
      return NextResponse.json({ error: "Unit not found" }, { status: 404 })
    }
    return NextResponse.json(
      { error: "Failed to delete unit" },
      { status: 500 }
    )
  }
}
