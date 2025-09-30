"use client"

import { useState } from "react"
import { FaPlay, FaVolumeUp } from "react-icons/fa"
import { USFlag, UKFlag } from "./Flags"

interface Word {
  id: number
  en: string
  ar: string
  part: string
  category: string
}

interface WordCardsProps {
  words: Word[]
}

const partOfSpeechColors = {
  n: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  v: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  adj: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  adv: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  prep: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  pron: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  conj: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  art: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
}

const partOfSpeechLabels = {
  n: "Noun",
  v: "Verb",
  adj: "Adjective",
  adv: "Adverb",
  prep: "Preposition",
  pron: "Pronoun",
  conj: "Conjunction",
  art: "Article",
}

export function WordCards({ words }: WordCardsProps) {
  const [currentAccent, setCurrentAccent] = useState<"american" | "british">(
    "american"
  )

  const speakWord = (
    word: string,
    accent: "american" | "british" = currentAccent
  ) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(word)

      // Set voice based on accent preference
      const voices = speechSynthesis.getVoices()
      const preferredVoice = voices.find((voice) => {
        if (accent === "british") {
          return (
            voice.lang.includes("en-GB") ||
            voice.name.toLowerCase().includes("british")
          )
        } else {
          return (
            voice.lang.includes("en-US") ||
            voice.name.toLowerCase().includes("american")
          )
        }
      })

      if (preferredVoice) {
        utterance.voice = preferredVoice
      }

      utterance.rate = 0.8
      utterance.pitch = 1
      speechSynthesis.speak(utterance)
    }
  }

  if (words.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          No Words Available
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          This lesson doesn&apos;t have any words yet.
        </p>
      </div>
    )
  }

  const keyWords = words.filter((word) => word.category === "key")
  const additionalWords = words.filter((word) => word.category === "additional")

  return (
    <div className="space-y-8">
      {/* Accent Selection */}
      <div className="flex justify-center space-x-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setCurrentAccent("american")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentAccent === "american"
                ? "bg-blue-600 text-white"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            <span className="flex items-center space-x-2">
              <span>American</span>
              <USFlag className="w-5 h-3" />
            </span>
          </button>
          <button
            onClick={() => setCurrentAccent("british")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentAccent === "british"
                ? "bg-blue-600 text-white"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            <span className="flex items-center space-x-2">
              <span>British</span>
              <UKFlag className="w-5 h-3" />
            </span>
          </button>
        </div>
      </div>

      {/* Key Words Section */}
      {keyWords.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
            <span className="w-4 h-4 bg-blue-600 rounded"></span>
            <span>Key Words</span>
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {keyWords.map((word) => (
              <WordCard
                key={word.id}
                word={word}
                onSpeak={speakWord}
                partOfSpeechColors={partOfSpeechColors}
                partOfSpeechLabels={partOfSpeechLabels}
              />
            ))}
          </div>
        </section>
      )}

      {/* Additional Words Section */}
      {additionalWords.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
            <span className="w-4 h-4 bg-green-600 rounded"></span>
            <span>Additional Words</span>
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {additionalWords.map((word) => (
              <WordCard
                key={word.id}
                word={word}
                onSpeak={speakWord}
                partOfSpeechColors={partOfSpeechColors}
                partOfSpeechLabels={partOfSpeechLabels}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function WordCard({
  word,
  onSpeak,
  partOfSpeechColors,
  partOfSpeechLabels,
}: {
  word: Word
  onSpeak: (word: string, accent: "american" | "british") => void
  partOfSpeechColors: Record<string, string>
  partOfSpeechLabels: Record<string, string>
}) {
  const partColor =
    partOfSpeechColors[word.part] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
  const partLabel = partOfSpeechLabels[word.part] || word.part

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700 group">
      {/* English Word */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          {word.en}
        </h3>

        {/* Pronunciation Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => onSpeak(word.en, "american")}
            className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            title="American pronunciation"
          >
            <FaPlay className="h-3 w-3" />
          </button>
          <button
            onClick={() => onSpeak(word.en, "british")}
            className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
            title="British pronunciation"
          >
            <FaVolumeUp className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Arabic Translation */}
      <div className="mb-4">
        <p
          className="text-xl text-gray-700 dark:text-gray-300"
          dir="rtl"
          lang="ar"
        >
          {word.ar}
        </p>
      </div>

      {/* Part of Speech Tag */}
      <div className="flex justify-between items-center">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${partColor}`}
        >
          {partLabel}
        </span>

        {/* Category Badge */}
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            word.category === "key"
              ? "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
              : "bg-green-50 text-green-700 dark:bg-green-900/50 dark:text-green-300"
          }`}
        >
          {word.category === "key" ? "Key" : "Additional"}
        </span>
      </div>
    </div>
  )
}
