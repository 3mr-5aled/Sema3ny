"use client"

import Link from "next/link"

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-950 dark:via-gray-900 dark:to-green-950/20 p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center border border-blue-100 dark:border-blue-900/30">
            <svg
              className="w-12 h-12 text-blue-500 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            You&apos;re Offline
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm">
            It looks like you&apos;re not connected to the internet. Some
            features may not be available.
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
            <p className="text-xs font-semibold text-blue-800 dark:text-blue-300">
              💡 <strong>Tip:</strong> You can still browse previously visited
              lessons while offline!
            </p>
          </div>

          <Link
            href="/"
            className="inline-block w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors shadow-sm text-sm"
          >
            Go to Homepage
          </Link>

          <button
            onClick={() => window.location.reload()}
            className="w-full px-6 py-3 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-sm cursor-pointer"
          >
            Try Again
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200/50 dark:border-gray-800/50">
          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
            Connection will be restored automatically when you&apos;re back
            online.
          </p>
        </div>
      </div>
    </div>
  )
}
