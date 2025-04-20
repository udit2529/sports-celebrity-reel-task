"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import type { Reel } from "@/lib/types"
import { Heart, MessageCircle, Share2, Volume2, VolumeX } from "lucide-react"
import { useInView } from "react-intersection-observer"
import Link from "next/link"

interface ReelCardProps {
  reel: Reel
  isActive: boolean
  isMobile: boolean
}

export default function ReelCard({ reel, isActive, isMobile }: ReelCardProps) {
  // Basic state
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isLiked, setIsLiked] = useState(false)

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null)

  // InView hook
  const { ref, inView } = useInView({
    threshold: 0.7,
  })

  // Handle video playback based on visibility
  useEffect(() => {
    if (!videoRef.current) return

    if (isActive && inView) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error("Video play error:", err))
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }, [isActive, inView])

  // Simple handlers with no destructuring
  function handlePlayPause() {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error("Video play error:", err))
    }
  }

  function handleMuteToggle(event: React.MouseEvent) {
    event.stopPropagation()
    if (!videoRef.current) return

    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  function handleLikeToggle(event: React.MouseEvent) {
    event.stopPropagation()
    setIsLiked(!isLiked)
  }

  function handleCommentClick(event: React.MouseEvent) {
    event.stopPropagation()
    // Navigation handled by Link component
  }

  function handleShareClick(event: React.MouseEvent) {
    event.stopPropagation()
    console.log("Share clicked")
  }

  return (
    <div
      ref={ref}
      className="w-full h-screen flex items-center justify-center snap-start relative"
      onClick={handlePlayPause}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={reel.videoUrl}
        className="absolute inset-0 w-full h-full object-cover"
        loop
        muted={isMuted}
        playsInline
        poster={reel.thumbnailUrl}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />

      {/* Bottom info section */}
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

      {/* Action buttons */}
      <div className="absolute right-4 bottom-20 md:bottom-24 flex flex-col items-center space-y-6">
        {/* Like button */}
        <button
          className="flex flex-col items-center"
          onClick={handleLikeToggle}
          aria-label={isLiked ? "Unlike" : "Like"}
        >
          <div
            className={`w-10 h-10 rounded-full ${isLiked ? "bg-red-500/80" : "bg-gray-800/60"} flex items-center justify-center mb-1`}
          >
            <Heart className={`w-6 h-6 ${isLiked ? "fill-white" : ""}`} />
          </div>
          <span className="text-xs">{reel.likes}</span>
        </button>

        {/* Comments link */}
        <Link
          href={`/reel/${reel.id}/comments`}
          className="flex flex-col items-center"
          onClick={handleCommentClick}
          aria-label="Comments"
        >
          <div className="w-10 h-10 rounded-full bg-gray-800/60 flex items-center justify-center mb-1">
            <MessageCircle className="w-6 h-6" />
          </div>
          <span className="text-xs">{reel.comments}</span>
        </Link>

        {/* Share button */}
        <button
          className="flex flex-col items-center opacity-50 cursor-not-allowed"
          onClick={handleShareClick}
          aria-label="Share"
        >
          <div className="w-10 h-10 rounded-full bg-gray-800/60 flex items-center justify-center mb-1">
            <Share2 className="w-6 h-6" />
          </div>
          <span className="text-xs">Share</span>
        </button>

        {/* Mute/unmute button */}
        <button
          className="flex flex-col items-center"
          onClick={handleMuteToggle}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          <div className="w-10 h-10 rounded-full bg-gray-800/60 flex items-center justify-center">
            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </div>
        </button>
      </div>
    </div>
  )
}
