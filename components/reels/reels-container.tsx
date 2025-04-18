"use client"

import { useState, useRef, useEffect } from "react"
import ReelCard from "./reel-card"
import type { Reel } from "@/lib/types"
import { useMobile } from "@/hooks/use-mobile"

interface ReelsContainerProps {
  initialReels: Reel[]
}

export default function ReelsContainer({ initialReels }: ReelsContainerProps) {
  const [reels, setReels] = useState<Reel[]>(initialReels)
  const [currentReelIndex, setCurrentReelIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()

  const handleScroll = () => {
    if (!containerRef.current) return

    const scrollTop = containerRef.current.scrollTop
    const reelHeight = window.innerHeight
    const index = Math.round(scrollTop / reelHeight)

    if (index !== currentReelIndex) {
      setCurrentReelIndex(index)
    }

    // Load more reels when user scrolls near the end
    if (scrollTop + window.innerHeight > containerRef.current.scrollHeight - 500) {
      loadMoreReels()
    }
  }

  const loadMoreReels = async () => {
    if (loading) return

    try {
      setLoading(true)
      // In a real app, this would fetch more reels from an API with pagination
      // For now, we'll simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate loading more reels
      const lastReel = reels[reels.length - 1]
      if (lastReel) {
        const newReels = [...initialReels].map((reel) => ({
          ...reel,
          id: `${reel.id}-${Date.now()}`,
        }))

        setReels((prev) => [...prev, ...newReels])
      }
    } catch (error) {
      console.error("Error loading more reels:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-full h-screen overflow-y-scroll snap-y snap-mandatory"
      style={{ scrollSnapType: "y mandatory" }}
    >
      {reels.map((reel, index) => (
        <ReelCard key={reel.id} reel={reel} isActive={index === currentReelIndex} isMobile={isMobile} />
      ))}

      {loading && (
        <div className="w-full h-24 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  )
}
