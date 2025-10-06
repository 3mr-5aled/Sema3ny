"use client"

import { WordCards } from "@/components/WordCards"
import Link from "next/link"
import { FaArrowLeft, FaBook } from "react-icons/fa"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

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

export default function LessonPage() {
  const params = useParams()
  const levelId = params.id as string
  const unitId = params.unitId as string
  const lessonId = params.lessonId as string
  
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [unit, setUnit] = useState<Unit | null>(null)
  const [level, setLevel] = useState<StudyLevel | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchLesson() {
      try {
        setLoading(true)
        const response = await fetch(`/api/levels`)
        
        if (!response.ok) {
          setError(true)
          return
        }

        const levels: StudyLevel[] = await response.json()
        const foundLevel = levels.find((l) => l.id === parseInt(levelId))

        if (!foundLevel) {
          setError(true)
          return
        }

        const foundUnit = foundLevel.units.find((u) => u.id === parseInt(unitId))
        if (!foundUnit) {
          setError(true)
          return
        }

        const foundLesson = foundUnit.lessons.find((l) => l.id === parseInt(lessonId))
        if (!foundLesson) {
          setError(true)
          return
        }

        setLevel(foundLevel)
        setUnit(foundUnit)
        setLesson(foundLesson)
      } catch (err) {
        console.error("Error fetching lesson:", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchLesson()
  }, [levelId, unitId, lessonId])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading lesson...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !lesson || !unit || !level) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Lesson Not Found
          </h1>
          <Link
            href={`/levels/${levelId}/units/${unitId}`}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Go back to unit
          </Link>
        </div>
      </div>
    )
  }

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
