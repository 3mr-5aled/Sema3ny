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
          className="bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-md hover:border-purple-500/30 transition-all p-6 border-t-4 border-t-purple-500 border-x border-b border-gray-100 dark:border-gray-800 flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-500 transition-colors">
                <FaBook className="text-xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-purple-500 transition-colors">
                {lesson.name}
              </h3>
            </div>

            <div className="space-y-3.5 my-4 pl-1">
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                📝 Contains{" "}
                <span className="font-bold text-gray-800 dark:text-gray-200">
                  {lesson.words.length}
                </span>{" "}
                vocabulary words
              </div>

              <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider">
                {lesson.words.filter((w) => w.category === "key").length > 0 && (
                  <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 px-2 py-1 rounded">
                    {lesson.words.filter((w) => w.category === "key").length} Key
                  </span>
                )}
                {lesson.words.filter((w) => w.category === "additional").length >
                  0 && (
                  <span className="bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900/30 px-2 py-1 rounded">
                    {
                      lesson.words.filter((w) => w.category === "additional")
                        .length
                    }{" "}
                    Additional
                  </span>
                )}
              </div>
            </div>
          </div>

          <Link
            href={`/levels/${levelId}/units/${unitId}/lessons/${lesson.id}`}
            className="block w-full bg-purple-500 hover:bg-purple-600 dark:bg-purple-500 dark:hover:bg-purple-600 text-white text-center py-2.5 rounded-lg transition-all font-semibold text-sm mt-4 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 duration-200"
          >
            Practice Words
          </Link>
        </div>
      ))}
    </div>
  )
}
