import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// POST /api/lessons - Create a new lesson
export async function POST(request: NextRequest) {
  try {
    const { name, unitId } = await request.json()

    if (!name || !unitId) {
      return NextResponse.json(
        { error: "Name and unitId are required" },
        { status: 400 }
      )
    }

    // Verify unit exists
    const unit = await prisma.unit.findUnique({
      where: { id: unitId },
    })

    if (!unit) {
      return NextResponse.json({ error: "Unit not found" }, { status: 404 })
    }

    const lesson = await prisma.lesson.create({
      data: {
        name,
        unitId,
      },
    })

    return NextResponse.json(lesson, { status: 201 })
  } catch (error) {
    console.error("Error creating lesson:", error)
    return NextResponse.json(
      { error: "Failed to create lesson" },
      { status: 500 }
    )
  }
}
