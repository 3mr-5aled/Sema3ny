"use client"

import { UnitsView } from "@/components/UnitsView"
import Link from "next/link"
import { FaArrowLeft, FaGraduationCap } from "react-icons/fa"
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

export default function LevelPage() {
  const params = useParams()
  const id = params.id as string
  const [level, setLevel] = useState<StudyLevel | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchLevel() {
      try {
        setLoading(true)
        const response = await fetch(`/api/levels`)
        
        if (!response.ok) {
          setError(true)
          return
        }

        const levels: StudyLevel[] = await response.json()
        const foundLevel = levels.find((level) => level.id === parseInt(id))
        
        if (!foundLevel) {
          setError(true)
          return
        }

        setLevel(foundLevel)
      } catch (err) {
        console.error("Error fetching level:", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchLevel()
  }, [id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading level...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !level) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Level Not Found
          </h1>
          <Link
            href="/"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Go back to home
          </Link>
        </div>
      </div>
    )
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
