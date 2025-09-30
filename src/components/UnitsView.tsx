"use client"

import Link from "next/link"
import { FaLayerGroup, FaBook } from "react-icons/fa"

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

interface UnitsViewProps {
  units: Unit[]
  levelId: number
}

export function UnitsView({ units, levelId }: UnitsViewProps) {
  if (units.length === 0) {
    return (
      <div className="text-center py-8">
        <FaLayerGroup className="mx-auto text-6xl text-gray-400 dark:text-gray-600 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          No Units Available
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          This study level doesn&apos;t have any units yet.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {units.map((unit) => (
        <div
          key={unit.id}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center space-x-3 mb-4">
            <FaLayerGroup className="text-2xl text-green-600 dark:text-green-400" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {unit.name}
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <FaBook />
              <span>{unit.lessons.length} Lessons</span>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-500">
              {unit.lessons.reduce(
                (total, lesson) => total + lesson.words.length,
                0
              )}{" "}
              vocabulary words
            </div>

            <Link
              href={`/levels/${levelId}/units/${unit.id}`}
              className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-3 rounded-lg transition-colors font-medium mt-4"
            >
              View Lessons
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
