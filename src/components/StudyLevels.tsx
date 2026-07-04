"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  FaGraduationCap,
  FaLayerGroup,
  FaBook,
  FaSpinner,
} from "react-icons/fa"

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

export function StudyLevels() {
  const [levels, setLevels] = useState<StudyLevel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLevels()
  }, [])

  const fetchLevels = async () => {
    try {
      const response = await fetch("/api/levels")
      if (!response.ok) {
        throw new Error("Failed to fetch levels")
      }
      const data = await response.json()
      setLevels(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <FaSpinner className="animate-spin text-4xl text-blue-600 dark:text-blue-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 dark:text-red-400 mb-4">Error: {error}</p>
        <button
          onClick={fetchLevels}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (levels.length === 0) {
    return (
      <div className="text-center py-8">
        <FaGraduationCap className="mx-auto text-6xl text-gray-400 dark:text-gray-600 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          No Study Levels Available
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          The teacher hasn&apos;t created any study levels yet.
        </p>
        <Link
          href="/dashboard"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center space-x-2"
        >
          <span>Go to Teacher Dashboard</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {levels.map((level) => (
        <div
          key={level.id}
          className="bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-md hover:border-blue-500/30 transition-all p-6 border-t-4 border-t-blue-500 border-x border-b border-gray-100 dark:border-gray-800 flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-500 transition-colors">
                <FaGraduationCap className="text-xl" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">
                {level.name}
              </h2>
            </div>

            <div className="space-y-3.5 my-4">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1.5 bg-gray-50 dark:bg-gray-950 px-2.5 py-1.5 rounded-md">
                  <FaLayerGroup className="text-gray-400" />
                  <span>{level.units.length} Units</span>
                </div>
                <div className="flex items-center space-x-1.5 bg-gray-50 dark:bg-gray-950 px-2.5 py-1.5 rounded-md">
                  <FaBook className="text-gray-400" />
                  <span>
                    {level.units.reduce(
                      (total, unit) => total + unit.lessons.length,
                      0
                    )}{" "}
                    Lessons
                  </span>
                </div>
              </div>

              <div className="text-xs text-gray-400 dark:text-gray-500 italic pl-1">
                📚 Total of{" "}
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  {level.units.reduce(
                    (total, unit) =>
                      total +
                      unit.lessons.reduce(
                        (lessonTotal, lesson) => lessonTotal + lesson.words.length,
                        0
                      ),
                    0
                  )}
                </span>{" "}
                vocabulary words
              </div>
            </div>
          </div>

          <Link
            href={`/levels/${level.id}`}
            className="block w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-center py-2.5 rounded-lg transition-all font-semibold text-sm mt-4 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 duration-200"
          >
            Start Learning
          </Link>
        </div>
      ))}
    </div>
  )
}
