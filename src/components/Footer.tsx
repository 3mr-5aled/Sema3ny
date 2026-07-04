export function Footer() {
  return (
    <footer className="relative bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900 mt-auto">
      {/* Subtle top border color strip */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-green-400 to-yellow-400"></div>

      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="text-center md:text-left">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white flex items-center justify-center md:justify-start gap-2">
              <span className="text-blue-500">EntQha (انطقها)</span>
              <span className="text-gray-400 dark:text-gray-600 font-normal">
                |
              </span>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                English Vocabulary Guide
              </span>
            </h4>
            <div className="mt-2.5 space-y-1">
              <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center justify-center md:justify-start gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400"></span>
                <span>
                  Teacher:{" "}
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    Mr Khaled Morcy
                  </span>
                </span>
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center justify-center md:justify-start gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>
                  WhatsApp:{" "}
                  <a
                    href="https://wa.me/201023144722"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline transition-colors"
                  >
                    Contact on WhatsApp
                  </a>
                </span>
              </p>
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Developed with ❤️ by{" "}
              <a
                href="https://3mr5aled.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-semibold underline decoration-2 underline-offset-4 decoration-blue-500/20 hover:decoration-blue-500 transition-all"
              >
                3mr 5aled
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-900">
          <p className="text-center text-gray-400 dark:text-gray-600 text-xs font-medium">
            © {new Date().getFullYear()} EntQha. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
