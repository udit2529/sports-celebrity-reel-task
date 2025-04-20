"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Settings, Trash2, LogOut } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Reel } from "@/lib/types"
import { useAuth } from "@/context/auth-context"

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [reels, setReels] = useState<Reel[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user && !isLoading) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    // In a real app, fetch user's reels from an API
    // For now, we'll use mock data
    setTimeout(() => {
      setReels([
        {
          id: "1",
          celebrity: {
            id: "201",
            name: "Virat Kohli",
            sport: "Cricket",
            imageUrl: "/placeholder.svg?height=40&width=40",
          },
          videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          thumbnailUrl: "/placeholder.svg?height=720&width=405",
          description:
            "The journey of Virat Kohli from a young Delhi cricketer to becoming one of the greatest batsmen in cricket history.",
          likes: 25678,
          comments: 789,
          createdAt: new Date().toISOString(),
          duration: 35,
          tags: ["cricket", "india", "batsman"],
        },
        {
          id: "2",
          celebrity: {
            id: "202",
            name: "MS Dhoni",
            sport: "Cricket",
            imageUrl: "/placeholder.svg?height=40&width=40",
          },
          videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          thumbnailUrl: "/placeholder.svg?height=720&width=405",
          description:
            "The remarkable story of MS Dhoni, from a railway ticket collector to India's most successful captain.",
          likes: 23456,
          comments: 678,
          createdAt: new Date().toISOString(),
          duration: 33,
          tags: ["cricket", "india", "captain"],
        },
      ])
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleDeleteReel = async (reelId: string) => {
    if (!confirm("Are you sure you want to delete this reel?")) return

    try {
      const response = await fetch(`/api/reels/${reelId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete reel")
      }

      setReels(reels.filter((reel) => reel.id !== reelId))
    } catch (error) {
      console.error("Error deleting reel:", error)
      alert("Failed to delete reel")
    }
  }

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      logout()
    }
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-4 flex items-center justify-between bg-black sticky top-0 z-10 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 rounded-full hover:bg-gray-800">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-bold">My Profile</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/settings" className="p-2 rounded-full hover:bg-gray-800">
            <Settings className="h-5 w-5" />
          </Link>
          <button onClick={handleLogout} className="p-2 rounded-full hover:bg-gray-800">
            <LogOut className="h-5 w-5 text-red-500" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 rounded-full bg-gray-700 overflow-hidden">
            <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-gray-400">{user.email}</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">My Reels</h3>
            <Link href="/create" className="p-2 rounded-full bg-blue-600">
              <Plus className="h-5 w-5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : reels.length === 0 ? (
            <div className="text-center py-8 bg-gray-800/50 rounded-lg">
              <p className="text-gray-400 mb-4">You haven't created any reels yet.</p>
              <Link href="/create" className="px-4 py-2 bg-blue-600 rounded-full text-sm font-medium">
                Create a Reel
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {reels.map((reel) => (
                <div key={reel.id} className="relative group">
                  <Link href={`/reel/${reel.id}`}>
                    <div className="aspect-[9/16] bg-gray-800 rounded-lg overflow-hidden">
                      <Image
                        src={reel.thumbnailUrl || "/placeholder.svg"}
                        alt={reel.celebrity.name}
                        width={405}
                        height={720}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 p-3">
                          <h4 className="font-medium">{reel.celebrity.name}</h4>
                          <p className="text-sm text-gray-300">{reel.likes} likes</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={() => handleDeleteReel(reel.id)}
                    className="absolute top-2 right-2 p-2 bg-red-500/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Delete reel"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
