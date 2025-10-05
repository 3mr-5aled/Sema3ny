"use client"

import { useEffect } from "react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PWAInstaller() {
  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((registration) => {
            console.log("✅ Service Worker registered:", registration.scope)

            // Check for updates periodically
            setInterval(() => {
              registration.update()
            }, 60 * 60 * 1000) // Check every hour

            // Listen for updates
            registration.addEventListener("updatefound", () => {
              const newWorker = registration.installing
              if (newWorker) {
                newWorker.addEventListener("statechange", () => {
                  if (
                    newWorker.state === "installed" &&
                    navigator.serviceWorker.controller
                  ) {
                    // New service worker available
                    if (confirm("New version available! Reload to update?")) {
                      newWorker.postMessage({ type: "SKIP_WAITING" })
                      window.location.reload()
                    }
                  }
                })
              }
            })
          })
          .catch((error) => {
            console.error("❌ Service Worker registration failed:", error)
          })

        // Handle service worker updates
        let refreshing = false
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          if (!refreshing) {
            refreshing = true
            window.location.reload()
          }
        })
      })
    }

    // Handle install prompt
    let deferredPrompt: BeforeInstallPromptEvent | null = null

    window.addEventListener("beforeinstallprompt", (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later
      deferredPrompt = e as BeforeInstallPromptEvent

      // Show install button (you can customize this UI)
      console.log("💡 PWA install prompt available")

      // Optional: Show a custom install button
      const installButton = document.getElementById("pwa-install-button")
      if (installButton) {
        installButton.style.display = "block"
        installButton.addEventListener("click", async () => {
          if (deferredPrompt) {
            deferredPrompt.prompt()
            const { outcome } = await deferredPrompt.userChoice
            console.log(`User response to install prompt: ${outcome}`)
            deferredPrompt = null
            installButton.style.display = "none"
          }
        })
      }
    })

    window.addEventListener("appinstalled", () => {
      console.log("✅ PWA installed successfully")
      deferredPrompt = null
    })

    // Detect if app is running as PWA
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches
    const isInStandaloneMode =
      (navigator as { standalone?: boolean }).standalone || isStandalone

    if (isInStandaloneMode) {
      console.log("🚀 Running as PWA")
      document.documentElement.classList.add("pwa-mode")
    }

    // Network status
    const updateOnlineStatus = () => {
      if (navigator.onLine) {
        console.log("🌐 Back online")
      } else {
        console.log("📴 Offline")
      }
    }

    window.addEventListener("online", updateOnlineStatus)
    window.addEventListener("offline", updateOnlineStatus)

    return () => {
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
    }
  }, [])

  return null
}
