import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes (student-facing pages and APIs)
  const publicPaths = [
    "/",
    "/login",
    "/dashboard",
    "/levels",
    "/api/auth",
    "/api/levels",
    "/api/units",
    "/api/lessons",
    "/api/words",
    "/offline",
    "/_next",
    "/favicon.ico",
    "/logo.svg",
    "/manifest.json",
    "/service-worker.js",
  ]

  // Check if current path is public (GET requests for read-only data)
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path))
  const isReadOnlyApiRequest =
    pathname.startsWith("/api/") && request.method === "GET"

  // Allow public paths and read-only API requests
  if (isPublicPath || isReadOnlyApiRequest) {
    return NextResponse.next()
  }

  // For protected routes, check session cookie
  const sessionCookie =
    request.cookies.get("authjs.session-token") ||
    request.cookies.get("__Secure-authjs.session-token")

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Protect write API operations
  if (pathname.startsWith("/api/")) {
    const isWriteOperation = ["POST", "PUT", "DELETE", "PATCH"].includes(
      request.method
    )
    if (isWriteOperation && !sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
}
