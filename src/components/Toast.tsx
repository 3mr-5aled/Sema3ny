"use client"

import { useEffect } from "react"
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa"

export type ToastType = "success" | "error" | "info"

export interface ToastMessage {
  id: string
  type: ToastType
  title: string
  message: string
}

interface ToastProps {
  toast: ToastMessage
  onClose: (id: string) => void
}

export function Toast({ toast, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id)
    }, 5000) // Auto-dismiss after 5 seconds

    return () => clearTimeout(timer)
  }, [toast.id, onClose])

  const getToastStyles = () => {
    switch (toast.type) {
      case "success":
        return {
          bg: "bg-green-50 dark:bg-green-900/20 border-green-500",
          icon: <FaCheckCircle className="text-green-500" size={20} />,
          titleColor: "text-green-800 dark:text-green-200",
          messageColor: "text-green-700 dark:text-green-300",
        }
      case "error":
        return {
          bg: "bg-red-50 dark:bg-red-900/20 border-red-500",
          icon: <FaExclamationCircle className="text-red-500" size={20} />,
          titleColor: "text-red-800 dark:text-red-200",
          messageColor: "text-red-700 dark:text-red-300",
        }
      case "info":
        return {
          bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-500",
          icon: <FaInfoCircle className="text-blue-500" size={20} />,
          titleColor: "text-blue-800 dark:text-blue-200",
          messageColor: "text-blue-700 dark:text-blue-300",
        }
    }
  }

  const styles = getToastStyles()

  return (
    <div
      className={`${styles.bg} border-l-4 rounded-lg shadow-lg p-4 mb-3 animate-slideIn flex items-start space-x-3 min-w-[320px] max-w-md`}
    >
      <div className="flex-shrink-0 mt-0.5">{styles.icon}</div>
      <div className="flex-1 min-w-0">
        <p className={`font-semibold ${styles.titleColor}`}>{toast.title}</p>
        <p className={`text-sm ${styles.messageColor} mt-1`}>{toast.message}</p>
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        aria-label="Close notification"
      >
        <FaTimes size={16} />
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: ToastMessage[]
  onClose: (id: string) => void
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[100] pointer-events-none">
      <div className="pointer-events-auto space-y-3">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={onClose} />
        ))}
      </div>
    </div>
  )
}
