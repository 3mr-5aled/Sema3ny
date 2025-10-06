import { UnitsView } from "@/components/UnitsView"
import { notFound } from "next/navigation"
import Link from "next/link"
import { FaArrowLeft, FaGraduationCap } from "react-icons/fa"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

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

async function getStudyLevel(id: string): Promise<StudyLevel | null> {
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
    return levels.find((level) => level.id === parseInt(id)) || null
  } catch (error) {
    console.error("Error fetching study level:", error)
    return null
  }
}

// Generate static params for all levels at build time using direct DB query
export async function generateStaticParams() {
  try {
    const levels = await prisma.studyLevel.findMany({
      select: { id: true },
    })

    return levels.map((level) => ({
      id: level.id.toString(),
    }))
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}

// Allow dynamic params for levels created after build
export const dynamicParams = true

export default async function LevelPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const level = await getStudyLevel(id)

  if (!level) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mb-4"
        >
          <FaArrowLeft />
          <span>Back to Study Levels</span>
        </Link>

        <div className="flex items-center space-x-3">
          <FaGraduationCap className="text-3xl text-blue-600 dark:text-blue-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {level.name}
          </h1>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Choose a unit to start learning vocabulary
        </p>
      </div>

      <UnitsView units={level.units} levelId={level.id} />
    </div>
  )
}
