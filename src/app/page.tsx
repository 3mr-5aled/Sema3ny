import { StudyLevels } from "@/components/StudyLevels"
import Image from "next/image"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.svg"
            alt="Sema3ny Logo"
            width={120}
            height={120}
            className="w-28 h-28 sm:w-32 sm:h-32"
            priority
          />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          English Vocabulary Guide
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-3">
          Master English vocabulary through structured lessons. Choose your
          study level and start learning with interactive word cards.
        </p>
        <p className="text-md text-gray-500 dark:text-gray-500">
          Taught by{" "}
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            Mr Khaled Morcy
          </span>
        </p>
      </div>

      <StudyLevels />
    </div>
  )
}
