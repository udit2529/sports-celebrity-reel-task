"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import type { Reel } from "@/lib/types"
import { Heart, MessageCircle, Share2, Volume2, VolumeX } from "lucide-react"
import { useInView } from "react-intersection-observer"

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

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isLiked) {
      setLikeCount((prev) => prev - 1)
    } else {
      setLikeCount((prev) => prev + 1)
    }
    setIsLiked(!isLiked)
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

        <p className="mb-4 text-sm max-w-[85%]">{reel.description}</p>
      </div>

      <div className="absolute right-4 bottom-20 flex flex-col items-center space-y-6">
        <button className="flex flex-col items-center" onClick={handleLike}>
          <div
            className={`w-10 h-10 rounded-full ${isLiked ? "bg-red-500/80" : "bg-gray-800/60"} flex items-center justify-center mb-1`}
          >
            <Heart className={`w-6 h-6 ${isLiked ? "fill-white" : ""}`} />
          </div>
          <span className="text-xs">{likeCount}</span>
        </button>

        <button className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-gray-800/60 flex items-center justify-center mb-1">
            <MessageCircle className="w-6 h-6" />
          </div>
          <span className="text-xs">{reel.comments}</span>
        </button>

        <button className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-gray-800/60 flex items-center justify-center mb-1">
            <Share2 className="w-6 h-6" />
          </div>
          <span className="text-xs">Share</span>
        </button>

        <button className="flex flex-col items-center" onClick={toggleMute}>
          <div className="w-10 h-10 rounded-full bg-gray-800/60 flex items-center justify-center">
            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </div>
        </button>
      </div>
    </div>
  )
}
