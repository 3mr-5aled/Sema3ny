/**
 * Network Status Hook
 *
 * Monitors online/offline status and provides utilities
 * for handling network connectivity in React components.
 */

"use client"

import { useState, useEffect } from "react"

export interface NetworkStatus {
  isOnline: boolean
  isOffline: boolean
  wasOffline: boolean // True if was offline and just came back online
}

/**
 * Hook to monitor network status
 *
 * @returns NetworkStatus object with online/offline state
 *
 * @example
 * ```tsx
 * const { isOnline, isOffline, wasOffline } = useNetworkStatus()
 *
 * if (isOffline) {
 *   return <div>You are offline</div>
 * }
 *
 * if (wasOffline) {
 *   // Show "Back online" message
 * }
 * ```
 */
export const useNetworkStatus = (): NetworkStatus => {
  const [isOnline, setIsOnline] = useState(true)
  const [wasOffline, setWasOffline] = useState(false)

  useEffect(() => {
    // Check initial status
    const initialStatus = typeof navigator !== "undefined" && navigator.onLine
    setIsOnline(initialStatus)

    // Handle online event
    const handleOnline = () => {
      console.log("Network: Online")
      setIsOnline(true)
      setWasOffline(true)

      // Clear "was offline" flag after 5 seconds
      setTimeout(() => {
        setWasOffline(false)
      }, 5000)
    }

    // Handle offline event
    const handleOffline = () => {
      console.log("Network: Offline")
      setIsOnline(false)
      setWasOffline(false)
    }

    // Add event listeners
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Cleanup
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return {
    isOnline,
    isOffline: !isOnline,
    wasOffline,
  }
}

/**
 * Hook for network-aware operations
 *
 * Provides utilities for handling operations that require network
 *
 * @example
 * ```tsx
 * const { executeWhenOnline, isNetworkError } = useNetworkOperations()
 *
 * const handleSave = async () => {
 *   await executeWhenOnline(async () => {
 *     await saveData()
 *   })
 * }
 * ```
 */
export const useNetworkOperations = () => {
  const { isOnline } = useNetworkStatus()

  /**
   * Execute a function only when online
   * If offline, waits for connection before executing
   */
  const executeWhenOnline = async <T>(
    operation: () => Promise<T>
  ): Promise<T> => {
    if (!isOnline) {
      console.log("Waiting for network connection...")
      await new Promise<void>((resolve) => {
        const checkOnline = () => {
          if (navigator.onLine) {
            window.removeEventListener("online", checkOnline)
            resolve()
          }
        }
        window.addEventListener("online", checkOnline)
      })
    }

    return operation()
  }

  /**
   * Check if an error is a network error
   */
  const isNetworkError = (error: unknown): boolean => {
    if (error instanceof Error) {
      return (
        error.message.includes("fetch") ||
        error.message.includes("network") ||
        error.message.includes("timeout") ||
        error.message.includes("Failed to fetch") ||
        error.name === "NetworkError" ||
        error.name === "AbortError"
      )
    }
    return false
  }

  return {
    isOnline,
    executeWhenOnline,
    isNetworkError,
  }
}
