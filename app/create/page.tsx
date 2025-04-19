"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import type { Celebrity } from "@/lib/types"
import Header from "@/components/layout/header"

export default function CreateReel() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Celebrity[]>([])
  const [selectedCelebrity, setSelectedCelebrity] = useState<Celebrity | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Add a loading state and progress indicator
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const searchCelebrities = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([])
        return
      }

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
      }
    }

    const debounce = setTimeout(searchCelebrities, 300)
    return () => clearTimeout(debounce)
  }, [searchQuery])

  const handleCelebritySelect = (celebrity: Celebrity) => {
    setSelectedCelebrity(celebrity)
    setSearchQuery("")
    setSearchResults([])
  }

  // Update the handleGenerateReel function to show progress
  const handleGenerateReel = async () => {
    if (!selectedCelebrity) return

    setIsGenerating(true)
    setError(null)
    setProgress(0)

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 1000)

      const response = await fetch("/api/reels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ celebrity: selectedCelebrity }),
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to generate reel")
      }

      // Wait a moment to show 100% progress
      await new Promise((resolve) => setTimeout(resolve, 500))
      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <div className="max-w-md mx-auto pt-20 px-4">
        <h1 className="text-2xl font-bold mb-6">Create New Sports Celebrity Reel</h1>

        {error && <div className="bg-red-500/20 border border-red-500 p-3 rounded mb-4">{error}</div>}

        {!selectedCelebrity ? (
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for a sports celebrity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {searchResults.length > 0 && (
              <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                {searchResults.map((celebrity) => (
                  <div
                    key={celebrity.id}
                    className="p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0"
                    onClick={() => handleCelebritySelect(celebrity)}
                  >
                    <div className="font-medium">{celebrity.name}</div>
                    <div className="text-sm text-gray-400">{celebrity.sport}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="font-medium text-lg">{selectedCelebrity.name}</div>
              <div className="text-gray-400">{selectedCelebrity.sport}</div>
              {selectedCelebrity.description && <div className="mt-2 text-sm">{selectedCelebrity.description}</div>}
            </div>

            <button onClick={() => setSelectedCelebrity(null)} className="text-sm text-blue-400 hover:underline">
              Change celebrity
            </button>

            {isGenerating ? (
              <div className="space-y-2">
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-400 text-center">
                  {progress < 30 && "Generating script..."}
                  {progress >= 30 && progress < 60 && "Creating audio..."}
                  {progress >= 60 && progress < 90 && "Producing video..."}
                  {progress >= 90 && "Finalizing reel..."}
                </div>
              </div>
            ) : (
              <button
                onClick={handleGenerateReel}
                disabled={isGenerating}
                className="w-full py-3 bg-blue-600 rounded-lg font-medium disabled:opacity-50 mt-4"
              >
                Generate Reel
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
