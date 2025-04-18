"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, ArrowLeft } from "lucide-react"
import type { Celebrity } from "@/lib/types"
import Link from "next/link"
import Image from "next/image"

export default function SearchPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Celebrity[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const searchCelebrities = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([])
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`/api/celebrities/search?q=${encodeURIComponent(searchQuery)}`)
        if (!response.ok) {
          throw new Error("Failed to search celebrities")
        }
        const data = await response.json()
        setSearchResults(data.celebrities)
      } catch (err) {
        console.error("Error searching celebrities:", err)
        setSearchResults([])
      } finally {
        setIsLoading(false)
      }
    }

    const debounce = setTimeout(searchCelebrities, 300)
    return () => clearTimeout(debounce)
  }, [searchQuery])

  const handleCelebritySelect = (celebrity: Celebrity) => {
    router.push(`/celebrity/${celebrity.id}`)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-4 flex items-center gap-3 bg-black sticky top-0 z-10">
        <Link href="/" className="p-2 rounded-full hover:bg-gray-800">
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search for a sports celebrity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="p-4">
        {isLoading && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {!isLoading && searchResults.length === 0 && searchQuery.trim() !== "" && (
          <div className="text-center py-8 text-gray-400">No celebrities found matching "{searchQuery}"</div>
        )}

        {searchResults.length > 0 && (
          <div className="space-y-3">
            {searchResults.map((celebrity) => (
              <div
                key={celebrity.id}
                className="p-3 bg-gray-800 rounded-lg flex items-center hover:bg-gray-700 cursor-pointer"
                onClick={() => handleCelebritySelect(celebrity)}
              >
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 mr-3">
                  {celebrity.imageUrl ? (
                    <Image
                      src={celebrity.imageUrl || "/placeholder.svg"}
                      alt={celebrity.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      {celebrity.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-medium">{celebrity.name}</div>
                  <div className="text-sm text-gray-400">{celebrity.sport}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
