import Link from "next/link"
import Image from "next/image"
import { FaHome, FaBook } from "react-icons/fa"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-green-50/50 to-yellow-50 dark:from-gray-950 dark:via-gray-900 dark:to-green-950/20 px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/logo.png"
            alt="EntQha Logo"
            width={100}
            height={100}
            className="opacity-80 dark:opacity-85 object-contain"
          />
        </div>

        {/* 404 with creative styling */}
        <div className="mb-8">
          <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-green-500 to-yellow-400 dark:from-blue-400 dark:via-green-400 dark:to-yellow-400 animate-pulse tracking-tighter">
            404
          </h1>
        </div>

        {/* Message */}
        <div className="mb-8 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            📚 Looks like this page is still learning to exist!
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            The page you&apos;re looking for has wandered off or never existed.
          </p>
        </div>

        {/* Creative vocabulary lesson */}
        <div className="mb-12 p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur rounded-lg border border-blue-100 dark:border-blue-900/30 shadow-sm max-w-md mx-auto">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <FaBook className="text-blue-500 dark:text-blue-400" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Quick Vocabulary Lesson!
            </h3>
          </div>
          <div className="text-left">
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              <span className="font-bold text-blue-500 dark:text-blue-400">
                Lost
              </span>{" "}
              (adj.) -{" "}
              <span
                className="font-bold text-gray-800 dark:text-gray-200 arabic-text"
                dir="rtl"
                lang="ar"
              >
                ضائع
              </span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 italic">
              &quot;You&apos;re not lost, you&apos;re just exploring!&quot;
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-8 py-3.5 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm cursor-pointer"
          >
            <FaHome className="text-lg" />
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
