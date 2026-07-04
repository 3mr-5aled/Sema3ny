import type { Metadata } from "next"
import { Inter, Cairo } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { AuthProvider } from "@/components/AuthProvider"
import { NetworkStatusBanner } from "@/components/NetworkStatusBanner"
import { PWAInstaller } from "@/components/PWAInstaller"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
  display: "swap",
})

export const metadata: Metadata = {
  title: "EntQha (انطقها) - English Vocabulary Guide",
  description:
    "Master English vocabulary and pronunciation with EntQha (انطقها) through interactive word cards and text-to-speech.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EntQha",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/app-icon.png", type: "image/png" },
      { url: "/launchericon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/launchericon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/launchericon-192x192.png", sizes: "192x192", type: "image/png" }],
    shortcut: [{ url: "/app-icon.png", type: "image/png" }],
  },
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" dir="ltr" className="scroll-smooth">
      <head>
        <meta name="theme-color" content="#6D28D9" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="EntQha" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/launchericon-192x192.png" />
      </head>
      <body
        className={`${inter.variable} ${cairo.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <PWAInstaller />
          <NetworkStatusBanner />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
