# Phase 7: Security & Authentication Implementation Guide

## 🎯 Overview
Implement a secure authentication system for the teacher dashboard while keeping student pages publicly accessible.

**Duration:** 2-3 weeks  
**Current Status:** Starting Implementation

---

## 🏗️ Architecture Design

### Authentication Strategy
- **NextAuth.js** (Auth.js v5) - Industry-standard authentication for Next.js
- **Credentials Provider** - Username/password authentication
- **Session-based** - Secure server-side sessions
- **Route Protection** - Middleware to protect admin routes

### User Roles
1. **Admin** - Full access to teacher dashboard
2. **Teacher** (Future) - Limited access to own content
3. **Student** - No authentication needed (public access)

### Security Measures
- ✅ Password hashing with bcrypt
- ✅ HTTP-only cookies for session tokens
- ✅ CSRF protection (built into NextAuth)
- ✅ Rate limiting for login attempts
- ✅ Secure session management
- ✅ Environment variables for secrets

---

## 📦 Required Packages

```bash
npm install next-auth@beta bcryptjs
npm install -D @types/bcryptjs
```

**Why these packages?**
- `next-auth@beta` - Next.js 15 compatible authentication (v5)
- `bcryptjs` - Password hashing
- `@types/bcryptjs` - TypeScript types for bcrypt

---

## 🗄️ Database Schema Updates

### Add User Model to Prisma Schema

```prisma
// prisma/schema.prisma

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String    // Hashed password
  role          String    @default("teacher") // "admin" or "teacher"
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  lastLogin     DateTime?
  
  @@map("users")
}
```

### Migration Command
```bash
npx prisma migrate dev --name add_user_authentication
```

---

## 🔐 Implementation Steps

### Step 1: Install Dependencies

```bash
npm install next-auth@beta bcryptjs
npm install -D @types/bcryptjs
```

### Step 2: Update Environment Variables

Add to `.env`:
```env
# Authentication
AUTH_SECRET="your-super-secret-key-change-this-in-production"
AUTH_URL="http://localhost:3000"

# Default Admin User (for initial setup)
DEFAULT_ADMIN_EMAIL="admin@vocabguide.com"
DEFAULT_ADMIN_PASSWORD="ChangeMe123!"
```

**Generate AUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Step 3: Create NextAuth Configuration

**File:** `src/lib/auth.ts`

```typescript
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() }
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    }
  }
})
```

### Step 4: Create Auth API Route

**File:** `src/app/api/auth/[...nextauth]/route.ts`

```typescript
import { handlers } from "@/lib/auth"

export const { GET, POST } = handlers
```

### Step 5: Create Middleware for Route Protection

**File:** `src/middleware.ts`

```typescript
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

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/levels/:path*",
    "/api/units/:path*",
    "/api/lessons/:path*",
    "/api/words/:path*"
  ]
}
```

### Step 6: Create Login Page

**File:** `src/app/login/page.tsx`

```typescript
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
        redirect: false
      })

      if (result?.error) {
        setError("Invalid email or password")
      } else {
        router.push("/admin")
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
              <FaLock className="text-4xl text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Teacher Login
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Sign in to access the dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {error}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="admin@vocabguide.com"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
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

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Forgot password? Contact administrator
          </p>
        </div>
      </div>
    </div>
  )
}
```

### Step 7: Update Admin Dashboard with Logout

**File:** `src/components/TeacherDashboard.tsx` (Add logout button)

```typescript
import { signOut } from "next-auth/react"

// Add to header section
<div className="flex items-center justify-between">
  <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
  <div className="flex items-center gap-4">
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
    >
      Logout
    </button>
    <button
      onClick={clearAllData}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
    >
      Clear All Data
    </button>
  </div>
</div>
```

### Step 8: Create User Seeding Script

**File:** `prisma/seed-admin.ts`

```typescript
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash("ChangeMe123!", 10)

  const admin = await prisma.user.upsert({
    where: { email: "admin@vocabguide.com" },
    update: {},
    create: {
      email: "admin@vocabguide.com",
      name: "Administrator",
      password: hashedPassword,
      role: "admin"
    }
  })

  console.log("✅ Admin user created:", admin.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

**Run seeder:**
```bash
npx tsx prisma/seed-admin.ts
```

### Step 9: Protect API Routes

**Example:** `src/app/api/levels/route.ts`

```typescript
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
  // Public endpoint - no auth needed for students
  // ...existing code...
}

export async function POST(request: Request) {
  // Protect write operations
  const session = await auth()
  
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  // ...existing code...
}
```

---

## 🧪 Testing Checklist

### Authentication Flow
- [ ] Can access login page
- [ ] Login with correct credentials succeeds
- [ ] Login with wrong credentials fails
- [ ] Session persists after page refresh
- [ ] Logout works correctly
- [ ] Protected routes redirect to login when not authenticated
- [ ] Protected routes accessible when authenticated

### Security
- [ ] Passwords are hashed in database
- [ ] Session tokens are HTTP-only cookies
- [ ] CSRF protection works
- [ ] Rate limiting prevents brute force (if implemented)
- [ ] Invalid tokens are rejected

### User Experience
- [ ] Login form validates inputs
- [ ] Error messages are user-friendly
- [ ] Loading states during login
- [ ] Redirect to intended page after login
- [ ] Remember me functionality (if implemented)

---

## 🚀 Deployment Checklist

- [ ] Generate new AUTH_SECRET for production
- [ ] Update AUTH_URL to production domain
- [ ] Change default admin password
- [ ] Enable rate limiting
- [ ] Set up SSL/HTTPS
- [ ] Configure secure cookie settings
- [ ] Add password reset functionality
- [ ] Implement 2FA (optional)

---

## 📝 Next Steps After Authentication

1. **Rate Limiting** - Prevent brute force attacks
2. **Password Reset** - Email-based password recovery
3. **User Management UI** - Admin panel for managing users
4. **Role-Based Access** - Different permissions for admin/teacher
5. **Audit Logs** - Track admin actions
6. **2FA** - Two-factor authentication for extra security

---

*Ready to implement secure authentication! 🔐*
