import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { validateName, validateNoDuplicates } from "@/lib/validation"

// GET /api/levels - Get all study levels with full hierarchy
export async function GET() {
  try {
    const levels = await prisma.studyLevel.findMany({
      include: {
        units: {
          include: {
            lessons: {
              include: {
                words: {
                  orderBy: { order: "asc" },
                },
              },
              orderBy: { order: "asc" },
            },
          },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    })

    return NextResponse.json(levels)
  } catch (error) {
    console.error("Error fetching levels:", error)
    return NextResponse.json(
      { error: "Failed to fetch levels" },
      { status: 500 }
    )
  }
}

// POST /api/levels - Create a new study level
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name } = body

    // Validate input type
    if (typeof name !== "string") {
      return NextResponse.json(
        { error: "Name must be a string" },
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

    // Check for duplicate names
    const existingLevels = await prisma.studyLevel.findMany({
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
        { status: 409 } // 409 Conflict for duplicates
      )
    }

    // Get the max order and add 1 for the new level
    const maxOrderLevel = await prisma.studyLevel.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    })
    const nextOrder = (maxOrderLevel?.order ?? -1) + 1

    // Sanitize and create the level
    const level = await prisma.studyLevel.create({
      data: { name: name.trim(), order: nextOrder },
    })

    return NextResponse.json(level, { status: 201 })
  } catch (error) {
    console.error("Error creating level:", error)

    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON format" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to create level" },
      { status: 500 }
    )
  }
}
