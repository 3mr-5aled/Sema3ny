import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// PUT /api/units/[id] - Update a unit
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const unitId = parseInt(id)
    const { name, order } = await request.json()

    if (isNaN(unitId)) {
      return NextResponse.json({ error: "Invalid unit ID" }, { status: 400 })
    }

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const updateData: { name: string; order?: number } = { name }
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
