import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// PUT /api/words/[id] - Update a word
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const wordId = parseInt(id)
    const { en, ar, part, category, order } = await request.json()

    if (isNaN(wordId)) {
      return NextResponse.json({ error: "Invalid word ID" }, { status: 400 })
    }

    if (!en || !ar || !part || !category) {
      return NextResponse.json(
        { error: "All fields (en, ar, part, category) are required" },
        { status: 400 }
      )
    }

    const updateData: {
      en: string
      ar: string
      part: string
      category: string
      order?: number
    } = { en, ar, part, category }
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
