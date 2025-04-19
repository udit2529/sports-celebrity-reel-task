"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import type { Reel } from "@/lib/types"
import { Heart, MessageCircle, Share2, Volume2, VolumeX, AlertCircle } from "lucide-react"
import { useInView } from "react-intersection-observer"
import Link from "next/link"

interface ReelCardProps {
  reel: Reel
  isActive: boolean
  isMobile: boolean
}

export default function ReelCard({ reel, isActive, isMobile }: ReelCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(reel.likes)
  const [showShareDisabledMessage, setShowShareDisabledMessage] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { ref, inView } = useInView({
    threshold: 0.7,
  })

  useEffect(() => {
    if (videoRef.current) {
      if (isActive && inView) {
        videoRef.current.play().catch((err) => console.error("Video play error:", err))
        setIsPlaying(true)
      } else {
        videoRef.current.pause()
        setIsPlaying(false)
      }
    }
  }, [isActive, inView])

  useEffect(() => {
    // Hide share disabled message after 3 seconds
    if (showShareDisabledMessage) {
      const timer = setTimeout(() => {
        setShowShareDisabledMessage(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showShareDisabledMessage])

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

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  // Update the handleLike function to actually call an API
  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation()

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

      // Update local state
      if (isLiked) {
        setLikeCount((prev) => prev - 1)
      } else {
        setLikeCount((prev) => prev + 1)
      }
      setIsLiked(!isLiked)
    } catch (error) {
      console.error("Error updating like:", error)
      // Show error toast or notification here
    }
  }

  // Update the share button to show disabled message
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowShareDisabledMessage(true)
  }

  return (
    <div
      ref={ref}
      className="w-full h-screen flex items-center justify-center snap-start relative"
      onClick={togglePlayPause}
    >
      <video
        ref={videoRef}
        src={reel.videoUrl}
        className="absolute inset-0 w-full h-full object-cover"
        loop
        muted={isMuted}
        playsInline
        poster={reel.thumbnailUrl}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />

      {/* Share disabled message */}
      {showShareDisabledMessage && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 z-20 animate-fade-in-down">
          <AlertCircle className="h-5 w-5 text-yellow-500" />
          <span className="text-sm">Sharing is currently disabled</span>
        </div>
      )}

      <div className="absolute bottom-0 left-0 p-4 w-full z-10">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden mr-3">
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

        <p className="mb-4 text-sm max-w-[85%] line-clamp-3 md:line-clamp-none">{reel.description}</p>
      </div>

      <div className="absolute right-4 bottom-20 md:bottom-24 flex flex-col items-center space-y-6">
        <button className="flex flex-col items-center" onClick={handleLike} aria-label={isLiked ? "Unlike" : "Like"}>
          <div
            className={`w-10 h-10 rounded-full ${isLiked ? "bg-red-500/80" : "bg-gray-800/60"} flex items-center justify-center mb-1`}
          >
            <Heart className={`w-6 h-6 ${isLiked ? "fill-white" : ""}`} />
          </div>
          <span className="text-xs">{likeCount}</span>
        </button>

        <Link
          href={`/reel/${reel.id}/comments`}
          className="flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
          aria-label="Comments"
        >
          <div className="w-10 h-10 rounded-full bg-gray-800/60 flex items-center justify-center mb-1">
            <MessageCircle className="w-6 h-6" />
          </div>
          <span className="text-xs">{reel.comments}</span>
        </Link>

        <button
          className="flex flex-col items-center opacity-50 cursor-not-allowed"
          onClick={handleShare}
          aria-label="Share (Disabled)"
        >
          <div className="w-10 h-10 rounded-full bg-gray-800/60 flex items-center justify-center mb-1">
            <Share2 className="w-6 h-6" />
          </div>
          <span className="text-xs">Share</span>
        </button>

        <button className="flex flex-col items-center" onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"}>
          <div className="w-10 h-10 rounded-full bg-gray-800/60 flex items-center justify-center">
            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </div>
        </button>
      </div>
    </div>
  )
}
