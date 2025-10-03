"use client"

import { useEffect, useState } from "react"
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

  // Ensure voices are loaded
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const loadVoices = () => {
        speechSynthesis.getVoices()
      }

      loadVoices()
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices
      }
    }
  }, [])

  const speakWord = (
    wordId: number,
    word: string,
    accent: "american" | "british"
  ) => {
    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech
      speechSynthesis.cancel()

      // Set loading state
      setSpeakingWordId(`${wordId}-${accent}`)

      const utterance = new SpeechSynthesisUtterance(word)
      const voices = speechSynthesis.getVoices()

      // Find the best voice based on accent parameter
      let selectedVoice = null

      if (accent === "british") {
        // Priority list for British voices (most natural first)
        const britishVoiceNames = [
          // Google voices (most natural, online)
          "Google UK English Female",
          "Google UK English Male",
          // Microsoft Natural voices (Windows 11)
          "Microsoft Libby Online (Natural) - English (United Kingdom)",
          "Microsoft Ryan Online (Natural) - English (United Kingdom)",
          "Microsoft Sonia Online (Natural) - English (United Kingdom)",
          // Microsoft Premium voices
          "Microsoft Hazel Desktop - English (Great Britain)",
          "Microsoft George - English (United Kingdom)",
          "Microsoft Susan - English (United Kingdom)",
          // Fallback voices
          "en-GB-LibbyNeural",
          "en-GB-RyanNeural",
        ]

        // Try to find a preferred British voice
        for (const name of britishVoiceNames) {
          selectedVoice = voices.find((v) => v.name === name)
          if (selectedVoice) break
        }

        // Try to find any online/natural voice
        if (!selectedVoice) {
          selectedVoice = voices.find(
            (v) =>
              (v.lang === "en-GB" || v.lang.startsWith("en-GB")) &&
              (v.name.toLowerCase().includes("natural") ||
                v.name.toLowerCase().includes("online") ||
                v.name.toLowerCase().includes("neural") ||
                v.name.toLowerCase().includes("google"))
          )
        }

        // Fallback to any en-GB voice
        if (!selectedVoice) {
          selectedVoice = voices.find(
            (v) =>
              v.lang === "en-GB" ||
              v.lang.startsWith("en-GB") ||
              v.name.toLowerCase().includes("british") ||
              v.name.toLowerCase().includes("uk")
          )
        }
      } else {
        // Priority list for American voices (most natural first)
        const americanVoiceNames = [
          // Google voices (most natural, online)
          "Google US English Female",
          "Google US English Male",
          "Google US English",
          // Microsoft Natural voices (Windows 11)
          "Microsoft Aria Online (Natural) - English (United States)",
          "Microsoft Jenny Online (Natural) - English (United States)",
          "Microsoft Guy Online (Natural) - English (United States)",
          "Microsoft Ana Online (Natural) - English (United States)",
          // Microsoft Premium voices
          "Microsoft Zira Desktop - English (United States)",
          "Microsoft David Desktop - English (United States)",
          "Microsoft Mark - English (United States)",
          // Fallback voices
          "en-US-AriaNeural",
          "en-US-JennyNeural",
          "en-US-GuyNeural",
        ]

        // Try to find a preferred American voice
        for (const name of americanVoiceNames) {
          selectedVoice = voices.find((v) => v.name === name)
          if (selectedVoice) break
        }

        // Try to find any online/natural voice
        if (!selectedVoice) {
          selectedVoice = voices.find(
            (v) =>
              (v.lang === "en-US" || v.lang.startsWith("en-US")) &&
              (v.name.toLowerCase().includes("natural") ||
                v.name.toLowerCase().includes("online") ||
                v.name.toLowerCase().includes("neural") ||
                v.name.toLowerCase().includes("google"))
          )
        }

        // Fallback to any en-US voice
        if (!selectedVoice) {
          selectedVoice = voices.find(
            (v) =>
              v.lang === "en-US" ||
              v.lang.startsWith("en-US") ||
              v.name.toLowerCase().includes("american") ||
              v.name.toLowerCase().includes("us")
          )
        }
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice
        console.log(
          `Using voice: ${selectedVoice.name} (${selectedVoice.lang})`
        )
      }

      // Optimize for natural speech
      utterance.rate = 0.9
      utterance.pitch = 1.0
      utterance.volume = 1.0

      // Add event listeners for loading state
      utterance.onstart = () => {
        setSpeakingWordId(`${wordId}-${accent}`)
      }

      utterance.onend = () => {
        setSpeakingWordId(null)
      }

      utterance.onerror = () => {
        setSpeakingWordId(null)
      }

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
            disabled={isAmericanSpeaking}
            className={`p-2.5 rounded-lg text-white transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center space-x-1.5 ${
              isAmericanSpeaking
                ? "bg-blue-400 cursor-wait"
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
            disabled={isBritishSpeaking}
            className={`p-2.5 rounded-lg text-white transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center space-x-1.5 ${
              isBritishSpeaking
                ? "bg-indigo-400 cursor-wait"
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
