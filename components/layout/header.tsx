"use client"

import Link from "next/link"
import { Plus, Search, User, Upload, LogIn } from "lucide-react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"

export default function Header() {
  const pathname = usePathname()
  const isCreatePage = pathname === "/create"
  const isUploadPage = pathname === "/upload"
  const isAuthPage = pathname.startsWith("/auth")
  const { user } = useAuth()

  if (isAuthPage) return null

  return (
    <header className="w-full p-4 flex justify-between items-center fixed top-0 z-10 bg-black/80 backdrop-blur-sm">
      <Link href="/" className="text-xl font-bold">
        Sports Reels
      </Link>
      <div className="flex items-center gap-3">
        <Link href="/search" className="p-2 rounded-full bg-gray-800">
          <Search className="w-5 h-5" />
        </Link>

        {user ? (
          <>
            {!isUploadPage && (
              <Link href="/upload" className="p-2 rounded-full bg-green-600 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </Link>
            )}

            {!isCreatePage && (
              <Link href="/create" className="p-2 rounded-full bg-blue-600 flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </Link>
            )}

            <Link href="/profile" className="p-2 rounded-full bg-gray-800">
              <User className="w-5 h-5" />
            </Link>
          </>
        ) : (
          <Link href="/auth/login" className="p-2 rounded-full bg-blue-600 flex items-center justify-center">
            <LogIn className="w-5 h-5" />
          </Link>
        )}
      </div>
    </header>
  )
}
