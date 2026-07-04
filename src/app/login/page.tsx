"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { FaLock, FaEnvelope, FaSpinner } from "react-icons/fa"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
      } else {
        router.push("/gatekeeper")
        router.refresh()
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 py-12 px-4 relative overflow-hidden font-sans">
      {/* Modern dynamic mesh background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(109,40,217,0.15),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(16,185,129,0.12),transparent_45%)] pointer-events-none" />
      
      {/* Floating glassmorphic ambient light orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/10 blur-[130px] animate-pulse pointer-events-none" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-green-500/8 blur-[130px] animate-pulse pointer-events-none" style={{ animationDuration: '12s' }} />

      {/* Educational decorative floating elements with micro-animations */}
      <div className="absolute top-12 left-12 text-4xl opacity-20 hover:opacity-45 hover:scale-110 transition-all duration-300 cursor-default select-none animate-bounce" style={{ animationDuration: '4s' }}>📝</div>
      <div className="absolute bottom-12 right-12 text-4xl opacity-20 hover:opacity-45 hover:scale-110 transition-all duration-300 cursor-default select-none animate-bounce" style={{ animationDuration: '6s' }}>📚</div>
      <div className="absolute top-1/4 right-[12%] text-5xl opacity-20 hover:opacity-45 hover:scale-110 transition-all duration-300 cursor-default select-none animate-pulse" style={{ animationDuration: '5s' }}>🎓</div>
      <div className="absolute bottom-1/4 left-[12%] text-5xl opacity-20 hover:opacity-45 hover:scale-110 transition-all duration-300 cursor-default select-none animate-pulse" style={{ animationDuration: '7s' }}>💡</div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white/95 dark:bg-gray-950/95 backdrop-blur-md rounded-lg shadow-2xl p-8 sm:p-10 border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-block p-3.5 bg-blue-50 dark:bg-blue-950/40 rounded-full mb-4 ring-4 ring-blue-500/10">
              <FaLock className="text-3xl text-blue-500" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Teacher Login
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
              Sign in to access your educator dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400 text-sm font-semibold">
                  ⚠️ {error}
                </p>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm font-medium"
                  placeholder="admin@vocabguide.com"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm font-medium"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500">
            Forgot password? Contact system administrator.
          </p>
        </div>
      </div>
    </div>
  )
}
