import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { validateName, validateNoDuplicates } from "@/lib/validation"

// POST /api/units - Create a new unit
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, studyLevelId } = body

    // Validate required fields
    if (!name || !studyLevelId) {
      return NextResponse.json(
        { error: "Name and studyLevelId are required" },
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

    if (typeof studyLevelId !== "number") {
      return NextResponse.json(
        { error: "studyLevelId must be a number" },
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

    // Verify study level exists
    const studyLevel = await prisma.studyLevel.findUnique({
      where: { id: studyLevelId },
      include: { units: { select: { name: true } } },
    })

    if (!studyLevel) {
      return NextResponse.json(
        { error: "Study level not found" },
        { status: 404 }
      )
    }

    // Check for duplicate unit names within this level
    const existingNames = studyLevel.units.map((unit) => unit.name)
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

    // Get the max order for units in this level and add 1
    const maxOrderUnit = await prisma.unit.findFirst({
      where: { gradeId: studyLevelId },
      orderBy: { order: "desc" },
      select: { order: true },
    })
    const nextOrder = (maxOrderUnit?.order ?? -1) + 1

    const unit = await prisma.unit.create({
      data: {
        name: name.trim(),
        gradeId: studyLevelId,
        order: nextOrder,
      },
    })

    return NextResponse.json(unit, { status: 201 })
  } catch (error) {
    console.error("Error creating unit:", error)

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON format" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to create unit" },
      { status: 500 }
    )
  }
}
