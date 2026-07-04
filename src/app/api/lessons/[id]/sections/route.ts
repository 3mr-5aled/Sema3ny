import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Add a new section to a lesson
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const lessonId = parseInt(id)
    const { sectionName } = await request.json()

    if (!sectionName || typeof sectionName !== "string") {
      return NextResponse.json(
        { error: "Section name is required" },
        { status: 400 }
      )
    }

    // Get the current lesson
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { sections: true },
    })

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
    }

    // Get current sections or default ones
    const currentSections = lesson.sections
      ? JSON.parse(lesson.sections)
      : ["Key Words", "Additional Words"]

    // Check if section already exists
    if (currentSections.includes(sectionName.trim())) {
      return NextResponse.json(
        { error: "Section already exists" },
        { status: 400 }
      )
    }

    // Add the new section
    const newSections = [...currentSections, sectionName.trim()]

    // Update the lesson with new sections
    await prisma.lesson.update({
      where: { id: lessonId },
      data: { sections: JSON.stringify(newSections) },
    })

    return NextResponse.json({ success: true, sections: newSections })
  } catch (error) {
    console.error("Error adding section:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Remove a section from a lesson
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const lessonId = parseInt(id)
    const { sectionName } = await request.json()

    if (!sectionName || typeof sectionName !== "string") {
      return NextResponse.json(
        { error: "Section name is required" },
        { status: 400 }
      )
    }

    // Get the current lesson with words
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { words: true },
    })

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
    }

    // Get current sections or default ones
    const currentSections = lesson.sections
      ? JSON.parse(lesson.sections)
      : ["Key Words", "Additional Words"]

    // Can't remove if only one section left
    if (currentSections.length <= 1) {
      return NextResponse.json(
        { error: "Cannot remove the last section" },
        { status: 400 }
      )
    }

    // Check if section exists
    if (!currentSections.includes(sectionName)) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 })
    }

    // Remove the section
    const newSections = currentSections.filter((s: string) => s !== sectionName)

    // Move all words from the removed section to the first remaining section
    const firstRemainingSection = newSections[0]
    const wordsToUpdate = lesson.words.filter(
      (word) => word.category === sectionName
    )

    // Update words in a transaction
    await prisma.$transaction(async (tx) => {
      // Update lesson sections
      await tx.lesson.update({
        where: { id: lessonId },
        data: { sections: JSON.stringify(newSections) },
      })

      // Move words to first remaining section
      if (wordsToUpdate.length > 0) {
        await tx.word.updateMany({
          where: {
            lessonId: lessonId,
            category: sectionName,
          },
          data: {
            category: firstRemainingSection,
          },
        })
      }
    })

    return NextResponse.json({
      success: true,
      sections: newSections,
      wordsMovedCount: wordsToUpdate.length,
      movedToSection: firstRemainingSection,
    })
  } catch (error) {
    console.error("Error removing section:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Update/rename a section
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const lessonId = parseInt(id)
    const { oldSectionName, newSectionName } = await request.json()

    if (!oldSectionName || !newSectionName) {
      return NextResponse.json(
        { error: "Both old and new section names are required" },
        { status: 400 }
      )
    }

    if (oldSectionName === newSectionName) {
      return NextResponse.json(
        { error: "New name must be different" },
        { status: 400 }
      )
    }

    // Get the current lesson with words
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { words: true },
    })

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
    }

    // Get current sections
    const currentSections = lesson.sections
      ? JSON.parse(lesson.sections)
      : ["Key Words", "Additional Words"]

    // Check if old section exists
    if (!currentSections.includes(oldSectionName)) {
      return NextResponse.json(
        { error: "Section to rename not found" },
        { status: 404 }
      )
    }

    // Check if new section name already exists
    if (currentSections.includes(newSectionName.trim())) {
      return NextResponse.json(
        { error: "A section with this name already exists" },
        { status: 400 }
      )
    }

    // Update section name in the sections array
    const newSections = currentSections.map((s: string) =>
      s === oldSectionName ? newSectionName.trim() : s
    )

    // Update lesson sections and all words in this category in a transaction
    await prisma.$transaction(async (tx) => {
      // Update lesson sections
      await tx.lesson.update({
        where: { id: lessonId },
        data: { sections: JSON.stringify(newSections) },
      })

      // Update all words in this section to use the new category name
      await tx.word.updateMany({
        where: {
          lessonId: lessonId,
          category: oldSectionName,
        },
        data: {
          category: newSectionName.trim(),
        },
      })
    })

    const wordsUpdatedCount = lesson.words.filter(
      (word) => word.category === oldSectionName
    ).length

    return NextResponse.json({
      success: true,
      sections: newSections,
      wordsUpdatedCount,
    })
  } catch (error) {
    console.error("Error updating section:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
