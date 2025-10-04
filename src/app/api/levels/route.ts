import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

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
    const { name } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    // Get the max order and add 1 for the new level
    const maxOrderLevel = await prisma.studyLevel.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    })
    const nextOrder = (maxOrderLevel?.order ?? -1) + 1

    const level = await prisma.studyLevel.create({
      data: { name, order: nextOrder },
    })

    return NextResponse.json(level, { status: 201 })
  } catch (error) {
    console.error("Error creating level:", error)
    return NextResponse.json(
      { error: "Failed to create level" },
      { status: 500 }
    )
  }
}
