"use client"

import { useState, useRef, useEffect } from "react"
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
  
  // Refs for managing HTML5 audio caching and active audio element
  const audioCacheRef = useRef<Record<string, HTMLAudioElement>>({})
  const activeAudioRef = useRef<HTMLAudioElement | null>(null)

  // Ensure playback and speech are stopped if the component is unmounted,
  // and warm up the speechSynthesis voices list (loaded asynchronously on mobile browsers)
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      // Warm up the voices list early
      window.speechSynthesis.getVoices()
      
      const handleVoicesChanged = () => {
        window.speechSynthesis.getVoices()
      }
      window.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged)
      
      return () => {
        window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged)
        if (activeAudioRef.current) {
          activeAudioRef.current.pause()
        }
        window.speechSynthesis.cancel()
      }
    }

    return () => {
      if (activeAudioRef.current) {
        activeAudioRef.current.pause()
      }
    }
  }, [])

  const speakWordFallback = (
    wordId: number,
    word: string,
    accent: "american" | "british"
  ) => {
    if (!("speechSynthesis" in window)) {
      setSpeakingWordId(null)
      showErrorMessage("Text-to-speech not supported on this device")
      return
    }

    try {
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(word)

      // Store utterance in a global array to prevent GC issues
      const win = window as unknown as { _activeUtterances?: SpeechSynthesisUtterance[] }
      if (!win._activeUtterances) {
        win._activeUtterances = []
      }
      win._activeUtterances.push(utterance)

      const targetLang = accent === "british" ? "en-GB" : "en-US"
      utterance.lang = targetLang

      // Find local high-quality voices to prevent Microsoft Edge from calling
      // online neural voices that might fail with 'synthesis-failed'
      const voices = window.speechSynthesis.getVoices()
      let targetVoice = null

      if (voices && voices.length > 0) {
        const isOnlineVoice = (name: string) =>
          name.toLowerCase().includes("online") ||
          name.toLowerCase().includes("natural") ||
          name.toLowerCase().includes("neural")

        // 1. Get matching target language voices (e.g., en-GB)
        const targetLangLower = targetLang.toLowerCase()
        let matchingVoices = voices.filter((v) => {
          const vLang = v.lang.toLowerCase().replace("_", "-")
          return vLang === targetLangLower || vLang.startsWith(targetLangLower)
        })

        // 2. If no exact accent match (e.g., en-GB not installed on mobile), fall back to any English voice
        if (matchingVoices.length === 0) {
          matchingVoices = voices.filter((v) => {
            const vLang = v.lang.toLowerCase().replace("_", "-")
            return vLang === "en" || vLang.startsWith("en-")
          })
        }

        if (matchingVoices.length > 0) {
          // A. First choice: Local/offline voices that do NOT have online keywords in their name
          let filteredVoices = matchingVoices.filter(
            (v) => v.localService && !isOnlineVoice(v.name)
          )

          // B. Second choice: Any matching voices of target accent that do NOT have online keywords
          if (filteredVoices.length === 0) {
            filteredVoices = matchingVoices.filter((v) => !isOnlineVoice(v.name))
          }

          // C. Third choice: Local/offline voices even if they have online keywords in their name
          if (filteredVoices.length === 0) {
            filteredVoices = matchingVoices.filter((v) => v.localService)
          }

          // D. Fallback: Any matching target-accent voice
          const sourceVoices = filteredVoices.length > 0 ? filteredVoices : matchingVoices

          if (sourceVoices.length > 0) {
            if (accent === "british") {
              // Explicitly check for preferred British voices: Ryan or Thomas!
              targetVoice =
                matchingVoices.find((v) => v.name.includes("Ryan")) ||
                matchingVoices.find((v) => v.name.includes("Thomas")) ||
                sourceVoices.find(
                  (v) =>
                    v.name.includes("Hazel") ||
                    v.name.includes("Susan") ||
                    v.name.includes("George") ||
                    v.name.includes("Great Britain")
                ) || sourceVoices[0]
            } else {
              // Explicitly check for preferred American voices: Andrew, Brian, or Eric!
              targetVoice =
                matchingVoices.find((v) => v.name.includes("Andrew")) ||
                matchingVoices.find((v) => v.name.includes("Brian")) ||
                matchingVoices.find((v) => v.name.includes("Eric")) ||
                sourceVoices.find(
                  (v) =>
                    v.name.includes("Zira") ||
                    v.name.includes("David") ||
                    v.name.includes("Google") ||
                    v.name.includes("United States")
                ) || sourceVoices[0]
            }
          }
        }
      }

      if (targetVoice) {
        utterance.voice = targetVoice
        console.log(`Fallback TTS selected voice: ${targetVoice.name} (${targetVoice.lang}) local=${targetVoice.localService}`)
      } else {
        console.log(`Fallback TTS: No matching voice found in getVoices() for ${targetLang}. Relying on browser language selection fallback.`)
      }

      utterance.rate = 0.9
      utterance.pitch = 1.0
      utterance.volume = 1.0

      utterance.onend = () => {
        setSpeakingWordId(null)
        if (win._activeUtterances) {
          win._activeUtterances = win._activeUtterances.filter((u) => u !== utterance)
        }
      }

      utterance.onerror = (event) => {
        if (win._activeUtterances) {
          win._activeUtterances = win._activeUtterances.filter((u) => u !== utterance)
        }

        if (event.error === "interrupted" || event.error === "canceled") {
          console.log(`Fallback TTS interrupted normally: ${event.error}`)
          return
        }

        console.error("Fallback TTS synthesis error:", event.error || event)
        setSpeakingWordId(null)
        showErrorMessage(
          accent === "british"
            ? "British accent isn't available right now"
            : "American accent isn't available right now"
        )
      }

      window.speechSynthesis.speak(utterance)
    } catch (fallbackErr) {
      console.error("Fallback TTS error:", fallbackErr)
      setSpeakingWordId(null)
      showErrorMessage(
        accent === "british"
          ? "British accent isn't available right now"
          : "American accent isn't available right now"
      )
    }
  }

  const speakWord = (
    wordId: number,
    word: string,
    accent: "american" | "british"
  ) => {
    // 1. Cancel any playing Web Speech API utterances
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }

    // 2. Stop any active HTML5 audio element playing
    if (activeAudioRef.current) {
      activeAudioRef.current.pause()
      activeAudioRef.current.currentTime = 0
    }

    // 3. Mark state as speaking
    const speakingId = `${wordId}-${accent}`
    setSpeakingWordId(speakingId)

    const cacheKey = `${word.toLowerCase()}-${accent}`

    // 4. Primary Method: Google Translate TTS API via HTML5 Audio
    try {
      let audio = audioCacheRef.current[cacheKey]

      if (!audio) {
        const langCode = accent === "british" ? "en-GB" : "en-US"
        const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${langCode}&client=tw-ob&q=${encodeURIComponent(
          word
        )}`
        audio = new Audio(googleTtsUrl)
        audioCacheRef.current[cacheKey] = audio
      }

      activeAudioRef.current = audio

      audio.onended = () => {
        if (activeAudioRef.current === audio) {
          setSpeakingWordId(null)
          activeAudioRef.current = null
        }
      }

      audio.onerror = (err) => {
        console.warn(`Primary Google TTS failed for "${word}" (${accent}), trying native fallback...`, err)
        if (activeAudioRef.current === audio) {
          activeAudioRef.current = null
        }
        speakWordFallback(wordId, word, accent)
      }

      audio.play().catch((playErr) => {
        console.warn(`HTML5 Play prevented for "${word}" (${accent}), trying native fallback...`, playErr)
        if (activeAudioRef.current === audio) {
          activeAudioRef.current = null
        }
        speakWordFallback(wordId, word, accent)
      })
    } catch (err) {
      console.warn("HTML5 audio setup error, falling back to native TTS:", err)
      speakWordFallback(wordId, word, accent)
    }
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
  // Disable ALL buttons when ANY word is being read aloud
  const isAnySpeaking = speakingWordId !== null

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-md hover:border-blue-500/20 transition-all duration-300 p-6 border border-gray-100 dark:border-gray-800 group">
      {/* English Word */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          {word.en}
        </h3>

        {/* Two Pronunciation Buttons - American & British */}
        <div className="flex space-x-2">
          <button
            onClick={() => onSpeak(word.id, word.en, "american")}
            disabled={isAnySpeaking}
            className={`p-2.5 rounded-lg text-white transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 flex items-center space-x-1.5 ${
              isAmericanSpeaking
                ? "bg-blue-400 cursor-wait"
                : isAnySpeaking
                ? "bg-blue-300 cursor-not-allowed opacity-40"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            title="American pronunciation"
          >
            <USFlag className="w-5 h-3 shadow-xs" />
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
              <FaVolumeUp className="h-3.5 w-3.5 text-white/95" />
            )}
          </button>
          <button
            onClick={() => onSpeak(word.id, word.en, "british")}
            disabled={isAnySpeaking}
            className={`p-2.5 rounded-lg text-white transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 flex items-center space-x-1.5 ${
              isBritishSpeaking
                ? "bg-green-400 cursor-wait"
                : isAnySpeaking
                ? "bg-green-300 cursor-not-allowed opacity-40"
                : "bg-green-500 hover:bg-green-600"
            }`}
            title="British pronunciation"
          >
            <UKFlag className="w-5 h-3 shadow-xs" />
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
              <FaVolumeUp className="h-3.5 w-3.5 text-white/95" />
            )}
          </button>
        </div>
      </div>

      {/* Arabic Translation */}
      <div className="mb-4">
        <p
          className="text-lg sm:text-xl font-bold text-gray-700 dark:text-gray-300 arabic-text"
          dir="rtl"
          lang="ar"
        >
          {word.ar}
        </p>
      </div>

      {/* Part of Speech Tag */}
      <div className="flex justify-start">
        <span
          className={`px-3 py-1 rounded-[6px] text-xs font-semibold tracking-wider uppercase ${partColor}`}
        >
          {partLabel}
        </span>
      </div>
    </div>
  )
}
