import { handlers } from "@/lib/auth"

export const { GET, POST } = handlers

// Force Node.js runtime for auth (required for Prisma + bcrypt)
export const runtime = "nodejs"
