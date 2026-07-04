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
          className="bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-md hover:border-green-500/30 transition-all p-6 border-t-4 border-t-green-500 border-x border-b border-gray-100 dark:border-gray-800 flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-md bg-green-50 dark:bg-green-950/40 text-green-500 transition-colors">
                <FaLayerGroup className="text-xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-green-500 transition-colors">
                {unit.name}
              </h3>
            </div>

            <div className="space-y-3 my-4 pl-1">
              <div className="flex items-center space-x-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                <FaBook className="text-gray-400" />
                <span>{unit.lessons.length} Lessons</span>
              </div>

              <div className="text-xs text-gray-400 dark:text-gray-500 italic">
                📚 Total of{" "}
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  {unit.lessons.reduce(
                    (total, lesson) => total + lesson.words.length,
                    0
                  )}
                </span>{" "}
                vocabulary words
              </div>
            </div>
          </div>

          <Link
            href={`/levels/${levelId}/units/${unit.id}`}
            className="block w-full bg-green-500 hover:bg-green-600 dark:bg-green-500 dark:hover:bg-green-600 text-white text-center py-2.5 rounded-lg transition-all font-semibold text-sm mt-4 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 duration-200"
          >
            View Lessons
          </Link>
        </div>
      ))}
    </div>
  )
}
