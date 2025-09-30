"use client"

import Link from "next/link"
import { FaBook } from "react-icons/fa"

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

interface LessonsViewProps {
  lessons: Lesson[]
  levelId: number
  unitId: number
}

export function LessonsView({ lessons, levelId, unitId }: LessonsViewProps) {
  if (lessons.length === 0) {
    return (
      <div className="text-center py-8">
        <FaBook className="mx-auto text-6xl text-gray-400 dark:text-gray-600 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          No Lessons Available
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          This unit doesn&apos;t have any lessons yet.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {lessons.map((lesson) => (
        <div
          key={lesson.id}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center space-x-3 mb-4">
            <FaBook className="text-2xl text-purple-600 dark:text-purple-400" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {lesson.name}
            </h3>
          </div>

          <div className="space-y-3">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {lesson.words.length} vocabulary words
            </div>

            <div className="flex space-x-2 text-xs">
              {lesson.words.filter((w) => w.category === "key").length > 0 && (
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                  {lesson.words.filter((w) => w.category === "key").length} Key
                  Words
                </span>
              )}
              {lesson.words.filter((w) => w.category === "additional").length >
                0 && (
                <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                  {
                    lesson.words.filter((w) => w.category === "additional")
                      .length
                  }{" "}
                  Additional
                </span>
              )}
            </div>

            <Link
              href={`/levels/${levelId}/units/${unitId}/lessons/${lesson.id}`}
              className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center py-3 rounded-lg transition-colors font-medium mt-4"
            >
              Practice Words
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
