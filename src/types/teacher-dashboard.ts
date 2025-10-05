/**
 * Type definitions for Teacher Dashboard
 */

export interface Word {
  id: number
  en: string
  ar: string
  part: string
  category: string
  order?: number
}

export interface Lesson {
  id: number
  name: string
  order: number
  words: Word[]
  sections?: string[] | null
}

export interface Unit {
  id: number
  name: string
  order: number
  lessons: Lesson[]
}

export interface StudyLevel {
  id: number
  name: string
  order: number
  units: Unit[]
}

export interface WordData {
  en: string
  ar: string
  part: string
}

export interface WordsPayload {
  [sectionName: string]: WordData[]
}

export interface EditWordData {
  en: string
  ar: string
  part: string
  category: string
}

export interface ToastMessage {
  id: string
  type: "success" | "error" | "info"
  title: string
  message: string
}
