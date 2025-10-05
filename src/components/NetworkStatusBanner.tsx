/**
 * Network Status Banner
 *
 * Displays a banner when the user goes offline
 * and a success message when they come back online.
 */

"use client"

import { useNetworkStatus } from "@/hooks/useNetworkStatus"
import { FaWifi, FaExclamationTriangle } from "react-icons/fa"

export const NetworkStatusBanner = () => {
  const { isOnline, isOffline, wasOffline } = useNetworkStatus()

  // Don't show anything if online and wasn't offline
  if (isOnline && !wasOffline) {
    return null
  }

  return (
    <>
      {/* Offline Banner */}
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white px-4 py-3 shadow-lg animate-slide-down">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
            <FaExclamationTriangle className="text-xl flex-shrink-0" />
            <div className="flex-1 text-center">
              <p className="font-semibold">No Internet Connection</p>
              <p className="text-sm text-red-100">
                You&apos;re offline. Changes will be saved when you reconnect.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Back Online Banner */}
      {wasOffline && isOnline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-green-600 text-white px-4 py-3 shadow-lg animate-slide-down">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
            <FaWifi className="text-xl flex-shrink-0" />
            <div className="flex-1 text-center">
              <p className="font-semibold">Back Online</p>
              <p className="text-sm text-green-100">
                Your internet connection has been restored.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
