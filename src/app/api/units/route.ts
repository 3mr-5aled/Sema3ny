import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// POST /api/units - Create a new unit
export async function POST(request: NextRequest) {
  try {
    const { name, studyLevelId } = await request.json()

    if (!name || !studyLevelId) {
      return NextResponse.json(
        { error: "Name and studyLevelId are required" },
        { status: 400 }
      )
    }

    // Verify study level exists
    const studyLevel = await prisma.studyLevel.findUnique({
      where: { id: studyLevelId },
    })

    if (!studyLevel) {
      return NextResponse.json(
        { error: "Study level not found" },
        { status: 404 }
      )
    }

    const unit = await prisma.unit.create({
      data: {
        name,
        studyLevelId,
      },
    })

    return NextResponse.json(unit, { status: 201 })
  } catch (error) {
    console.error("Error creating unit:", error)
    return NextResponse.json(
      { error: "Failed to create unit" },
      { status: 500 }
    )
  }
}
