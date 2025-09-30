"use client"

import { useEffect, useState } from "react"
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

interface WordData {
  en: string
  ar: string
  part: string
}

interface WordsPayload {
  key?: WordData[]
  additional?: WordData[]
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
    category: "key",
  })
  const [isAddingSingleWord, setIsAddingSingleWord] = useState(false)

  // Edit word states
  const [editingWord, setEditingWord] = useState<number | null>(null)
  const [editWordData, setEditWordData] = useState({
    en: "",
    ar: "",
    part: "",
    category: "",
  })

  useEffect(() => {
    fetchLevels()
  }, [])

  const fetchLevels = async () => {
    try {
      const response = await fetch("/api/levels")
      if (response.ok) {
        const data = await response.json()
        setLevels(data)
      }
    } catch (error) {
      console.error("Error fetching levels:", error)
    } finally {
      setLoading(false)
    }
  }

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

  const createLevel = async () => {
    if (!newLevelName.trim()) return

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
      }
    } catch (error) {
      console.error("Error creating level:", error)
    } finally {
      setIsCreatingLevel(false)
    }
  }

  const createUnit = async (studyLevelId: number) => {
    if (!newUnitName.trim()) return

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
      }
    } catch (error) {
      console.error("Error creating unit:", error)
    } finally {
      setCreatingUnitForLevel(null)
    }
  }

  const createLesson = async (unitId: number) => {
    if (!newLessonName.trim()) return

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
      }
    } catch (error) {
      console.error("Error creating lesson:", error)
    } finally {
      setCreatingLessonForUnit(null)
    }
  }

  const addWords = async (lessonId: number) => {
    if (!wordsJson.trim()) return

    try {
      const payload: WordsPayload = JSON.parse(wordsJson)

      setAddingWordsToLesson(lessonId)
      const response = await fetch(`/api/lessons/${lessonId}/words`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setWordsJson("")
        await fetchLevels()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      alert("Invalid JSON format. Please check your input.")
      console.error("Error adding words:", error)
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
    if (!editLevelName.trim()) return

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
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error("Error updating level:", error)
      alert("Failed to update level")
    }
  }

  const cancelEditUnit = () => {
    setEditingUnit(null)
    setEditUnitName("")
  }

  const saveEditUnit = async (unitId: number) => {
    if (!editUnitName.trim()) return

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
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error("Error updating unit:", error)
      alert("Failed to update unit")
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
    if (!editLessonName.trim()) return

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
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error("Error updating lesson:", error)
      alert("Failed to update lesson")
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

    const { type, id } = showDeleteConfirm

    try {
      const response = await fetch(`/api/${type}s/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchLevels()
        setShowDeleteConfirm(null)
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error)
      alert(`Failed to delete ${type}`)
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
      alert("Please fill in all fields")
      return
    }

    setIsAddingSingleWord(true)
    try {
      const response = await fetch(`/api/lessons/${addWordLessonId}/words`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          words: [
            {
              en: singleWordData.en.trim(),
              ar: singleWordData.ar.trim(),
              part: singleWordData.part.trim(),
              category: singleWordData.category,
            },
          ],
        }),
      })

      if (response.ok) {
        setSingleWordData({ en: "", ar: "", part: "", category: "key" })
        setShowAddWordModal(false)
        setAddWordLessonId(null)
        await fetchLevels()
        alert("Word added successfully!")
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error("Error adding word:", error)
      alert("Failed to add word")
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
  }

  const cancelEditWord = () => {
    setEditingWord(null)
    setEditWordData({ en: "", ar: "", part: "", category: "" })
  }

  const saveEditWord = async (wordId: number) => {
    if (
      !editWordData.en.trim() ||
      !editWordData.ar.trim() ||
      !editWordData.part.trim()
    )
      return

    try {
      const response = await fetch(`/api/words/${wordId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editWordData),
      })

      if (response.ok) {
        setEditingWord(null)
        setEditWordData({ en: "", ar: "", part: "", category: "" })
        await fetchLevels()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error("Error updating word:", error)
      alert("Failed to update word")
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
        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
                    <option value="key">Key Word</option>
                    <option value="additional">Additional Word</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => {
                    setShowAddWordModal(false)
                    setSingleWordData({
                      en: "",
                      ar: "",
                      part: "",
                      category: "key",
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
          <div className="space-y-4">
            {levels.map((level) => (
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
                          onChange={(e) => setEditLevelName(e.target.value)}
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
                    <div className="space-y-3">
                      {level.units.map((unit) => (
                        <div
                          key={unit.id}
                          className="border border-gray-200 dark:border-gray-600 rounded-lg"
                        >
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
                                  onClick={(e) => e.stopPropagation()}
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
                                      setNewLessonName(e.target.value)
                                    }
                                    placeholder="Enter lesson name"
                                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                                    onKeyPress={(e) =>
                                      e.key === "Enter" && createLesson(unit.id)
                                    }
                                  />
                                  <button
                                    onClick={() => createLesson(unit.id)}
                                    disabled={
                                      !newLessonName.trim() ||
                                      creatingLessonForUnit === unit.id
                                    }
                                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded transition-colors flex items-center space-x-2"
                                  >
                                    {creatingLessonForUnit === unit.id ? (
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
                                {unit.lessons.map((lesson) => (
                                  <div
                                    key={lesson.id}
                                    className="border border-gray-200 dark:border-gray-600 rounded"
                                  >
                                    {/* Lesson Header */}
                                    <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                      <div
                                        onClick={() => toggleLesson(lesson.id)}
                                        className="flex items-center space-x-3 cursor-pointer flex-1"
                                      >
                                        {expandedLessons.has(lesson.id) ? (
                                          <FaChevronDown className="text-gray-400" />
                                        ) : (
                                          <FaChevronRight className="text-gray-400" />
                                        )}
                                        <FaBook className="text-purple-600 dark:text-purple-400" />
                                        {editingLesson === lesson.id ? (
                                          <input
                                            type="text"
                                            value={editLessonName}
                                            onChange={(e) =>
                                              setEditLessonName(e.target.value)
                                            }
                                            onKeyPress={(e) => {
                                              if (e.key === "Enter") {
                                                saveEditLesson(lesson.id)
                                              } else if (e.key === "Escape") {
                                                cancelEditLesson()
                                              }
                                            }}
                                            placeholder="Enter lesson name"
                                            className="font-medium bg-white dark:bg-gray-600 text-gray-900 dark:text-white border border-blue-300 dark:border-blue-500 rounded px-2 py-1"
                                            autoFocus
                                            onClick={(e) => e.stopPropagation()}
                                          />
                                        ) : (
                                          <span className="font-medium text-gray-900 dark:text-white">
                                            {lesson.name}
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                          {lesson.words.length} words
                                        </span>
                                        {editingLesson === lesson.id ? (
                                          <>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                saveEditLesson(lesson.id)
                                              }}
                                              className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors p-2 rounded hover:bg-green-50 dark:hover:bg-green-900"
                                              title="Save changes"
                                              aria-label="Save lesson changes"
                                            >
                                              <FaSave size={14} />
                                            </button>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                cancelEditLesson()
                                              }}
                                              className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 transition-colors p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-900"
                                              title="Cancel editing"
                                              aria-label="Cancel editing lesson"
                                            >
                                              <FaTimes size={14} />
                                            </button>
                                          </>
                                        ) : (
                                          <>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                startEditLesson(lesson)
                                              }}
                                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors p-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900"
                                              title="Edit lesson"
                                              aria-label={`Edit lesson ${lesson.name}`}
                                            >
                                              <FaEdit size={14} />
                                            </button>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                setShowDeleteConfirm({
                                                  type: "lesson",
                                                  id: lesson.id,
                                                  name: lesson.name,
                                                })
                                              }}
                                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors p-2 rounded hover:bg-red-50 dark:hover:bg-red-900"
                                              title="Delete lesson"
                                              aria-label={`Delete lesson ${lesson.name}`}
                                            >
                                              <FaTrash size={14} />
                                            </button>
                                          </>
                                        )}
                                      </div>
                                    </div>

                                    {/* Lesson Content */}
                                    {expandedLessons.has(lesson.id) && (
                                      <div className="px-3 pb-3 space-y-3">
                                        {/* Add Words Form */}
                                        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                            Add Words (JSON Format)
                                          </h4>
                                          <textarea
                                            value={wordsJson}
                                            onChange={(e) =>
                                              setWordsJson(e.target.value)
                                            }
                                            placeholder={`{
  "key": [
    { "en": "awkward", "ar": "مُحرِج/غير مُريح", "part": "adj" },
    { "en": "laughter", "ar": "ضِحك", "part": "n" }
  ],
  "additional": [
    { "en": "absence", "ar": "غياب", "part": "n" },
    { "en": "physically", "ar": "جسدياً", "part": "adv" }
  ]
}`}
                                            className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white font-mono text-sm"
                                          />
                                          <button
                                            onClick={() => addWords(lesson.id)}
                                            disabled={
                                              !wordsJson.trim() ||
                                              addingWordsToLesson === lesson.id
                                            }
                                            className="mt-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-2 rounded transition-colors flex items-center space-x-2"
                                          >
                                            {addingWordsToLesson ===
                                            lesson.id ? (
                                              <FaSpinner className="animate-spin" />
                                            ) : (
                                              <FaPlus />
                                            )}
                                            <span>Add Words</span>
                                          </button>
                                        </div>

                                        {/* Words List */}
                                        {lesson.words.length > 0 && (
                                          <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                              <h4 className="font-medium text-gray-900 dark:text-white">
                                                Current Words (
                                                {lesson.words.length})
                                              </h4>
                                              <button
                                                onClick={() => {
                                                  setAddWordLessonId(lesson.id)
                                                  setShowAddWordModal(true)
                                                }}
                                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1"
                                              >
                                                <FaPlus size={12} />
                                                <span>Add Word</span>
                                              </button>
                                            </div>
                                            <div className="grid gap-2 md:grid-cols-2">
                                              {lesson.words.map((word) => (
                                                <div
                                                  key={word.id}
                                                  className="p-2 bg-gray-100 dark:bg-gray-600 rounded text-sm"
                                                >
                                                  {editingWord === word.id ? (
                                                    <div className="space-y-2">
                                                      <div className="flex space-x-2">
                                                        <input
                                                          type="text"
                                                          value={
                                                            editWordData.en
                                                          }
                                                          onChange={(e) =>
                                                            setEditWordData({
                                                              ...editWordData,
                                                              en: e.target
                                                                .value,
                                                            })
                                                          }
                                                          className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                          placeholder="English"
                                                        />
                                                        <input
                                                          type="text"
                                                          value={
                                                            editWordData.ar
                                                          }
                                                          onChange={(e) =>
                                                            setEditWordData({
                                                              ...editWordData,
                                                              ar: e.target
                                                                .value,
                                                            })
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
                                                          onChange={(e) =>
                                                            setEditWordData({
                                                              ...editWordData,
                                                              part: e.target
                                                                .value,
                                                            })
                                                          }
                                                          className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                          placeholder="Part of speech"
                                                        />
                                                        <select
                                                          value={
                                                            editWordData.category
                                                          }
                                                          onChange={(e) =>
                                                            setEditWordData({
                                                              ...editWordData,
                                                              category:
                                                                e.target.value,
                                                            })
                                                          }
                                                          className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                          title="Select category"
                                                        >
                                                          <option value="key">
                                                            Key
                                                          </option>
                                                          <option value="additional">
                                                            Additional
                                                          </option>
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
                                                          <FaSave size={12} />
                                                        </button>
                                                        <button
                                                          onClick={
                                                            cancelEditWord
                                                          }
                                                          className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 transition-colors p-1 rounded hover:bg-gray-50 dark:hover:bg-gray-900"
                                                          title="Cancel editing"
                                                        >
                                                          <FaTimes size={12} />
                                                        </button>
                                                      </div>
                                                    </div>
                                                  ) : (
                                                    <div className="flex justify-between items-start">
                                                      <div className="flex-1">
                                                        <span className="font-medium text-gray-900 dark:text-white">
                                                          {word.en}
                                                        </span>
                                                        <span className="text-gray-600 dark:text-gray-400 mx-2">
                                                          -
                                                        </span>
                                                        <span
                                                          className="text-gray-700 dark:text-gray-300"
                                                          dir="rtl"
                                                        >
                                                          {word.ar}
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
                                                          {word.part}
                                                        </span>
                                                        <button
                                                          onClick={() =>
                                                            startEditWord(word)
                                                          }
                                                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900"
                                                          title="Edit word"
                                                          aria-label={`Edit word ${word.en}`}
                                                        >
                                                          <FaEdit size={12} />
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
                                                          <FaTrash size={12} />
                                                        </button>
                                                      </div>
                                                    </div>
                                                  )}
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
