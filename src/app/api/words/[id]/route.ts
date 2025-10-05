import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { validateWord } from "@/lib/validation"

// PUT /api/words/[id] - Update a word
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const wordId = parseInt(id)

    if (isNaN(wordId)) {
      return NextResponse.json({ error: "Invalid word ID" }, { status: 400 })
    }

    const body = await request.json()
    const { en, ar, part, category, order } = body

    // Validate required fields
    if (!en || !ar || !part || !category) {
      return NextResponse.json(
        { error: "All fields (en, ar, part, category) are required" },
        { status: 400 }
      )
    }

    // Validate data types
    if (
      typeof en !== "string" ||
      typeof ar !== "string" ||
      typeof part !== "string" ||
      typeof category !== "string"
    ) {
      return NextResponse.json(
        { error: "All fields must be strings" },
        { status: 400 }
      )
    }

    // Validate word data using validation library
    const wordValidation = validateWord({
      en,
      ar,
      part,
      category,
    })

    if (!wordValidation.isValid) {
      return NextResponse.json(
        { error: wordValidation.error || "Invalid word data" },
        { status: 400 }
      )
    }

    // Validate order if provided
    if (order !== undefined && typeof order !== "number") {
      return NextResponse.json(
        { error: "Order must be a number" },
        { status: 400 }
      )
    }

    // Build update data with trimmed values
    const updateData: {
      en: string
      ar: string
      part: string
      category: string
      order?: number
    } = {
      en: en.trim(),
      ar: ar.trim(),
      part,
      category: category.trim(),
    }

    if (typeof order === "number") {
      updateData.order = order
    }

    const word = await prisma.word.update({
      where: { id: wordId },
      data: updateData,
    })

    return NextResponse.json(word)
  } catch (error) {
    console.error("Error updating word:", error)

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON format" },
        { status: 400 }
      )
    }

    if ((error as { code?: string })?.code === "P2025") {
      return NextResponse.json({ error: "Word not found" }, { status: 404 })
    }

    return NextResponse.json(
      { error: "Failed to update word" },
      { status: 500 }
    )
  }
}

// DELETE /api/words/[id] - Delete a word
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const wordId = parseInt(id)

    if (isNaN(wordId)) {
      return NextResponse.json({ error: "Invalid word ID" }, { status: 400 })
    }

    await prisma.word.delete({
      where: { id: wordId },
    })

    return NextResponse.json({ message: "Word deleted successfully" })
  } catch (error) {
    console.error("Error deleting word:", error)
    if ((error as { code?: string })?.code === "P2025") {
      return NextResponse.json({ error: "Word not found" }, { status: 404 })
    }
    return NextResponse.json(
      { error: "Failed to delete word" },
      { status: 500 }
    )
  }
}
