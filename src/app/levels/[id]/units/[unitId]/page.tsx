"use client"

import { LessonsView } from "@/components/LessonsView"
import Link from "next/link"
import { FaArrowLeft, FaLayerGroup } from "react-icons/fa"
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

export default function UnitPage() {
  const params = useParams()
  const levelId = params.id as string
  const unitId = params.unitId as string
  
  const [unit, setUnit] = useState<Unit | null>(null)
  const [level, setLevel] = useState<StudyLevel | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchUnit() {
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

        setLevel(foundLevel)
        setUnit(foundUnit)
      } catch (err) {
        console.error("Error fetching unit:", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchUnit()
  }, [levelId, unitId])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading unit...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !unit || !level) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Unit Not Found
          </h1>
          <Link
            href={`/levels/${levelId}`}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Go back to level
          </Link>
        </div>
      </div>
    )
  }

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
