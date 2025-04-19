"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { SearchIcon, ArrowLeft, X, TrendingUp } from "lucide-react"
import type { Celebrity } from "@/lib/types"
import Link from "next/link"
import Image from "next/image"

export default function SearchPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Celebrity[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Popular search suggestions
  const popularSearches = [
    "Basketball legends",
    "Olympic gold medalists",
    "NFL quarterbacks",
    "Tennis champions",
    "Soccer stars",
    "NBA MVPs",
    "World Cup winners",
  ]

  // Mock celebrities data
  const mockCelebrities = [
    {
      id: "101",
      name: "Michael Jordan",
      sport: "Basketball",
      imageUrl: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "102",
      name: "Serena Williams",
      sport: "Tennis",
      imageUrl: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "103",
      name: "Lionel Messi",
      sport: "Soccer",
      imageUrl: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "104",
      name: "Usain Bolt",
      sport: "Track & Field",
      imageUrl: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "105",
      name: "Tom Brady",
      sport: "American Football",
      imageUrl: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "106",
      name: "LeBron James",
      sport: "Basketball",
      imageUrl: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "107",
      name: "Cristiano Ronaldo",
      sport: "Soccer",
      imageUrl: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "108",
      name: "Roger Federer",
      sport: "Tennis",
      imageUrl: "/placeholder.svg?height=40&width=40",
    },
  ]

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches")
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches))
    }
  }, [])

  // Focus the search input on component mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Generate search suggestions based on input
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    // Generate suggestions based on the query
    const query = searchQuery.toLowerCase()

    // First, check if any celebrity names match
    const celebritySuggestions = mockCelebrities
      .filter((celeb) => celeb.name.toLowerCase().includes(query) || celeb.sport.toLowerCase().includes(query))
      .map((celeb) => celeb.name)

    // Then, check if any popular searches match
    const popularSuggestions = popularSearches.filter((search) => search.toLowerCase().includes(query))

    // Combine and deduplicate
    const allSuggestions = [...new Set([...celebritySuggestions, ...popularSuggestions])].slice(0, 5) // Limit to 5 suggestions

    setSuggestions(allSuggestions)
    setShowSuggestions(allSuggestions.length > 0)
  }, [searchQuery])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsLoading(true)

    try {
      // In a real app, you would fetch results from an API
      // For now, we'll filter the mock data
      const results = mockCelebrities.filter(
        (celebrity) =>
          celebrity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          celebrity.sport.toLowerCase().includes(searchQuery.toLowerCase()),
      )

      setSearchResults(results)

      // Save to recent searches
      if (!recentSearches.includes(searchQuery)) {
        const updatedSearches = [searchQuery, ...recentSearches].slice(0, 5)
        setRecentSearches(updatedSearches)
        localStorage.setItem("recentSearches", JSON.stringify(updatedSearches))
      }

      setShowSuggestions(false)
    } catch (error) {
      console.error("Error searching celebrities:", error)
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCelebritySelect = (celebrity: Celebrity) => {
    router.push(`/celebrity/${celebrity.id}`)
  }

  const handleSuggestionSelect = (suggestion: string) => {
    setSearchQuery(suggestion)
    setShowSuggestions(false)

    // Trigger search with the selected suggestion
    setTimeout(() => {
      handleSearch()
    }, 100)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    setSuggestions([])
    setShowSuggestions(false)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem("recentSearches")
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-4 flex items-center gap-3 bg-black sticky top-0 z-10">
        <Link href="/" className="p-2 rounded-full hover:bg-gray-800">
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for a sports celebrity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch()
              }
            }}
            className="w-full pl-10 pr-10 py-2 bg-gray-800 rounded-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchQuery && (
            <button onClick={clearSearch} className="absolute inset-y-0 right-3 flex items-center">
              <X className="h-5 w-5 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        {/* Search Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="mb-6">
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0 flex items-center"
                  onClick={() => handleSuggestionSelect(suggestion)}
                >
                  <SearchIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{suggestion}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Searches */}
        {!searchQuery && recentSearches.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-400">Recent Searches</h3>
              <button onClick={clearRecentSearches} className="text-xs text-blue-400">
                Clear All
              </button>
            </div>
            <div className="space-y-2">
              {recentSearches.map((search, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer flex items-center justify-between"
                  onClick={() => handleSuggestionSelect(search)}
                >
                  <div className="flex items-center">
                    <SearchIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{search}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setRecentSearches(recentSearches.filter((_, i) => i !== index))
                      localStorage.setItem(
                        "recentSearches",
                        JSON.stringify(recentSearches.filter((_, i) => i !== index)),
                      )
                    }}
                    className="p-1 hover:bg-gray-600 rounded-full"
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trending Searches */}
        {!searchQuery && !searchResults.length && (
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-4 w-4 text-gray-400 mr-2" />
              <h3 className="text-sm font-medium text-gray-400">Trending</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularSearches.slice(0, 5).map((search, index) => (
                <button
                  key={index}
                  className="px-3 py-1 bg-gray-800 rounded-full text-sm hover:bg-gray-700"
                  onClick={() => handleSuggestionSelect(search)}
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* No Results */}
        {!isLoading && searchResults.length === 0 && searchQuery.trim() !== "" && (
          <div className="text-center py-8 text-gray-400">
            <p className="mb-2">No celebrities found matching "{searchQuery}"</p>
            <p className="text-sm">Try searching for a different name or sport</p>
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Results for "{searchQuery}"</h3>
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
