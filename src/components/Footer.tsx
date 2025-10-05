export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              <strong>Sema3ny</strong> - English Vocabulary Guide
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">
              Teacher: <span className="font-medium">Mr Khaled Morcy</span>
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">
              Phone: 01023144722
            </p>
          </div>

          <div className="text-center md:text-right">
            <p className="text-gray-500 dark:text-gray-500 text-sm">
              Developed by{" "}
              <a
                href="https://3mr5aled.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
              >
                3mr 5aled
              </a>
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-gray-400 dark:text-gray-600 text-xs">
            © {new Date().getFullYear()} Sema3ny. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
