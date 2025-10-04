"use client"

import { useEffect, useState, useCallback } from "react"
import {
  FaGraduationCap,
  FaLayerGroup,
  FaBook,
  FaPlus,
  FaChevronDown,
  FaChevronRight,
  FaSpinner,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaCopy,
  FaCheck,
  FaGripVertical,
  FaSort,
} from "react-icons/fa"
import { ToastContainer, type ToastMessage } from "./Toast"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

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
  order: number
  words: Word[]
  sections?: string[] | null
}

interface Unit {
  id: number
  name: string
  order: number
  lessons: Lesson[]
}

interface StudyLevel {
  id: number
  name: string
  order: number
  units: Unit[]
}

interface WordData {
  en: string
  ar: string
  part: string
}

interface WordsPayload {
  [sectionName: string]: WordData[]
}

// Helper functions for sections
const getDefaultSections = (): string[] => ["Key Words", "Additional Words"]

const getLessonSections = (lesson: Lesson): string[] => {
  if (lesson.sections && Array.isArray(lesson.sections)) {
    return lesson.sections
  }
  return getDefaultSections()
}

const getSectionColor = (index: number): string => {
  const colors = [
    "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
    "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
    "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100",
    "bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100",
    "bg-pink-100 text-pink-800 dark:bg-pink-800 dark:text-pink-100",
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100",
  ]
  return colors[index % colors.length]
}

// Sortable Item Wrapper Component
function SortableItem({
  id,
  children,
  disabled,
}: {
  id: string
  children: React.ReactNode
  disabled?: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {!disabled && (
        <div
          {...attributes}
          {...listeners}
          className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing z-10 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          <FaGripVertical className="text-gray-400" />
        </div>
      )}
      <div className={!disabled ? "pl-10" : ""}>{children}</div>
    </div>
  )
}

