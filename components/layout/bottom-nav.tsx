"use client"

import { Home, Search, Plus, User, Upload, LogIn } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMobile } from "@/hooks/use-mobile"
import { useAuth } from "@/context/auth-context"

export default function BottomNav() {
  const pathname = usePathname()
  const isMobile = useMobile()
  const { user } = useAuth()
  const isAuthPage = pathname.startsWith("/auth")

  if (!isMobile || isAuthPage) return null

  return (
    <div className="fixed bottom-0 left-0 w-full bg-black/90 backdrop-blur-sm border-t border-gray-800 z-10">
      <div className="flex justify-around items-center h-16">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center w-full h-full ${pathname === "/" ? "text-blue-500" : "text-gray-400"}`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>

        <Link
          href="/search"
          className={`flex flex-col items-center justify-center w-full h-full ${pathname === "/search" ? "text-blue-500" : "text-gray-400"}`}
        >
          <Search className="w-6 h-6" />
          <span className="text-xs mt-1">Search</span>
        </Link>

        {user ? (
          <>
            <Link
              href="/upload"
              className={`flex flex-col items-center justify-center w-full h-full ${pathname === "/upload" ? "text-green-500" : "text-gray-400"}`}
            >
              <Upload className="w-6 h-6" />
              <span className="text-xs mt-1">Upload</span>
            </Link>

            <Link
              href="/create"
              className={`flex flex-col items-center justify-center w-full h-full ${pathname === "/create" ? "text-blue-500" : "text-gray-400"}`}
            >
              <Plus className="w-6 h-6" />
              <span className="text-xs mt-1">Create</span>
            </Link>

            <Link
              href="/profile"
              className={`flex flex-col items-center justify-center w-full h-full ${pathname.startsWith("/profile") || pathname === "/settings" ? "text-blue-500" : "text-gray-400"}`}
            >
              <User className="w-6 h-6" />
              <span className="text-xs mt-1">Profile</span>
            </Link>
          </>
        ) : (
          <Link
            href="/auth/login"
            className={`flex flex-col items-center justify-center w-full h-full ${pathname.startsWith("/auth") ? "text-blue-500" : "text-gray-400"}`}
          >
            <LogIn className="w-6 h-6" />
            <span className="text-xs mt-1">Login</span>
          </Link>
        )}
      </div>
    </div>
  )
}
