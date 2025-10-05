/**
 * Helper functions for Teacher Dashboard
 */

import type { Lesson } from "@/types/teacher-dashboard"

/**
 * Get default sections for a lesson
 */
export const getDefaultSections = (): string[] => [
  "Key Words",
  "Additional Words",
]

/**
 * Get sections for a specific lesson
 */
export const getLessonSections = (lesson: Lesson): string[] => {
  if (lesson.sections && Array.isArray(lesson.sections)) {
    return lesson.sections
  }
  return getDefaultSections()
}

/**
 * Get color for a section by index
 */
export const getSectionColor = (index: number): string => {
  const colors = [
    "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
    "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
    "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100",
    "bg-pink-100 text-pink-800 dark:bg-pink-800 dark:text-pink-100",
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100",
    "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
    "bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100",
  ]
  return colors[index % colors.length]
}

/**
 * Generate unique ID for toast messages
 */
export const generateToastId = (): string => {
  return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