export function TeacherDashboard() {
  const [levels, setLevels] = useState<StudyLevel[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedLevels, setExpandedLevels] = useState<Set<number>>(new Set())
  const [expandedUnits, setExpandedUnits] = useState<Set<number>>(new Set())
  const [expandedLessons, setExpandedLessons] = useState<Set<number>>(new Set())

  // Form states
  const [newLevelName, setNewLevelName] = useState("")
  const [newUnitName, setNewUnitName] = useState("")
  const [newLessonName, setNewLessonName] = useState("")
  const [wordsJson, setWordsJson] = useState("")

  // Loading states
  const [isCreatingLevel, setIsCreatingLevel] = useState(false)
  const [creatingUnitForLevel, setCreatingUnitForLevel] = useState<
    number | null
  >(null)
  const [creatingLessonForUnit, setCreatingLessonForUnit] = useState<
    number | null
  >(null)
  const [addingWordsToLesson, setAddingWordsToLesson] = useState<number | null>(
    null
  )

  // Edit states
  const [editingLevel, setEditingLevel] = useState<number | null>(null)
  const [editingUnit, setEditingUnit] = useState<number | null>(null)
  const [editingLesson, setEditingLesson] = useState<number | null>(null)

  // Edit form values
  const [editLevelName, setEditLevelName] = useState("")
  const [editUnitName, setEditUnitName] = useState("")
  const [editLessonName, setEditLessonName] = useState("")

  // Delete confirmation states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{
    type: "level" | "unit" | "lesson" | "word"
    id: number
    name: string
  } | null>(null)

  // Single word form states
  const [showAddWordModal, setShowAddWordModal] = useState(false)
  const [addWordLessonId, setAddWordLessonId] = useState<number | null>(null)
  const [singleWordData, setSingleWordData] = useState({
    en: "",
    ar: "",
    part: "",
    category: "Key Words",
  })
  const [isAddingSingleWord, setIsAddingSingleWord] = useState(false)

  // Edit word states
  const [editingWord, setEditingWord] = useState<number | null>(null)
  const [showEditWordModal, setShowEditWordModal] = useState(false)
  const [editWordData, setEditWordData] = useState({
    en: "",
    ar: "",
    part: "",
    category: "",
  })

  // Section management states
  const [showSectionModal, setShowSectionModal] = useState(false)
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null)
  const [newSectionName, setNewSectionName] = useState("")
  const [isAddingSection, setIsAddingSection] = useState(false)
  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(
    null
  )
  const [editSectionName, setEditSectionName] = useState("")

  // Bulk words modal state
  const [showBulkWordsModal, setShowBulkWordsModal] = useState(false)
  const [bulkWordsLessonId, setBulkWordsLessonId] = useState<number | null>(
    null
  )

  // Expandable sections state
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  )

  // Copy link state
  const [copiedLessonId, setCopiedLessonId] = useState<number | null>(null)

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  // Reorder mode states
  const [isReorderMode, setIsReorderMode] = useState(false)
  const [reorderingLevels, setReorderingLevels] = useState<StudyLevel[]>([])
  const [reorderingUnits, setReorderingUnits] = useState<{
    [levelId: number]: Unit[]
  }>({})
  const [reorderingLessons, setReorderingLessons] = useState<{
    [unitId: number]: Lesson[]
  }>({})
  const [reorderingSections, setReorderingSections] = useState<{
    [lessonId: number]: string[]
  }>({})
  const [reorderingWords, setReorderingWords] = useState<{
    [sectionKey: string]: Word[]
  }>({})

  // Toast helper function
  const showToast = useCallback(
    (type: "success" | "error" | "info", title: string, message: string) => {
      const id = `toast-${Date.now()}-${Math.random()}`
      setToasts((prev) => [...prev, { id, type, title, message }])
    },
    []
  )

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const fetchLevels = useCallback(async () => {
    try {
      const response = await fetch("/api/levels")
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`)
      }
      const data = await response.json()
      // Parse sections field for each lesson
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parsedData = data.map((level: any) => ({
        ...level,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        units: level.units.map((unit: any) => ({
          ...unit,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          lessons: unit.lessons.map((lesson: any) => ({
            ...lesson,
            sections: lesson.sections
              ? typeof lesson.sections === "string"
                ? JSON.parse(lesson.sections)
                : lesson.sections
              : null,
          })),
        })),
      }))
      setLevels(parsedData)
    } catch (error) {
      console.error("Error fetching levels:", error)
      showToast(
        "error",
        "Failed to Load Data",
        "Unable to fetch study levels. Please refresh the page and try again."
      )
    } finally {
      setLoading(false)
    }
  }, [showToast])

  // Reorder mode functions
  const enterReorderMode = useCallback(() => {
    setIsReorderMode(true)
    // Create deep copies for reordering
    setReorderingLevels(JSON.parse(JSON.stringify(levels)))

    const unitsMap: { [levelId: number]: Unit[] } = {}
    const lessonsMap: { [unitId: number]: Lesson[] } = {}
    const sectionsMap: { [lessonId: number]: string[] } = {}
    const wordsMap: { [sectionKey: string]: Word[] } = {}

    levels.forEach((level) => {
      unitsMap[level.id] = JSON.parse(JSON.stringify(level.units))
      level.units.forEach((unit) => {
        lessonsMap[unit.id] = JSON.parse(JSON.stringify(unit.lessons))
        unit.lessons.forEach((lesson) => {
          sectionsMap[lesson.id] = JSON.parse(
            JSON.stringify(getLessonSections(lesson))
          )
          // Initialize words for each section
          const sections = getLessonSections(lesson)
          sections.forEach((sectionName) => {
            const sectionKey = `${lesson.id}-${sectionName}`
            const sectionWords = lesson.words.filter(
              (w) => w.category === sectionName
            )
            wordsMap[sectionKey] = JSON.parse(JSON.stringify(sectionWords))
          })
        })
      })
    })

    setReorderingUnits(unitsMap)
    setReorderingLessons(lessonsMap)
    setReorderingSections(sectionsMap)
    setReorderingWords(wordsMap)

    showToast(
      "info",
      "Reorder Mode",
      "Drag and drop items to reorder them. Click Save when done."
    )
  }, [levels, showToast])

  const cancelReorder = useCallback(() => {
    setIsReorderMode(false)
    setReorderingLevels([])
    setReorderingUnits({})
    setReorderingLessons({})
    setReorderingSections({})
    setReorderingWords({})
    showToast("info", "Reorder Cancelled", "Changes were not saved")
  }, [showToast])

  const saveReorder = useCallback(async () => {
    try {
      // Save study levels order
      const levelPromises = reorderingLevels.map((level, index) =>
        fetch(`/api/levels/${level.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: level.name, order: index }),
        })
      )

      // Save units order (maintain order within each level)
      const unitPromises = Object.values(reorderingUnits).flatMap((units) =>
        units.map((unit, index) =>
          fetch(`/api/units/${unit.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: unit.name, order: index }),
          })
        )
      )

      // Save lessons order (maintain order within each unit)
      const lessonPromises = Object.values(reorderingLessons).flatMap(
        (lessons) =>
          lessons.map((lesson, index) => {
            const sections =
              reorderingSections[lesson.id] || getLessonSections(lesson)
            return fetch(`/api/lessons/${lesson.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: lesson.name,
                order: index,
                sections: JSON.stringify(sections),
              }),
            })
          })
      )

      // Save sections-only updates (for lessons that weren't reordered but had section changes)
      const sectionOnlyPromises = Object.entries(reorderingSections)
        .filter(([lessonId]) => {
          // Only include lessons that aren't already in reorderingLessons
          const alreadyProcessed = Object.values(reorderingLessons)
            .flat()
            .some((lesson) => lesson.id.toString() === lessonId)
          return !alreadyProcessed
        })
        .map(([lessonId, sections]) => {
          const lesson = levels
            .flatMap((l) => l.units)
            .flatMap((u) => u.lessons)
            .find((l) => l.id.toString() === lessonId)
          if (!lesson) return null
          return fetch(`/api/lessons/${lessonId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: lesson.name,
              order: lesson.order,
              sections: JSON.stringify(sections),
            }),
          })
        })
        .filter(Boolean)

      // Save words order (maintain order within each section)
      const wordPromises = Object.values(reorderingWords).flatMap((words) =>
        words.map((word, index) =>
          fetch(`/api/words/${word.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              en: word.en,
              ar: word.ar,
              part: word.part,
              category: word.category,
              order: index,
            }),
          })
        )
      )

      await Promise.all([
        ...levelPromises,
        ...unitPromises,
        ...lessonPromises,
        ...sectionOnlyPromises,
        ...wordPromises,
      ])

      setIsReorderMode(false)
      setReorderingLevels([])
      setReorderingUnits({})
      setReorderingLessons({})
      setReorderingSections({})
      setReorderingWords({})

      await fetchLevels()
      showToast(
        "success",
        "Order Saved",
        "All items have been reordered successfully"
      )
    } catch (error) {
      console.error("Error saving order:", error)
      showToast(
        "error",
        "Failed to Save Order",
        error instanceof Error ? error.message : "An unexpected error occurred"
      )
    }
  }, [
    reorderingLevels,
    reorderingUnits,
    reorderingLessons,
    reorderingSections,
    reorderingWords,
    levels,
    fetchLevels,
    showToast,
  ])

  // Drag handlers
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEndLevels = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setReorderingLevels((items) => {
      const oldIndex = items.findIndex(
        (item) => item.id.toString() === active.id
      )
      const newIndex = items.findIndex((item) => item.id.toString() === over.id)
      return arrayMove(items, oldIndex, newIndex)
    })
  }, [])

  const handleDragEndUnits = useCallback((levelId: number) => {
    return (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return

      setReorderingUnits((prev) => {
        const items = prev[levelId] || []
        const oldIndex = items.findIndex(
          (item) => item.id.toString() === active.id
        )
        const newIndex = items.findIndex(
          (item) => item.id.toString() === over.id
        )
        return {
          ...prev,
          [levelId]: arrayMove(items, oldIndex, newIndex),
        }
      })
    }
  }, [])

  const handleDragEndLessons = useCallback((unitId: number) => {
    return (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return

      setReorderingLessons((prev) => {
        const items = prev[unitId] || []
        const oldIndex = items.findIndex(
          (item) => item.id.toString() === active.id
        )
        const newIndex = items.findIndex(
          (item) => item.id.toString() === over.id
        )
        return {
          ...prev,
          [unitId]: arrayMove(items, oldIndex, newIndex),
        }
      })
    }
  }, [])

  const handleDragEndSections = useCallback((lessonId: number) => {
    return (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return

      setReorderingSections((prev) => {
        const items = prev[lessonId] || []
        const oldIndex = items.findIndex(
          (item, index) => `section-${index}` === active.id
        )
        const newIndex = items.findIndex(
          (item, index) => `section-${index}` === over.id
        )
        return {
          ...prev,
          [lessonId]: arrayMove(items, oldIndex, newIndex),
        }
      })
    }
  }, [])

  const handleDragEndWords = useCallback((sectionKey: string) => {
    return (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return

      setReorderingWords((prev) => {
        const items = prev[sectionKey] || []
        const oldIndex = items.findIndex(
          (item) => item.id.toString() === active.id
        )
        const newIndex = items.findIndex(
          (item) => item.id.toString() === over.id
        )
        return {
          ...prev,
          [sectionKey]: arrayMove(items, oldIndex, newIndex),
        }
      })
    }
  }, [])

  useEffect(() => {
    fetchLevels()
  }, [fetchLevels])

  // Auto-expand all sections when levels are loaded or updated
  useEffect(() => {
    const allSectionKeys = new Set<string>(expandedSections) // Keep existing expanded state
    levels.forEach((level) => {
      level.units.forEach((unit) => {
        unit.lessons.forEach((lesson) => {
          const sections = getLessonSections(lesson)
          sections.forEach((sectionName) => {
            const sectionKey = `${lesson.id}-${sectionName}`
            // Only add if there are words in this section OR if it's a new section
            const sectionWords = lesson.words.filter(
              (w) => w.category === sectionName
            )
            if (sectionWords.length > 0) {
              allSectionKeys.add(sectionKey)
            }
          })
        })
      })
    })
    setExpandedSections(allSectionKeys)
  }, [levels]) // eslint-disable-line react-hooks/exhaustive-deps

  const toggleLevel = (levelId: number) => {
    const newExpanded = new Set(expandedLevels)
    if (newExpanded.has(levelId)) {
      newExpanded.delete(levelId)
    } else {
      newExpanded.add(levelId)
    }
    setExpandedLevels(newExpanded)
  }

  const toggleUnit = (unitId: number) => {
    const newExpanded = new Set(expandedUnits)
    if (newExpanded.has(unitId)) {
      newExpanded.delete(unitId)
    } else {
      newExpanded.add(unitId)
    }
    setExpandedUnits(newExpanded)
  }

  const toggleLesson = (lessonId: number) => {
    const newExpanded = new Set(expandedLessons)
    if (newExpanded.has(lessonId)) {
      newExpanded.delete(lessonId)
    } else {
      newExpanded.add(lessonId)
    }
    setExpandedLessons(newExpanded)
  }

  const toggleSection = (sectionKey: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionKey)) {
      newExpanded.delete(sectionKey)
    } else {
      newExpanded.add(sectionKey)
    }
    setExpandedSections(newExpanded)
  }

  const createLevel = async () => {
    if (!newLevelName.trim()) {
      showToast("error", "Validation Error", "Please enter a level name")
      return
    }

    setIsCreatingLevel(true)
    try {
      const response = await fetch("/api/levels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newLevelName.trim() }),
      })

      if (response.ok) {
        setNewLevelName("")
        await fetchLevels()
        showToast(
          "success",
          "Level Created",
          `"${newLevelName.trim()}" has been created successfully`
        )
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create level")
      }
    } catch (error) {
      console.error("Error creating level:", error)
      showToast(
        "error",
        "Failed to Create Level",
        error instanceof Error ? error.message : "An unexpected error occurred"
      )
    } finally {
      setIsCreatingLevel(false)
    }
  }

  const createUnit = async (studyLevelId: number) => {
    if (!newUnitName.trim()) {
      showToast("error", "Validation Error", "Please enter a unit name")
      return
    }

    setCreatingUnitForLevel(studyLevelId)
    try {
      const response = await fetch("/api/units", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newUnitName.trim(),
          studyLevelId,
        }),
      })

      if (response.ok) {
        setNewUnitName("")
        await fetchLevels()
        showToast(
          "success",
          "Unit Created",
          `"${newUnitName.trim()}" has been created successfully`
        )
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create unit")
      }
    } catch (error) {
      console.error("Error creating unit:", error)
      showToast(
        "error",
        "Failed to Create Unit",
        error instanceof Error ? error.message : "An unexpected error occurred"
      )
    } finally {
      setCreatingUnitForLevel(null)
    }
  }

  const createLesson = async (unitId: number) => {
    if (!newLessonName.trim()) {
      showToast("error", "Validation Error", "Please enter a lesson name")
      return
    }

    setCreatingLessonForUnit(unitId)
    try {
      const response = await fetch("/api/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newLessonName.trim(),
          unitId,
        }),
      })

      if (response.ok) {
        setNewLessonName("")
        await fetchLevels()
        showToast(
          "success",
          "Lesson Created",
          `"${newLessonName.trim()}" has been created successfully`
        )
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create lesson")
      }
    } catch (error) {
      console.error("Error creating lesson:", error)
      showToast(
        "error",
        "Failed to Create Lesson",
        error instanceof Error ? error.message : "An unexpected error occurred"
      )
    } finally {
      setCreatingLessonForUnit(null)
    }
  }

  const addWords = async (lessonId: number) => {
    if (!wordsJson.trim()) {
      showToast(
        "error",
        "Validation Error",
        "Please enter word data in JSON format"
      )
      return
    }

    setAddingWordsToLesson(lessonId)
    try {
      const payload: WordsPayload = JSON.parse(wordsJson)

      // Validate payload structure
      if (typeof payload !== "object" || Array.isArray(payload)) {
        throw new Error("JSON must be an object with section names as keys")
      }

      const response = await fetch(`/api/lessons/${lessonId}/words`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        const wordCount = Object.values(payload).reduce(
          (sum, words) => sum + words.length,
          0
        )
        setWordsJson("")
        setShowBulkWordsModal(false)
        setBulkWordsLessonId(null)
        await fetchLevels()
        showToast(
          "success",
          "Words Added",
          `Successfully added ${wordCount} word${wordCount !== 1 ? "s" : ""}`
        )
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to add words")
      }
    } catch (error) {
      console.error("Error adding words:", error)
      if (error instanceof SyntaxError) {
        showToast(
          "error",
          "Invalid JSON Format",
          "Please check your JSON syntax and try again"
        )
      } else {
        showToast(
          "error",
          "Failed to Add Words",
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        )
      }
    } finally {
      setAddingWordsToLesson(null)
    }
  }

  // Edit functions
  const startEditLevel = (level: StudyLevel) => {
    setEditingLevel(level.id)
    setEditLevelName(level.name)
  }

  const cancelEditLevel = () => {
    setEditingLevel(null)
    setEditLevelName("")
  }

  const saveEditLevel = async (levelId: number) => {
    if (!editLevelName.trim()) {
      showToast("error", "Validation Error", "Please enter a level name")
      return
    }

    try {
      const response = await fetch(`/api/levels/${levelId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editLevelName.trim() }),
      })

      if (response.ok) {
        setEditingLevel(null)
        setEditLevelName("")
        await fetchLevels()
        showToast(
          "success",
          "Level Updated",
          "Level name has been updated successfully"
        )
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update level")
      }
    } catch (error) {
      console.error("Error updating level:", error)
      showToast(
        "error",
        "Failed to Update Level",
        error instanceof Error ? error.message : "An unexpected error occurred"
      )
    }
  }

  const cancelEditUnit = () => {
    setEditingUnit(null)
    setEditUnitName("")
  }

  const saveEditUnit = async (unitId: number) => {
    if (!editUnitName.trim()) {
      showToast("error", "Validation Error", "Please enter a unit name")
      return
    }

    try {
      const response = await fetch(`/api/units/${unitId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editUnitName.trim() }),
      })

      if (response.ok) {
        setEditingUnit(null)
        setEditUnitName("")
        await fetchLevels()
        showToast(
          "success",
          "Unit Updated",
          "Unit name has been updated successfully"
        )
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update unit")
      }
    } catch (error) {
      console.error("Error updating unit:", error)
      showToast(
        "error",
        "Failed to Update Unit",
        error instanceof Error ? error.message : "An unexpected error occurred"
      )
    }
  }

  const startEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson.id)
    setEditLessonName(lesson.name)
  }

  const cancelEditLesson = () => {
    setEditingLesson(null)
    setEditLessonName("")
  }

  const saveEditLesson = async (lessonId: number) => {
    if (!editLessonName.trim()) {
      showToast("error", "Validation Error", "Please enter a lesson name")
      return
    }

    try {
      const response = await fetch(`/api/lessons/${lessonId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editLessonName.trim() }),
      })

      if (response.ok) {
        setEditingLesson(null)
        setEditLessonName("")
        await fetchLevels()
        showToast(
          "success",
          "Lesson Updated",
          "Lesson name has been updated successfully"
        )
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update lesson")
      }
    } catch (error) {
      console.error("Error updating lesson:", error)
      showToast(
        "error",
        "Failed to Update Lesson",
        error instanceof Error ? error.message : "An unexpected error occurred"
      )
    }
  }

  // Delete functions
  const confirmDelete = (
    type: "level" | "unit" | "lesson" | "word",
    id: number,
    name: string
  ) => {
    setShowDeleteConfirm({ type, id, name })
  }

  const cancelDelete = () => {
    setShowDeleteConfirm(null)
  }

  const executeDelete = async () => {
    if (!showDeleteConfirm) return

    const { type, id, name } = showDeleteConfirm

    try {
      const response = await fetch(`/api/${type}s/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchLevels()
        setShowDeleteConfirm(null)
        showToast(
          "success",
          `${type.charAt(0).toUpperCase() + type.slice(1)} Deleted`,
          `"${name}" has been deleted successfully`
        )
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to delete ${type}`)
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error)
      showToast(
        "error",
        `Failed to Delete ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        error instanceof Error ? error.message : "An unexpected error occurred"
      )
    }
  }

  // Single word addition function
  const addSingleWord = async () => {
    if (
      !addWordLessonId ||
      !singleWordData.en.trim() ||
      !singleWordData.ar.trim() ||
      !singleWordData.part.trim()
    ) {
      showToast(
        "error",
        "Validation Error",
        "Please fill in all fields (English, Arabic, and Part of Speech)"
      )
      return
    }

    setIsAddingSingleWord(true)
    try {
      const response = await fetch(`/api/lessons/${addWordLessonId}/words`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          [singleWordData.category]: [
            {
              en: singleWordData.en.trim(),
              ar: singleWordData.ar.trim(),
              part: singleWordData.part.trim(),
            },
          ],
        }),
      })

      if (response.ok) {
        const lesson = levels
          .flatMap((level) => level.units)
          .flatMap((unit) => unit.lessons)
          .find((l) => l.id === addWordLessonId)
        const defaultCategory = lesson
          ? getLessonSections(lesson)[0] || "Key Words"
          : "Key Words"

        setSingleWordData({
          en: "",
          ar: "",
          part: "",
          category: defaultCategory,
        })
        setShowAddWordModal(false)
        setAddWordLessonId(null)
        await fetchLevels()
        showToast(
          "success",
          "Word Added",
          `"${singleWordData.en.trim()}" has been added successfully`
        )
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to add word")
      }
    } catch (error) {
      console.error("Error adding word:", error)
      showToast(
        "error",
        "Failed to Add Word",
        error instanceof Error ? error.message : "An unexpected error occurred"
      )
    } finally {
      setIsAddingSingleWord(false)
    }
  }

  // Edit word functions
  const startEditWord = (word: Word) => {
    setEditingWord(word.id)
    setEditWordData({
      en: word.en,
      ar: word.ar,
      part: word.part,
      category: word.category,
    })
    setShowEditWordModal(true)
  }

  const cancelEditWord = () => {
    setEditingWord(null)
    setEditWordData({ en: "", ar: "", part: "", category: "" })
    setShowEditWordModal(false)
  }

  const saveEditWord = async (wordId: number) => {
    if (
      !editWordData.en.trim() ||
      !editWordData.ar.trim() ||
      !editWordData.part.trim()
    ) {
      showToast("error", "Validation Error", "Please fill in all fields")
      return
    }

    try {
      const response = await fetch(`/api/words/${wordId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editWordData),
      })

      if (response.ok) {
        setEditingWord(null)
        setEditWordData({ en: "", ar: "", part: "", category: "" })
        setShowEditWordModal(false)
        await fetchLevels()
        showToast(
          "success",
          "Word Updated",
          "Word has been updated successfully"
        )
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update word")
      }
    } catch (error) {
      console.error("Error updating word:", error)
      showToast(
        "error",
        "Failed to Update Word",
        error instanceof Error ? error.message : "An unexpected error occurred"
      )
    }
  }

  // Section management functions
  const addSection = async () => {
    if (!newSectionName.trim()) {
      showToast("error", "Validation Error", "Please enter a section name")
      return
    }

    if (!selectedLessonId) return

    setIsAddingSection(true)
    try {
      const response = await fetch(
        `/api/lessons/${selectedLessonId}/sections`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sectionName: newSectionName.trim() }),
        }
      )

      if (response.ok) {
        await fetchLevels()
        setNewSectionName("")
        showToast(
          "success",
          "Section Added",
          `"${newSectionName.trim()}" has been created successfully`
        )
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to add section")
      }
    } catch (error) {
      console.error("Error adding section:", error)
      showToast(
        "error",
        "Failed to Add Section",
        error instanceof Error ? error.message : "An unexpected error occurred"
      )
    } finally {
      setIsAddingSection(false)
    }
  }

  const updateSection = async (oldName: string, newName: string) => {
    if (!newName.trim()) {
      showToast("error", "Validation Error", "Section name cannot be empty")
      return false
    }

    if (oldName === newName) {
      return true
    }

    try {
      const response = await fetch(
        `/api/lessons/${selectedLessonId}/sections`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            oldSectionName: oldName,
            newSectionName: newName,
          }),
        }
      )

      if (response.ok) {
        const data = await response.json()
        await fetchLevels()
        showToast(
          "success",
          "Section Renamed",
          `Renamed to "${newName}" and updated ${data.wordsUpdatedCount} word${
            data.wordsUpdatedCount !== 1 ? "s" : ""
          }`
        )
        return true
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update section")
      }
    } catch (error) {
      console.error("Error updating section:", error)
      showToast(
        "error",
        "Failed to Update Section",
        error instanceof Error ? error.message : "An unexpected error occurred"
      )
      return false
    }
  }

  const deleteSection = async (sectionName: string, targetSection: string) => {
    try {
      const response = await fetch(
        `/api/lessons/${selectedLessonId}/sections`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sectionName }),
        }
      )

      if (response.ok) {
        await fetchLevels()
        showToast(
          "success",
          "Section Deleted",
          `"${sectionName}" has been deleted. Words moved to "${targetSection}"`
        )
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete section")
      }
    } catch (error) {
      console.error("Error deleting section:", error)
      showToast(
        "error",
        "Failed to Delete Section",
        error instanceof Error ? error.message : "An unexpected error occurred"
      )
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <FaSpinner className="animate-spin text-4xl text-blue-600 dark:text-blue-400" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header with Reorder and Clear Data Buttons */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Teacher Dashboard
          </h1>
          <div className="flex items-center gap-3">
            {isReorderMode ? (
              <>
                <button
                  onClick={saveReorder}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <FaSave size={14} />
                  <span>Save Order</span>
                </button>
                <button
                  onClick={cancelReorder}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <FaTimes size={14} />
                  <span>Cancel</span>
                </button>
              </>
            ) : (
              <button
                onClick={enterReorderMode}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <FaSort size={14} />
                <span>Reorder Items</span>
              </button>
            )}
            <button
              onClick={async () => {
                if (
                  !confirm(
                    "⚠️ WARNING: This will delete ALL data (levels, units, lessons, words). This action cannot be undone. Are you sure?"
                  )
                )
                  return

                try {
                  // Delete all levels (cascade will delete everything)
                  const levelsResponse = await fetch("/api/levels")
                  if (!levelsResponse.ok) {
                    throw new Error("Failed to fetch levels")
                  }
                  const levelsData = await levelsResponse.json()

                  for (const level of levelsData) {
                    const deleteResponse = await fetch(
                      `/api/levels/${level.id}`,
                      { method: "DELETE" }
                    )
                    if (!deleteResponse.ok) {
                      throw new Error(`Failed to delete level: ${level.name}`)
                    }
                  }

                  await fetchLevels()
                  showToast(
                    "success",
                    "All Data Cleared",
                    "All study levels, units, lessons, and words have been deleted"
                  )
                } catch (error) {
                  console.error("Error clearing data:", error)
                  showToast(
                    "error",
                    "Failed to Clear Data",
                    error instanceof Error
                      ? error.message
                      : "An unexpected error occurred"
                  )
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              disabled={isReorderMode}
            >
              <FaTrash size={14} />
              <span>Clear All Data</span>
            </button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 min-h-screen">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Confirm Delete
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete &ldquo;{showDeleteConfirm.name}
                &rdquo;? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={executeDelete}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Word Modal */}
        {showAddWordModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 min-h-screen">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Add New Word
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    English Word
                  </label>
                  <input
                    type="text"
                    value={singleWordData.en}
                    onChange={(e) =>
                      setSingleWordData({
                        ...singleWordData,
                        en: e.target.value,
                      })
                    }
                    placeholder="Enter English word"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Arabic Word
                  </label>
                  <input
                    type="text"
                    value={singleWordData.ar}
                    onChange={(e) =>
                      setSingleWordData({
                        ...singleWordData,
                        ar: e.target.value,
                      })
                    }
                    placeholder="Enter Arabic word"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Part of Speech
                  </label>
                  <input
                    type="text"
                    value={singleWordData.part}
                    onChange={(e) =>
                      setSingleWordData({
                        ...singleWordData,
                        part: e.target.value,
                      })
                    }
                    placeholder="e.g., noun, verb, adjective"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={singleWordData.category}
                    onChange={(e) =>
                      setSingleWordData({
                        ...singleWordData,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    title="Select word category"
                  >
                    {(() => {
                      const lesson = levels
                        .flatMap((l) => l.units)
                        .flatMap((u) => u.lessons)
                        .find((l) => l.id === addWordLessonId)
                      const sections = lesson
                        ? getLessonSections(lesson)
                        : getDefaultSections()
                      return sections.map((section, index) => (
                        <option key={index} value={section}>
                          {section}
                        </option>
                      ))
                    })()}
                  </select>
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => {
                    setShowAddWordModal(false)
                    setAddWordLessonId(null)
                    setSingleWordData({
                      en: "",
                      ar: "",
                      part: "",
                      category: "Key Words",
                    })
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addSingleWord}
                  disabled={
                    !singleWordData.en.trim() ||
                    !singleWordData.ar.trim() ||
                    !singleWordData.part.trim() ||
                    isAddingSingleWord
                  }
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {isAddingSingleWord ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaPlus />
                  )}
                  <span>Add Word</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Word Modal */}
        {showEditWordModal && editingWord && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 min-h-screen">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Edit Word
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    English:
                  </label>
                  <input
                    type="text"
                    value={editWordData.en}
                    onChange={(e) =>
                      setEditWordData({ ...editWordData, en: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="English word"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Arabic:
                  </label>
                  <input
                    type="text"
                    value={editWordData.ar}
                    onChange={(e) =>
                      setEditWordData({ ...editWordData, ar: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="الكلمة بالعربية"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Part of Speech:
                  </label>
                  <input
                    type="text"
                    value={editWordData.part}
                    onChange={(e) =>
                      setEditWordData({ ...editWordData, part: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g., noun, verb, adjective"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Section:
                  </label>
                  <select
                    value={editWordData.category}
                    onChange={(e) =>
                      setEditWordData({
                        ...editWordData,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    aria-label="Select section"
                  >
                    {(() => {
                      const lesson = levels
                        .flatMap((l) => l.units)
                        .flatMap((u) => u.lessons)
                        .find((l) => l.words.some((w) => w.id === editingWord))
                      if (!lesson) return null
                      return getLessonSections(lesson).map((section, index) => (
                        <option key={index} value={section}>
                          {section}
                        </option>
                      ))
                    })()}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={cancelEditWord}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => saveEditWord(editingWord)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center space-x-2"
                >
                  <FaSave size={14} />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create New Level */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <FaPlus className="text-blue-600 dark:text-blue-400" />
            <span>Create New Study Level</span>
          </h2>

          <div className="flex space-x-4">
            <input
              type="text"
              value={newLevelName}
              onChange={(e) => setNewLevelName(e.target.value)}
              placeholder="Enter study level name (e.g., Beginner, Intermediate)"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              onKeyPress={(e) => e.key === "Enter" && createLevel()}
            />
            <button
              onClick={createLevel}
              disabled={!newLevelName.trim() || isCreatingLevel}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              {isCreatingLevel ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaPlus />
              )}
              <span>Create Level</span>
            </button>
          </div>
        </div>

        {/* Study Levels List */}
        {levels.length === 0 ? (
          <div className="text-center py-8">
            <FaGraduationCap className="mx-auto text-6xl text-gray-400 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No study levels created yet. Create your first level above.
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEndLevels}
          >
            <SortableContext
              items={(isReorderMode ? reorderingLevels : levels).map((l) =>
                l.id.toString()
              )}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {(isReorderMode ? reorderingLevels : levels).map((level) => (
                  <SortableItem
                    key={level.id}
                    id={level.id.toString()}
                    disabled={!isReorderMode}
                  >
                    <div
                      key={level.id}
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
                    >
                      {/* Level Header */}
                      <div className="flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-t-2xl">
                        <div
                          onClick={() => toggleLevel(level.id)}
                          className="flex items-center space-x-3 cursor-pointer flex-1"
                        >
                          {expandedLevels.has(level.id) ? (
                            <FaChevronDown className="text-gray-500" />
                          ) : (
                            <FaChevronRight className="text-gray-500" />
                          )}
                          <FaGraduationCap className="text-2xl text-blue-600 dark:text-blue-400" />
                          {editingLevel === level.id ? (
                            <div className="flex items-center space-x-2 flex-1">
                              <input
                                type="text"
                                value={editLevelName}
                                onChange={(e) =>
                                  setEditLevelName(e.target.value)
                                }
                                placeholder="Enter level name"
                                title="Edit level name"
                                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                                onClick={(e) => e.stopPropagation()}
                                onKeyPress={(e) => {
                                  e.stopPropagation()
                                  if (e.key === "Enter") saveEditLevel(level.id)
                                }}
                                autoFocus
                              />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  saveEditLevel(level.id)
                                }}
                                title="Save changes"
                                className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                              >
                                <FaSave />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  cancelEditLevel()
                                }}
                                title="Cancel editing"
                                className="p-1 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                              >
                                <FaTimes />
                              </button>
                            </div>
                          ) : (
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                              {level.name}
                            </h3>
                          )}
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {level.units.length} units
                          </div>
                          {editingLevel !== level.id && (
                            <div className="flex space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  startEditLevel(level)
                                }}
                                title="Edit level name"
                                className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  confirmDelete("level", level.id, level.name)
                                }}
                                title="Delete level"
                                className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Level Content */}
                      {expandedLevels.has(level.id) && (
                        <div className="px-6 pb-6">
                          {/* Create Unit Form */}
                          <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex space-x-4">
                              <input
                                type="text"
                                value={newUnitName}
                                onChange={(e) => setNewUnitName(e.target.value)}
                                placeholder="Enter unit name"
                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                                onKeyPress={(e) =>
                                  e.key === "Enter" && createUnit(level.id)
                                }
                              />
                              <button
                                onClick={() => createUnit(level.id)}
                                disabled={
                                  !newUnitName.trim() ||
                                  creatingUnitForLevel === level.id
                                }
                                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded transition-colors flex items-center space-x-2"
                              >
                                {creatingUnitForLevel === level.id ? (
                                  <FaSpinner className="animate-spin" />
                                ) : (
                                  <FaPlus />
                                )}
                                <span>Add Unit</span>
                              </button>
                            </div>
                          </div>

                          {/* Units List */}
                          <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEndUnits(level.id)}
                          >
                            <SortableContext
                              items={(isReorderMode
                                ? reorderingUnits[level.id] || level.units
                                : level.units
                              ).map((u) => u.id.toString())}
                              strategy={verticalListSortingStrategy}
                            >
                              <div className="space-y-3">
                                {(isReorderMode
                                  ? reorderingUnits[level.id] || level.units
                                  : level.units
                                ).map((unit) => (
                                  <SortableItem
                                    key={unit.id}
                                    id={unit.id.toString()}
                                    disabled={!isReorderMode}
                                  >
                                    <div className="border border-gray-200 dark:border-gray-600 rounded-lg">
                                      {/* Unit Header */}
                                      <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <div
                                          onClick={() => toggleUnit(unit.id)}
                                          className="flex items-center space-x-3 cursor-pointer flex-1"
                                        >
                                          {expandedUnits.has(unit.id) ? (
                                            <FaChevronDown className="text-gray-400" />
                                          ) : (
                                            <FaChevronRight className="text-gray-400" />
                                          )}
                                          <FaLayerGroup className="text-green-600 dark:text-green-400" />
                                          {editingUnit === unit.id ? (
                                            <input
                                              type="text"
                                              value={editUnitName}
                                              onChange={(e) =>
                                                setEditUnitName(e.target.value)
                                              }
                                              onKeyPress={(e) => {
                                                if (e.key === "Enter") {
                                                  saveEditUnit(unit.id)
                                                } else if (e.key === "Escape") {
                                                  cancelEditUnit()
                                                }
                                              }}
                                              placeholder="Enter unit name"
                                              className="font-semibold bg-white dark:bg-gray-600 text-gray-900 dark:text-white border border-blue-300 dark:border-blue-500 rounded px-2 py-1"
                                              autoFocus
                                              onClick={(e) =>
                                                e.stopPropagation()
                                              }
                                            />
                                          ) : (
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                              {unit.name}
                                            </span>
                                          )}
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <span className="text-sm text-gray-500 dark:text-gray-400">
                                            {unit.lessons.length} lessons
                                          </span>
                                          {editingUnit === unit.id ? (
                                            <>
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation()
                                                  saveEditUnit(unit.id)
                                                }}
                                                className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors p-2 rounded hover:bg-green-50 dark:hover:bg-green-900"
                                                title="Save changes"
                                                aria-label="Save unit changes"
                                              >
                                                <FaSave size={14} />
                                              </button>
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation()
                                                  cancelEditUnit()
                                                }}
                                                className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 transition-colors p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-900"
                                                title="Cancel editing"
                                                aria-label="Cancel editing unit"
                                              >
                                                <FaTimes size={14} />
                                              </button>
                                            </>
                                          ) : (
                                            <>
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation()
                                                  setEditingUnit(unit.id)
                                                  setEditUnitName(unit.name)
                                                }}
                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors p-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900"
                                                title="Edit unit"
                                                aria-label={`Edit unit ${unit.name}`}
                                              >
                                                <FaEdit size={14} />
                                              </button>
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation()
                                                  setShowDeleteConfirm({
                                                    type: "unit",
                                                    id: unit.id,
                                                    name: unit.name,
                                                  })
                                                }}
                                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors p-2 rounded hover:bg-red-50 dark:hover:bg-red-900"
                                                title="Delete unit"
                                                aria-label={`Delete unit ${unit.name}`}
                                              >
                                                <FaTrash size={14} />
                                              </button>
                                            </>
                                          )}
                                        </div>
                                      </div>

                                      {/* Unit Content */}
                                      {expandedUnits.has(unit.id) && (
                                        <div className="px-4 pb-4">
                                          {/* Create Lesson Form */}
                                          <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                            <div className="flex space-x-3">
                                              <input
                                                type="text"
                                                value={newLessonName}
                                                onChange={(e) =>
                                                  setNewLessonName(
                                                    e.target.value
                                                  )
                                                }
                                                placeholder="Enter lesson name"
                                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                                                onKeyPress={(e) =>
                                                  e.key === "Enter" &&
                                                  createLesson(unit.id)
                                                }
                                              />
                                              <button
                                                onClick={() =>
                                                  createLesson(unit.id)
                                                }
                                                disabled={
                                                  !newLessonName.trim() ||
                                                  creatingLessonForUnit ===
                                                    unit.id
                                                }
                                                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded transition-colors flex items-center space-x-2"
                                              >
                                                {creatingLessonForUnit ===
                                                unit.id ? (
                                                  <FaSpinner className="animate-spin" />
                                                ) : (
                                                  <FaPlus />
                                                )}
                                                <span>Add Lesson</span>
                                              </button>
                                            </div>
                                          </div>

                                          {/* Lessons List */}
                                          <div className="space-y-2">
                                            <DndContext
                                              sensors={sensors}
                                              collisionDetection={closestCenter}
                                              onDragEnd={(event) =>
                                                handleDragEndLessons(unit.id)(
                                                  event
                                                )
                                              }
                                            >
                                              <SortableContext
                                                items={(isReorderMode
                                                  ? reorderingLessons[unit.id]
                                                  : unit.lessons || []
                                                ).map((lesson) =>
                                                  lesson.id.toString()
                                                )}
                                                strategy={
                                                  verticalListSortingStrategy
                                                }
                                              >
                                                {(isReorderMode
                                                  ? reorderingLessons[unit.id]
                                                  : unit.lessons || []
                                                ).map((lesson) => (
                                                  <SortableItem
                                                    key={lesson.id}
                                                    id={lesson.id.toString()}
                                                    disabled={!isReorderMode}
                                                  >
                                                    <div className="border border-gray-200 dark:border-gray-600 rounded">
                                                      {/* Lesson Header */}
                                                      <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                                        <div
                                                          onClick={() =>
                                                            toggleLesson(
                                                              lesson.id
                                                            )
                                                          }
                                                          className="flex items-center space-x-3 cursor-pointer flex-1"
                                                        >
                                                          {expandedLessons.has(
                                                            lesson.id
                                                          ) ? (
                                                            <FaChevronDown className="text-gray-400" />
                                                          ) : (
                                                            <FaChevronRight className="text-gray-400" />
                                                          )}
                                                          <FaBook className="text-purple-600 dark:text-purple-400" />
                                                          {editingLesson ===
                                                          lesson.id ? (
                                                            <input
                                                              type="text"
                                                              value={
                                                                editLessonName
                                                              }
                                                              onChange={(e) =>
                                                                setEditLessonName(
                                                                  e.target.value
                                                                )
                                                              }
                                                              onKeyPress={(
                                                                e
                                                              ) => {
                                                                if (
                                                                  e.key ===
                                                                  "Enter"
                                                                ) {
                                                                  saveEditLesson(
                                                                    lesson.id
                                                                  )
                                                                } else if (
                                                                  e.key ===
                                                                  "Escape"
                                                                ) {
                                                                  cancelEditLesson()
                                                                }
                                                              }}
                                                              placeholder="Enter lesson name"
                                                              className="font-medium bg-white dark:bg-gray-600 text-gray-900 dark:text-white border border-blue-300 dark:border-blue-500 rounded px-2 py-1"
                                                              autoFocus
                                                              onClick={(e) =>
                                                                e.stopPropagation()
                                                              }
                                                            />
                                                          ) : (
                                                            <span className="font-medium text-gray-900 dark:text-white">
                                                              {lesson.name}
                                                            </span>
                                                          )}
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                          <span className="text-sm text-gray-500 dark:text-gray-400">
                                                            {
                                                              lesson.words
                                                                .length
                                                            }{" "}
                                                            words
                                                          </span>
                                                          {editingLesson ===
                                                          lesson.id ? (
                                                            <>
                                                              <button
                                                                onClick={(
                                                                  e
                                                                ) => {
                                                                  e.stopPropagation()
                                                                  saveEditLesson(
                                                                    lesson.id
                                                                  )
                                                                }}
                                                                className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors p-2 rounded hover:bg-green-50 dark:hover:bg-green-900"
                                                                title="Save changes"
                                                                aria-label="Save lesson changes"
                                                              >
                                                                <FaSave
                                                                  size={14}
                                                                />
                                                              </button>
                                                              <button
                                                                onClick={(
                                                                  e
                                                                ) => {
                                                                  e.stopPropagation()
                                                                  cancelEditLesson()
                                                                }}
                                                                className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 transition-colors p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-900"
                                                                title="Cancel editing"
                                                                aria-label="Cancel editing lesson"
                                                              >
                                                                <FaTimes
                                                                  size={14}
                                                                />
                                                              </button>
                                                            </>
                                                          ) : (
                                                            <>
                                                              <button
                                                                onClick={(
                                                                  e
                                                                ) => {
                                                                  e.stopPropagation()
                                                                  const url = `${window.location.origin}/levels/${level.id}/units/${unit.id}/lessons/${lesson.id}`
                                                                  navigator.clipboard.writeText(
                                                                    url
                                                                  )
                                                                  setCopiedLessonId(
                                                                    lesson.id
                                                                  )
                                                                  setTimeout(
                                                                    () =>
                                                                      setCopiedLessonId(
                                                                        null
                                                                      ),
                                                                    2000
                                                                  )
                                                                }}
                                                                className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors p-2 rounded hover:bg-green-50 dark:hover:bg-green-900"
                                                                title="Copy lesson link"
                                                                aria-label={`Copy link for ${lesson.name}`}
                                                              >
                                                                {copiedLessonId ===
                                                                lesson.id ? (
                                                                  <FaCheck
                                                                    size={14}
                                                                  />
                                                                ) : (
                                                                  <FaCopy
                                                                    size={14}
                                                                  />
                                                                )}
                                                              </button>
                                                              <button
                                                                onClick={(
                                                                  e
                                                                ) => {
                                                                  e.stopPropagation()
                                                                  startEditLesson(
                                                                    lesson
                                                                  )
                                                                }}
                                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors p-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900"
                                                                title="Edit lesson"
                                                                aria-label={`Edit lesson ${lesson.name}`}
                                                              >
                                                                <FaEdit
                                                                  size={14}
                                                                />
                                                              </button>
                                                              <button
                                                                onClick={(
                                                                  e
                                                                ) => {
                                                                  e.stopPropagation()
                                                                  setShowDeleteConfirm(
                                                                    {
                                                                      type: "lesson",
                                                                      id: lesson.id,
                                                                      name: lesson.name,
                                                                    }
                                                                  )
                                                                }}
                                                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors p-2 rounded hover:bg-red-50 dark:hover:bg-red-900"
                                                                title="Delete lesson"
                                                                aria-label={`Delete lesson ${lesson.name}`}
                                                              >
                                                                <FaTrash
                                                                  size={14}
                                                                />
                                                              </button>
                                                            </>
                                                          )}
                                                        </div>
                                                      </div>

                                                      {/* Lesson Content */}
                                                      {expandedLessons.has(
                                                        lesson.id
                                                      ) && (
                                                        <div className="px-3 pb-3 space-y-3">
                                                          {/* Action Buttons */}
                                                          <div className="flex flex-wrap gap-2">
                                                            <button
                                                              onClick={() => {
                                                                setBulkWordsLessonId(
                                                                  lesson.id
                                                                )
                                                                setShowBulkWordsModal(
                                                                  true
                                                                )
                                                              }}
                                                              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded text-sm transition-colors flex items-center space-x-2"
                                                            >
                                                              <FaPlus
                                                                size={14}
                                                              />
                                                              <span>
                                                                Add Bulk Words
                                                              </span>
                                                            </button>
                                                            <button
                                                              onClick={() => {
                                                                setSelectedLessonId(
                                                                  lesson.id
                                                                )
                                                                setShowSectionModal(
                                                                  true
                                                                )
                                                              }}
                                                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors flex items-center space-x-2"
                                                            >
                                                              <FaLayerGroup
                                                                size={14}
                                                              />
                                                              <span>
                                                                Manage Sections
                                                              </span>
                                                            </button>
                                                            <button
                                                              onClick={() => {
                                                                setAddWordLessonId(
                                                                  lesson.id
                                                                )
                                                                // Set default category to first section of this lesson
                                                                const firstSection =
                                                                  getLessonSections(
                                                                    lesson
                                                                  )[0] ||
                                                                  "Key Words"
                                                                setSingleWordData(
                                                                  {
                                                                    en: "",
                                                                    ar: "",
                                                                    part: "",
                                                                    category:
                                                                      firstSection,
                                                                  }
                                                                )
                                                                setShowAddWordModal(
                                                                  true
                                                                )
                                                              }}
                                                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm transition-colors flex items-center space-x-2"
                                                            >
                                                              <FaPlus
                                                                size={14}
                                                              />
                                                              <span>
                                                                Add Word
                                                              </span>
                                                            </button>
                                                          </div>

                                                          {/* Sections as Accordions */}
                                                          {getLessonSections(
                                                            lesson
                                                          ).length > 0 ? (
                                                            <div className="space-y-2">
                                                              {getLessonSections(
                                                                lesson
                                                              ).map(
                                                                (
                                                                  sectionName,
                                                                  sectionIndex
                                                                ) => {
                                                                  const sectionWords =
                                                                    lesson.words.filter(
                                                                      (word) =>
                                                                        word.category ===
                                                                        sectionName
                                                                    )

                                                                  const sectionKey = `${lesson.id}-${sectionName}`
                                                                  const isExpanded =
                                                                    expandedSections.has(
                                                                      sectionKey
                                                                    )

                                                                  return (
                                                                    <div
                                                                      key={
                                                                        sectionKey
                                                                      }
                                                                      className="border border-gray-200 dark:border-gray-600 rounded-lg"
                                                                    >
                                                                      <button
                                                                        onClick={() =>
                                                                          toggleSection(
                                                                            sectionKey
                                                                          )
                                                                        }
                                                                        className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg"
                                                                      >
                                                                        <div className="flex items-center space-x-2">
                                                                          {isExpanded ? (
                                                                            <FaChevronDown
                                                                              className="text-gray-500"
                                                                              size={
                                                                                12
                                                                              }
                                                                            />
                                                                          ) : (
                                                                            <FaChevronRight
                                                                              className="text-gray-500"
                                                                              size={
                                                                                12
                                                                              }
                                                                            />
                                                                          )}
                                                                          <span
                                                                            className={`text-sm font-medium px-2 py-1 rounded-md ${getSectionColor(
                                                                              sectionIndex
                                                                            )}`}
                                                                          >
                                                                            {
                                                                              sectionName
                                                                            }{" "}
                                                                            (
                                                                            {
                                                                              sectionWords.length
                                                                            }
                                                                            )
                                                                          </span>
                                                                        </div>
                                                                      </button>

                                                                      {isExpanded && (
                                                                        <div className="px-3 pb-3">
                                                                          {sectionWords.length >
                                                                          0 ? (
                                                                            <DndContext
                                                                              sensors={
                                                                                sensors
                                                                              }
                                                                              collisionDetection={
                                                                                closestCenter
                                                                              }
                                                                              onDragEnd={(
                                                                                event
                                                                              ) =>
                                                                                handleDragEndWords(
                                                                                  sectionKey
                                                                                )(
                                                                                  event
                                                                                )
                                                                              }
                                                                            >
                                                                              <SortableContext
                                                                                items={(isReorderMode
                                                                                  ? reorderingWords[
                                                                                      sectionKey
                                                                                    ]
                                                                                  : sectionWords ||
                                                                                    []
                                                                                ).map(
                                                                                  (
                                                                                    word
                                                                                  ) =>
                                                                                    word.id.toString()
                                                                                )}
                                                                                strategy={
                                                                                  rectSortingStrategy
                                                                                }
                                                                              >
                                                                                <div className="grid gap-2 md:grid-cols-2">
                                                                                  {(isReorderMode
                                                                                    ? reorderingWords[
                                                                                        sectionKey
                                                                                      ]
                                                                                    : sectionWords ||
                                                                                      []
                                                                                  ).map(
                                                                                    (
                                                                                      word
                                                                                    ) => (
                                                                                      <SortableItem
                                                                                        key={
                                                                                          word.id
                                                                                        }
                                                                                        id={word.id.toString()}
                                                                                        disabled={
                                                                                          !isReorderMode
                                                                                        }
                                                                                      >
                                                                                        <div className="p-2 bg-gray-100 dark:bg-gray-600 rounded text-sm">
                                                                                          {false &&
                                                                                          editingWord ===
                                                                                            word.id ? (
                                                                                            <div className="space-y-2">
                                                                                              <div className="flex space-x-2">
                                                                                                <input
                                                                                                  type="text"
                                                                                                  value={
                                                                                                    editWordData.en
                                                                                                  }
                                                                                                  onChange={(
                                                                                                    e
                                                                                                  ) =>
                                                                                                    setEditWordData(
                                                                                                      {
                                                                                                        ...editWordData,
                                                                                                        en: e
                                                                                                          .target
                                                                                                          .value,
                                                                                                      }
                                                                                                    )
                                                                                                  }
                                                                                                  className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                                                                  placeholder="English"
                                                                                                />
                                                                                                <input
                                                                                                  type="text"
                                                                                                  value={
                                                                                                    editWordData.ar
                                                                                                  }
                                                                                                  onChange={(
                                                                                                    e
                                                                                                  ) =>
                                                                                                    setEditWordData(
                                                                                                      {
                                                                                                        ...editWordData,
                                                                                                        ar: e
                                                                                                          .target
                                                                                                          .value,
                                                                                                      }
                                                                                                    )
                                                                                                  }
                                                                                                  className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                                                                  placeholder="Arabic"
                                                                                                  dir="rtl"
                                                                                                />
                                                                                              </div>
                                                                                              <div className="flex space-x-2">
                                                                                                <input
                                                                                                  type="text"
                                                                                                  value={
                                                                                                    editWordData.part
                                                                                                  }
                                                                                                  onChange={(
                                                                                                    e
                                                                                                  ) =>
                                                                                                    setEditWordData(
                                                                                                      {
                                                                                                        ...editWordData,
                                                                                                        part: e
                                                                                                          .target
                                                                                                          .value,
                                                                                                      }
                                                                                                    )
                                                                                                  }
                                                                                                  className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                                                                  placeholder="Part of speech"
                                                                                                />
                                                                                                <select
                                                                                                  value={
                                                                                                    editWordData.category
                                                                                                  }
                                                                                                  onChange={(
                                                                                                    e
                                                                                                  ) =>
                                                                                                    setEditWordData(
                                                                                                      {
                                                                                                        ...editWordData,
                                                                                                        category:
                                                                                                          e
                                                                                                            .target
                                                                                                            .value,
                                                                                                      }
                                                                                                    )
                                                                                                  }
                                                                                                  className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                                                                  title="Select category"
                                                                                                >
                                                                                                  {getLessonSections(
                                                                                                    lesson
                                                                                                  ).map(
                                                                                                    (
                                                                                                      section,
                                                                                                      index
                                                                                                    ) => (
                                                                                                      <option
                                                                                                        key={
                                                                                                          index
                                                                                                        }
                                                                                                        value={
                                                                                                          section
                                                                                                        }
                                                                                                      >
                                                                                                        {
                                                                                                          section
                                                                                                        }
                                                                                                      </option>
                                                                                                    )
                                                                                                  )}
                                                                                                </select>
                                                                                              </div>
                                                                                              <div className="flex justify-end space-x-1">
                                                                                                <button
                                                                                                  onClick={() =>
                                                                                                    saveEditWord(
                                                                                                      word.id
                                                                                                    )
                                                                                                  }
                                                                                                  className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors p-1 rounded hover:bg-green-50 dark:hover:bg-green-900"
                                                                                                  title="Save changes"
                                                                                                >
                                                                                                  <FaSave
                                                                                                    size={
                                                                                                      12
                                                                                                    }
                                                                                                  />
                                                                                                </button>
                                                                                                <button
                                                                                                  onClick={
                                                                                                    cancelEditWord
                                                                                                  }
                                                                                                  className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 transition-colors p-1 rounded hover:bg-gray-50 dark:hover:bg-gray-900"
                                                                                                  title="Cancel editing"
                                                                                                >
                                                                                                  <FaTimes
                                                                                                    size={
                                                                                                      12
                                                                                                    }
                                                                                                  />
                                                                                                </button>
                                                                                              </div>
                                                                                            </div>
                                                                                          ) : (
                                                                                            <div className="flex justify-between items-start">
                                                                                              <div className="flex-1">
                                                                                                <span className="font-medium text-gray-900 dark:text-white">
                                                                                                  {
                                                                                                    word.en
                                                                                                  }
                                                                                                </span>
                                                                                                <span className="text-gray-600 dark:text-gray-400 mx-2">
                                                                                                  -
                                                                                                </span>
                                                                                                <span
                                                                                                  className="text-gray-700 dark:text-gray-300"
                                                                                                  dir="rtl"
                                                                                                >
                                                                                                  {
                                                                                                    word.ar
                                                                                                  }
                                                                                                </span>
                                                                                              </div>
                                                                                              <div className="flex items-center space-x-1">
                                                                                                <span
                                                                                                  className={`px-2 py-1 rounded text-xs font-medium ${
                                                                                                    word.category ===
                                                                                                    "key"
                                                                                                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                                                                                      : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                                                                  }`}
                                                                                                >
                                                                                                  {
                                                                                                    word.part
                                                                                                  }
                                                                                                </span>
                                                                                                <button
                                                                                                  onClick={() =>
                                                                                                    startEditWord(
                                                                                                      word
                                                                                                    )
                                                                                                  }
                                                                                                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900"
                                                                                                  title="Edit word"
                                                                                                  aria-label={`Edit word ${word.en}`}
                                                                                                >
                                                                                                  <FaEdit
                                                                                                    size={
                                                                                                      12
                                                                                                    }
                                                                                                  />
                                                                                                </button>
                                                                                                <button
                                                                                                  onClick={() =>
                                                                                                    setShowDeleteConfirm(
                                                                                                      {
                                                                                                        type: "word",
                                                                                                        id: word.id,
                                                                                                        name: word.en,
                                                                                                      }
                                                                                                    )
                                                                                                  }
                                                                                                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors p-1 rounded hover:bg-red-50 dark:hover:bg-red-900"
                                                                                                  title="Delete word"
                                                                                                  aria-label={`Delete word ${word.en}`}
                                                                                                >
                                                                                                  <FaTrash
                                                                                                    size={
                                                                                                      12
                                                                                                    }
                                                                                                  />
                                                                                                </button>
                                                                                              </div>
                                                                                            </div>
                                                                                          )}
                                                                                        </div>
                                                                                      </SortableItem>
                                                                                    )
                                                                                  )}
                                                                                </div>
                                                                              </SortableContext>
                                                                            </DndContext>
                                                                          ) : (
                                                                            <p className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                                                                              No
                                                                              words
                                                                              in
                                                                              this
                                                                              section
                                                                              yet.
                                                                            </p>
                                                                          )}
                                                                        </div>
                                                                      )}
                                                                    </div>
                                                                  )
                                                                }
                                                              )}
                                                            </div>
                                                          ) : (
                                                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                                              <p>
                                                                No words added
                                                                yet. Click
                                                                &quot;Add
                                                                Word&quot; or
                                                                &quot;Add Bulk
                                                                Words&quot; to
                                                                get started.
                                                              </p>
                                                            </div>
                                                          )}
                                                        </div>
                                                      )}
                                                    </div>
                                                  </SortableItem>
                                                ))}
                                              </SortableContext>
                                            </DndContext>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </SortableItem>
                                ))}
                              </div>
                            </SortableContext>
                          </DndContext>
                        </div>
                      )}
                    </div>
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {/* Bulk Words Modal */}
        {showBulkWordsModal && bulkWordsLessonId && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 min-h-screen">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 max-w-2xl w-full mx-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Add Bulk Words (JSON Format)
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Paste JSON with words grouped by sections:
                  </label>
                  <textarea
                    value={wordsJson}
                    onChange={(e) => setWordsJson(e.target.value)}
                    placeholder={`{
  "Key Words": [
    { "en": "awkward", "ar": "مُحرِج/غير مُريح", "part": "adj" },
    { "en": "laughter", "ar": "ضِحك", "part": "n" }
  ],
  "Additional Words": [
    { "en": "absence", "ar": "غياب", "part": "n" },
    { "en": "physically", "ar": "جسدياً", "part": "adv" }
  ]
}`}
                    className="w-full h-64 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Use section names as keys. Each section should contain an
                    array of word objects with &quot;en&quot;, &quot;ar&quot;,
                    and &quot;part&quot; fields.
                  </p>
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => {
                    setShowBulkWordsModal(false)
                    setBulkWordsLessonId(null)
                    setWordsJson("")
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => addWords(bulkWordsLessonId)}
                  disabled={
                    !wordsJson.trim() ||
                    addingWordsToLesson === bulkWordsLessonId
                  }
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {addingWordsToLesson === bulkWordsLessonId ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaPlus />
                  )}
                  <span>Add Words</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Section Management Modal */}
        {showSectionModal && selectedLessonId && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 min-h-screen">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Manage Sections
                </h3>

                {/* Reorder Buttons */}
                <div className="flex items-center space-x-2">
                  {!isReorderMode ? (
                    <button
                      onClick={enterReorderMode}
                      className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
                      title="Reorder sections"
                    >
                      <FaSort size={14} />
                      <span>Reorder</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={saveReorder}
                        className="flex items-center space-x-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors"
                        title="Save order"
                      >
                        <FaSave size={14} />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={cancelReorder}
                        className="flex items-center space-x-2 px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-md transition-colors"
                        title="Cancel"
                      >
                        <FaTimes size={14} />
                        <span>Cancel</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {(() => {
                  const lesson = levels
                    .flatMap((l) => l.units)
                    .flatMap((u) => u.lessons)
                    .find((lesson) => lesson.id === selectedLessonId)
                  if (!lesson) return null

                  const sections = getLessonSections(lesson)

                  return (
                    <>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Current Sections:
                        </label>
                        <DndContext
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={(event) =>
                            handleDragEndSections(selectedLessonId)(event)
                          }
                        >
                          <SortableContext
                            items={(isReorderMode
                              ? reorderingSections[selectedLessonId]
                              : sections || []
                            ).map((section, idx) => `section-${idx}`)}
                            strategy={verticalListSortingStrategy}
                          >
                            {(isReorderMode
                              ? reorderingSections[selectedLessonId]
                              : sections || []
                            ).map((section, index) => (
                              <SortableItem
                                key={`section-${index}`}
                                id={`section-${index}`}
                                disabled={!isReorderMode}
                              >
                                <div
                                  className={`flex items-center justify-between px-3 py-2 rounded-md text-sm ${getSectionColor(
                                    index
                                  )}`}
                                >
                                  {editingSectionIndex === index ? (
                                    <input
                                      type="text"
                                      value={editSectionName}
                                      onChange={(e) =>
                                        setEditSectionName(e.target.value)
                                      }
                                      className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white mr-2"
                                      placeholder="Section name"
                                      autoFocus
                                      onKeyDown={async (e) => {
                                        if (e.key === "Enter") {
                                          // Save on Enter
                                          const success = await updateSection(
                                            section,
                                            editSectionName.trim()
                                          )
                                          if (success) {
                                            setEditingSectionIndex(null)
                                          }
                                        } else if (e.key === "Escape") {
                                          // Cancel on Escape
                                          setEditingSectionIndex(null)
                                        }
                                      }}
                                    />
                                  ) : (
                                    <span>{section}</span>
                                  )}

                                  <div className="flex space-x-2">
                                    {editingSectionIndex === index ? (
                                      <>
                                        <button
                                          onClick={async () => {
                                            const success = await updateSection(
                                              section,
                                              editSectionName.trim()
                                            )
                                            if (success) {
                                              setEditingSectionIndex(null)
                                            }
                                          }}
                                          className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors"
                                          title="Save"
                                        >
                                          <FaSave size={12} />
                                        </button>
                                        <button
                                          onClick={() => {
                                            setEditingSectionIndex(null)
                                          }}
                                          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 transition-colors"
                                          title="Cancel"
                                        >
                                          <FaTimes size={12} />
                                        </button>
                                      </>
                                    ) : (
                                      <>
                                        <button
                                          onClick={() => {
                                            setEditingSectionIndex(index)
                                            setEditSectionName(section)
                                          }}
                                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                                          title="Edit section"
                                        >
                                          <FaEdit size={12} />
                                        </button>
                                        <button
                                          onClick={async () => {
                                            if (sections.length === 1) {
                                              showToast(
                                                "error",
                                                "Cannot Delete",
                                                "You must have at least one section"
                                              )
                                              return
                                            }

                                            if (
                                              !confirm(
                                                `Delete section "${section}"? Words in this section will be moved to "${sections[0]}".`
                                              )
                                            )
                                              return

                                            await deleteSection(
                                              section,
                                              sections[0]
                                            )
                                          }}
                                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                                          title="Delete section"
                                        >
                                          <FaTrash size={12} />
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </SortableItem>
                            ))}
                          </SortableContext>
                        </DndContext>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Add New Section:
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={newSectionName}
                            onChange={(e) => setNewSectionName(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Section name"
                          />
                          <button
                            onClick={addSection}
                            disabled={isAddingSection || !newSectionName.trim()}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-3 py-2 rounded-md text-sm transition-colors"
                          >
                            {isAddingSection ? (
                              <FaSpinner className="animate-spin" size={12} />
                            ) : (
                              <FaPlus size={12} />
                            )}
                          </button>
                        </div>
                      </div>
                    </>
                  )
                })()}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowSectionModal(false)
                    setSelectedLessonId(null)
                    setNewSectionName("")
                    setEditingSectionIndex(null)
                    setEditSectionName("")
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notifications */}
        <ToastContainer toasts={toasts} onClose={removeToast} />
      </div>
    </div>
  )
}
