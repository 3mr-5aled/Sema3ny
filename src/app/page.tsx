import { StudyLevels } from "@/components/StudyLevels"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          English Vocabulary Guide
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Master English vocabulary through structured lessons. Choose your
          study level and start learning with interactive word cards.
        </p>
      </div>

      <StudyLevels />
    </div>
  )
}
