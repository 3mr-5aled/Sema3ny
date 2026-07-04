"use client"

import Link from "next/link"
import Image from "next/image"

export function Navbar() {
  return (
    <nav className="sticky top-0 z-40 glass-effect border-b border-gray-200/80 dark:border-gray-800/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <Image
                src="/nav-logo.png"
                alt="EntQha Logo"
                width={140}
                height={40}
                className="h-10 w-auto transition-transform group-hover:scale-[1.02] duration-200"
                priority
              />
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-blue-50 dark:hover:bg-blue-950/30"
            >
              Study Levels
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
