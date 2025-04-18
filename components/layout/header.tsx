"use client"

import Link from "next/link"
import { Plus, Search } from "lucide-react"
import { usePathname } from "next/navigation"

export default function Header() {
  const pathname = usePathname()
  const isCreatePage = pathname === "/create"

  return (
    <header className="w-full p-4 flex justify-between items-center fixed top-0 z-10 bg-black/80 backdrop-blur-sm">
      <Link href="/" className="text-xl font-bold">
        Sports Reels
      </Link>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full bg-gray-800">
          <Search className="w-5 h-5" />
        </button>
        {!isCreatePage && (
          <Link href="/create" className="p-2 rounded-full bg-blue-600 flex items-center justify-center">
            <Plus className="w-5 h-5" />
          </Link>
        )}
      </div>
    </header>
  )
}
