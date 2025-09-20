import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value

  // Define protected paths that require authentication
  const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard")

  // If trying to access a protected route without a token, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If accessing login/signup with a valid token, redirect to dashboard
  if ((request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup") && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
}