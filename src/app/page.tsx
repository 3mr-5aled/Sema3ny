import { StudyLevels } from "@/components/StudyLevels"
import Image from "next/image"
import { FaGraduationCap } from "react-icons/fa"

export default function Home() {
  return (
    <div className="relative overflow-hidden py-12 md:py-16">
      {/* Premium educational decorative accent shapes */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-blue-500/5 via-green-400/5 to-yellow-300/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute top-20 left-[10%] w-32 h-32 bg-blue-400/10 rounded-full blur-xl pointer-events-none -z-10 animate-pulse duration-[8000ms]"></div>
      <div className="absolute bottom-20 right-[10%] w-40 h-40 bg-green-400/10 rounded-full blur-xl pointer-events-none -z-10 animate-pulse duration-[6000ms]"></div>

      <div className="container mx-auto px-4 max-w-7xl">
        {/* Creative Hero Section */}
        <div className="text-center mb-16">
          {/* Logo directly in hero */}
          <div className="flex justify-center mb-8">
            <div className="relative hover:scale-105 transition-transform duration-500 group">
              <Image
                src="/logo.png"
                alt="EntQha Logo"
                width={160}
                height={160}
                className="w-36 h-36 sm:w-40 sm:h-40 object-contain"
                priority
              />
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/30 mb-5">
            <FaGraduationCap className="text-sm" />
            <span>EXCELLENCE IN EDUCATION</span>
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
            English{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 dark:from-blue-400 dark:to-green-400">
              Vocabulary Guide
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6 leading-relaxed">
            Master English vocabulary through structured lessons. Choose your
            study level and start learning with interactive word cards.
          </p>

          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Taught by
            </span>
            <span className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1">
              Mr Khaled Morcy
              <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
            </span>
          </div>
        </div>

        {/* Study Levels Grid */}
        <div className="relative pt-4">
          <div
            className="absolute inset-0 flex items-center pointer-events-none"
            aria-hidden="true"
          >
            <div className="w-full border-t border-gray-200/60 dark:border-gray-800/60"></div>
          </div>
          <div className="relative flex justify-center mb-10">
            <span className="px-6 bg-gray-50 dark:bg-gray-950 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Select Your Study Level
            </span>
          </div>

          <StudyLevels />
        </div>
      </div>
    </div>
  )
}
