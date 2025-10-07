"use client"

import { useState } from "react"
import { FaVolumeUp } from "react-icons/fa"
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
  const [speakingWordId, setSpeakingWordId] = useState<string | null>(null)

  const speakWord = (
    wordId: number,
    word: string,
    accent: "american" | "british"
  ) => {
    // Check if speech synthesis is supported
    if (!("speechSynthesis" in window)) {
      showErrorMessage("Text-to-speech not supported on this device")
      return
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    // Set loading state
    setSpeakingWordId(`${wordId}-${accent}`)

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(word)
    
    // Set language/locale based on accent
    utterance.lang = accent === "british" ? "en-GB" : "en-US"
    
    // Optimize for natural speech
    utterance.rate = 0.9
    utterance.pitch = 1.0
    utterance.volume = 1.0

    // Event listeners
    utterance.onend = () => {
      setSpeakingWordId(null)
    }

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event)
      setSpeakingWordId(null)
      showErrorMessage("Unable to play pronunciation")
    }

    // Speak
    window.speechSynthesis.speak(utterance)
    console.log(`Speaking: ${word} (${utterance.lang})`)
  }

  const showErrorMessage = (text: string) => {
    const message = document.createElement("div")
    message.textContent = text
    message.style.cssText =
      "position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: #f59e0b; color: white; padding: 12px 24px; border-radius: 8px; z-index: 9999; font-size: 14px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"
    document.body.appendChild(message)
    setTimeout(() => message.remove(), 3000)
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

  // Group words by category dynamically
  const wordsByCategory: Record<string, Word[]> = {}
  words.forEach((word) => {
    const category = word.category || "Uncategorized"
    if (!wordsByCategory[category]) {
      wordsByCategory[category] = []
    }
    wordsByCategory[category].push(word)
  })

  const categories = Object.keys(wordsByCategory)

  // Define colors for sections (cycling through colors)
  const sectionColors = [
    "bg-blue-600",
    "bg-green-600",
    "bg-purple-600",
    "bg-orange-600",
    "bg-pink-600",
    "bg-indigo-600",
  ]

  return (
    <div className="space-y-8">
      {/* Dynamic Category Sections */}
      {categories.map((category, index) => {
        const categoryWords = wordsByCategory[category]
        const colorClass = sectionColors[index % sectionColors.length]

        return (
          <section key={category}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
              <span className={`w-4 h-4 ${colorClass} rounded`}></span>
              <span>{category}</span>
            </h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categoryWords.map((word) => (
                <WordCard
                  key={word.id}
                  word={word}
                  onSpeak={speakWord}
                  speakingWordId={speakingWordId}
                  partOfSpeechColors={partOfSpeechColors}
                  partOfSpeechLabels={partOfSpeechLabels}
                />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

function WordCard({
  word,
  onSpeak,
  speakingWordId,
  partOfSpeechColors,
  partOfSpeechLabels,
}: {
  word: Word
  onSpeak: (
    wordId: number,
    word: string,
    accent: "american" | "british"
  ) => void
  speakingWordId: string | null
  partOfSpeechColors: Record<string, string>
  partOfSpeechLabels: Record<string, string>
}) {
  const partColor =
    partOfSpeechColors[word.part] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
  const partLabel = partOfSpeechLabels[word.part] || word.part

  const isAmericanSpeaking = speakingWordId === `${word.id}-american`
  const isBritishSpeaking = speakingWordId === `${word.id}-british`
  const isAnySpeaking = isAmericanSpeaking || isBritishSpeaking

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700 group">
      {/* English Word */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          {word.en}
        </h3>

        {/* Two Pronunciation Buttons - American & British */}
        <div className="flex space-x-2">
          <button
            onClick={() => onSpeak(word.id, word.en, "american")}
            disabled={isAnySpeaking}
            className={`p-2.5 rounded-lg text-white transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center space-x-1.5 ${
              isAmericanSpeaking
                ? "bg-blue-400 cursor-wait"
                : isAnySpeaking
                ? "bg-blue-300 cursor-not-allowed opacity-50"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            title="American pronunciation"
          >
            <USFlag className="w-5 h-3" />
            {isAmericanSpeaking ? (
              <div className="relative h-3.5 w-3.5">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-2 w-2 bg-white rounded-full animate-ping"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-1.5 w-1.5 bg-white rounded-full"></div>
                </div>
              </div>
            ) : (
              <FaVolumeUp className="h-3.5 w-3.5" />
            )}
          </button>
          <button
            onClick={() => onSpeak(word.id, word.en, "british")}
            disabled={isAnySpeaking}
            className={`p-2.5 rounded-lg text-white transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center space-x-1.5 ${
              isBritishSpeaking
                ? "bg-indigo-400 cursor-wait"
                : isAnySpeaking
                ? "bg-indigo-300 cursor-not-allowed opacity-50"
                : "bg-indigo-500 hover:bg-indigo-600"
            }`}
            title="British pronunciation"
          >
            <UKFlag className="w-5 h-3" />
            {isBritishSpeaking ? (
              <div className="relative h-3.5 w-3.5">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-2 w-2 bg-white rounded-full animate-ping"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-1.5 w-1.5 bg-white rounded-full"></div>
                </div>
              </div>
            ) : (
              <FaVolumeUp className="h-3.5 w-3.5" />
            )}
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
      <div className="flex justify-start">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${partColor}`}
        >
          {partLabel}
        </span>
      </div>
    </div>
  )
}
