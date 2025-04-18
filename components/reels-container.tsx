"use client"

import { useState, useRef, useEffect } from "react"
import ReelCard from "./reel-card"
import type { Reel } from "@/lib/types"

interface ReelsContainerProps {
  initialReels: Reel[]
}

export default function ReelsContainer({ initialReels }: ReelsContainerProps) {
  const [reels, setReels] = useState<Reel[]>(initialReels)
  const [currentReelIndex, setCurrentReelIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    if (!containerRef.current) return

    const scrollTop = containerRef.current.scrollTop
    const reelHeight = window.innerHeight
    const index = Math.round(scrollTop / reelHeight)

    if (index !== currentReelIndex) {
      setCurrentReelIndex(index)
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
        <ReelCard key={reel.id} reel={reel} isActive={index === currentReelIndex} />
      ))}
    </div>
  )
}
