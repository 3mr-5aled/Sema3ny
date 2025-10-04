import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    if (!req.auth) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  // Protect write API routes (POST, PUT, DELETE, PATCH)
  if (pathname.startsWith("/api/")) {
    const method = req.method
    const isWriteOperation = ["POST", "PUT", "DELETE", "PATCH"].includes(method)

    if (isWriteOperation && !req.auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/levels/:path*",
    "/api/units/:path*",
    "/api/lessons/:path*",
    "/api/words/:path*",
  ],
}
