"use client"

import { useState, useRef, useEffect } from "react"
import type { Reel } from "@/lib/types"
import { Heart, MessageCircle, Share2, User } from "lucide-react"
import { useInView } from "react-intersection-observer"

interface ReelCardProps {
  reel: Reel
  isActive: boolean
}

export default function ReelCard({ reel, isActive }: ReelCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { ref, inView } = useInView({
    threshold: 0.7,
  })

  useEffect(() => {
    if (videoRef.current) {
      if (isActive && inView) {
        videoRef.current.play()
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
        videoRef.current.play()
        setIsPlaying(true)
      }
    }
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
        muted
        playsInline
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />

      <div className="absolute bottom-0 left-0 p-4 w-full z-10">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
            <User className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h3 className="font-bold">{reel.celebrity.name}</h3>
            <p className="text-sm text-gray-300">{reel.celebrity.sport}</p>
          </div>
        </div>

        <p className="mb-4 text-sm">{reel.description}</p>
      </div>

      <div className="absolute right-4 bottom-20 flex flex-col items-center space-y-6">
        <button className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-gray-800/60 flex items-center justify-center mb-1">
            <Heart className="w-6 h-6" />
          </div>
          <span className="text-xs">{reel.likes}</span>
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
      </div>
    </div>
  )
}
