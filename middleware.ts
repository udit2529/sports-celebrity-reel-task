import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Check if the user is authenticated
  const user = request.cookies.get("user")

  // For now, we'll just check if the path requires authentication
  // In a real app, you would verify the user's session
  const protectedPaths = ["/create", "/upload", "/profile", "/settings"]

  const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  if (isProtectedPath && !user) {
    // Redirect to login page if not authenticated
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/create/:path*", "/upload/:path*", "/profile/:path*", "/settings/:path*"],
}
