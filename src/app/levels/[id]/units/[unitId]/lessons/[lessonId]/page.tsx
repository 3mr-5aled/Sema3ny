import { WordCards } from "@/components/WordCards"
import { notFound } from "next/navigation"
import Link from "next/link"
import { FaArrowLeft, FaBook } from "react-icons/fa"

interface Word {
  id: number
  en: string
  ar: string
  part: string
  category: string
}

interface Lesson {
  id: number
  name: string
  words: Word[]
}

interface Unit {
  id: number
  name: string
  lessons: Lesson[]
}

interface StudyLevel {
  id: number
  name: string
  units: Unit[]
}

async function getLesson(
  levelId: string,
  unitId: string,
  lessonId: string
): Promise<{ lesson: Lesson; unit: Unit; level: StudyLevel } | null> {
  try {
    // Use absolute URL in production, relative in development
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_URL || "http://localhost:3000"

    const response = await fetch(`${baseUrl}/api/levels`, {
      cache: "no-store",
    })

    if (!response.ok) {
      return null
    }

    const levels: StudyLevel[] = await response.json()
    const level = levels.find((l) => l.id === parseInt(levelId))

    if (!level) {
      return null
    }

    const unit = level.units.find((u) => u.id === parseInt(unitId))
    if (!unit) {
      return null
    }

    const lesson = unit.lessons.find((l) => l.id === parseInt(lessonId))
    if (!lesson) {
      return null
    }

    return { lesson, unit, level }
  } catch (error) {
    console.error("Error fetching lesson:", error)
    return null
  }
}

// Generate static params for all lessons at build time
export async function generateStaticParams() {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_URL || "http://localhost:3000"

    const response = await fetch(`${baseUrl}/api/levels`, {
      cache: "no-store",
    })

    if (!response.ok) {
      return []
    }

    const levels: StudyLevel[] = await response.json()
    const params: { id: string; unitId: string; lessonId: string }[] = []

    levels.forEach((level) => {
      level.units.forEach((unit) => {
        unit.lessons.forEach((lesson) => {
          params.push({
            id: level.id.toString(),
            unitId: unit.id.toString(),
            lessonId: lesson.id.toString(),
          })
        })
      })
    })

    return params
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string; unitId: string; lessonId: string }>
}) {
  const { id, unitId, lessonId } = await params
  const result = await getLesson(id, unitId, lessonId)

  if (!result) {
    notFound()
  }

  const { lesson, unit, level } = result

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href={`/levels/${level.id}/units/${unit.id}`}
          className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mb-4"
        >
          <FaArrowLeft />
          <span>Back to {unit.name}</span>
        </Link>

        <div className="flex items-center space-x-3">
          <FaBook className="text-3xl text-purple-600 dark:text-purple-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {lesson.name}
          </h1>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Practice {lesson.words.length} vocabulary words with interactive cards
        </p>
      </div>

      <WordCards words={lesson.words} />
    </div>
  )
}
