import { LessonsView } from "@/components/LessonsView"
import { notFound } from "next/navigation"
import Link from "next/link"
import { FaArrowLeft, FaLayerGroup } from "react-icons/fa"

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

async function getUnit(
  levelId: string,
  unitId: string
): Promise<{ unit: Unit; level: StudyLevel } | null> {
  try {
    // Use absolute URL in production, relative in development
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_URL || "http://localhost:3000"

    const response = await fetch(`${baseUrl}/api/levels`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
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

    return { unit, level }
  } catch (error) {
    console.error("Error fetching unit:", error)
    return null
  }
}

// Generate static params for all units at build time
export async function generateStaticParams() {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_URL || "http://localhost:3000"

    const response = await fetch(`${baseUrl}/api/levels`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      return []
    }

    const levels: StudyLevel[] = await response.json()
    const params: { id: string; unitId: string }[] = []

    levels.forEach((level) => {
      level.units.forEach((unit) => {
        params.push({
          id: level.id.toString(),
          unitId: unit.id.toString(),
        })
      })
    })

    return params
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}

export default async function UnitPage({
  params,
}: {
  params: Promise<{ id: string; unitId: string }>
}) {
  const { id, unitId } = await params
  const result = await getUnit(id, unitId)

  if (!result) {
    notFound()
  }

  const { unit, level } = result

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href={`/levels/${level.id}`}
          className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mb-4"
        >
          <FaArrowLeft />
          <span>Back to {level.name}</span>
        </Link>

        <div className="flex items-center space-x-3">
          <FaLayerGroup className="text-3xl text-green-600 dark:text-green-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {unit.name}
          </h1>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Choose a lesson to practice vocabulary
        </p>
      </div>

      <LessonsView lessons={unit.lessons} levelId={level.id} unitId={unit.id} />
    </div>
  )
}
