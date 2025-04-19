"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Heart, MessageCircle, Share2, MoreVertical, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Reel } from "@/lib/types"

export default function ReelPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [reel, setReel] = useState<Reel | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const fetchReel = async () => {
      try {
        const response = await fetch(`/api/reels/${params.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch reel")
        }
        const data = await response.json()
        setReel(data.reel)
      } catch (error) {
        console.error("Error fetching reel:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReel()
  }, [params.id])

  useEffect(() => {
    if (videoRef.current && !isLoading && reel) {
      videoRef.current.play().catch((err) => console.error("Video play error:", err))
      setIsPlaying(true)
    }
  }, [isLoading, reel])

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      } else {
        videoRef.current.play().catch((err) => console.error("Video play error:", err))
        setIsPlaying(true)
      }
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleLike = async () => {
    if (!reel) return

    try {
      const response = await fetch(`/api/reels/${reel.id}/like`, {
        method: isLiked ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to update like status")
      }

      setIsLiked(!isLiked)
      setReel({
        ...reel,
        likes: isLiked ? reel.likes - 1 : reel.likes + 1,
      })
    } catch (error) {
      console.error("Error updating like:", error)
    }
  }

  const handleShare = () => {
    if (!reel) return

    if (navigator.share) {
      navigator
        .share({
          title: `${reel.celebrity.name} - Sports Reel`,
          text: reel.description,
          url: window.location.href,
        })
        .catch((error) => console.error("Error sharing:", error))
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  const handleDeleteReel = async () => {
    if (!reel) return

    if (!confirm("Are you sure you want to delete this reel?")) return

    try {
      const response = await fetch(`/api/reels/${reel.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete reel")
      }

      router.push("/")
    } catch (error) {
      console.error("Error deleting reel:", error)
      alert("Failed to delete reel")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!reel) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <h1 className="text-xl font-bold mb-4">Reel not found</h1>
        <p className="text-gray-400 mb-6">The reel you're looking for doesn't exist or has been removed.</p>
        <Link href="/" className="px-4 py-2 bg-blue-600 rounded-full">
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-full bg-black/50">
          <ArrowLeft className="h-5 w-5" />
        </button>

        <button onClick={() => setShowOptions(!showOptions)} className="p-2 rounded-full bg-black/50">
          <MoreVertical className="h-5 w-5" />
        </button>

        {showOptions && (
          <div className="absolute top-12 left-0 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={handleDeleteReel}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 w-full text-left text-red-500"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete Reel</span>
            </button>
          </div>
        )}
      </div>

      <div className="w-full h-screen" onClick={togglePlayPause}>
        <video
          ref={videoRef}
          src={reel.videoUrl}
          className="w-full h-full object-contain bg-black"
          loop
          muted={isMuted}
          playsInline
          poster={reel.thumbnailUrl}
        />
      </div>

      <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden mr-3">
            {reel.celebrity.imageUrl ? (
              <Image
                src={reel.celebrity.imageUrl || "/placeholder.svg"}
                alt={reel.celebrity.name}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-bold">
                {reel.celebrity.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-bold">{reel.celebrity.name}</h3>
            <p className="text-sm text-gray-300">{reel.celebrity.sport}</p>
          </div>
        </div>

        <p className="mb-4">{reel.description}</p>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <button onClick={handleLike} className="flex items-center gap-1">
              <Heart className={`h-6 w-6 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
              <span>{reel.likes}</span>
            </button>

            <Link href={`/reel/${reel.id}/comments`} className="flex items-center gap-1">
              <MessageCircle className="h-6 w-6" />
              <span>{reel.comments}</span>
            </Link>

            <button onClick={handleShare} className="flex items-center gap-1">
              <Share2 className="h-6 w-6" />
              <span>Share</span>
            </button>
          </div>

          <div className="flex items-center">
            <button onClick={toggleMute} className="p-2">
              {isMuted ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    clipRule="evenodd"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                  />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
