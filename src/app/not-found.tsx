import Link from "next/link"
import Image from "next/image"
import { FaHome, FaBook } from "react-icons/fa"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/logo.svg"
            alt="Sema3ny Logo"
            width={120}
            height={120}
            className="opacity-70 dark:opacity-70"
          />
        </div>

        {/* 404 with creative styling */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 animate-pulse">
            404
          </h1>
        </div>

        {/* Message */}
        <div className="mb-8 space-y-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Oops! Page Not Found
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            📚 Looks like this page is still learning to exist!
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            The page you&apos;re looking for has wandered off or never existed.
          </p>
        </div>

        {/* Creative vocabulary lesson */}
        <div className="mb-12 p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur rounded-2xl border-2 border-purple-200 dark:border-purple-700 shadow-xl">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <FaBook className="text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Quick Vocabulary Lesson!
            </h3>
          </div>
          <div className="text-left max-w-md mx-auto">
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              <span className="font-bold text-purple-600 dark:text-purple-400">
                Lost
              </span>{" "}
              (adj.) -{" "}
              <span className="text-gray-600 dark:text-gray-400 arabic-text">
                ضائع
              </span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              &quot;You&apos;re not lost, you&apos;re just exploring!&quot;
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <FaHome className="text-xl" />
            <span>Go Home</span>
          </Link>
        </div>

        {/* Fun fact */}
        <div className="mt-12 text-sm text-gray-500 dark:text-gray-400">
          <p className="mb-2">
            💡 <strong>Fun Fact:</strong>
          </p>
          <p>
            The HTTP 404 status code means &quot;Not Found&quot; - it&apos;s
            been helping us find things that don&apos;t exist since 1992!
          </p>
        </div>
      </div>
    </div>
  )
}
