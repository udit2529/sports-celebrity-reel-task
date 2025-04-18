import { type NextRequest, NextResponse } from "next/server"
import { generateVideoContent } from "@/lib/ai-service"
import { generateVideo } from "@/lib/video-service"
import { saveReel } from "@/lib/data-service"

export async function POST(request: NextRequest) {
  try {
    const { celebrity } = await request.json()

    if (!celebrity || !celebrity.name || !celebrity.sport) {
      return NextResponse.json({ error: "Celebrity information is required" }, { status: 400 })
    }

    // 1. Generate script and audio using AI
    const generatedContent = await generateVideoContent(celebrity)

    // 2. Generate video using the script and audio
    const { videoUrl, thumbnailUrl } = await generateVideo({
      celebrity,
      script: generatedContent.script,
      audioUrl: generatedContent.audioUrl,
    })

    // 3. Save the reel to the database
    const newReel = await saveReel({
      celebrity,
      videoUrl,
      thumbnailUrl,
      description: generatedContent.script.substring(0, 150) + "...",
      likes: 0,
      comments: 0,
      duration: 30, // Mock duration
      tags: [celebrity.sport.toLowerCase(), "history", "highlights"],
    })

    return NextResponse.json({ reel: newReel })
  } catch (error) {
    console.error("Error generating reel:", error)
    return NextResponse.json({ error: "Failed to generate reel" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    // In a real app, this would fetch from a database
    // For now, we'll return mock data
    const mockReels = [
      {
        id: "1",
        celebrity: {
          id: "101",
          name: "Michael Jordan",
          sport: "Basketball",
        },
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        thumbnailUrl: "/placeholder.svg?height=720&width=405",
        description:
          "Michael Jordan's journey from North Carolina to becoming the greatest basketball player of all time.",
        likes: 15243,
        comments: 342,
        createdAt: new Date().toISOString(),
        duration: 30,
        tags: ["basketball", "nba", "goat"],
      },
      // Add more mock reels here
    ]

    return NextResponse.json({
      reels: mockReels.slice(offset, offset + limit),
      total: mockReels.length,
      hasMore: offset + limit < mockReels.length,
    })
  } catch (error) {
    console.error("Error fetching reels:", error)
    return NextResponse.json({ error: "Failed to fetch reels" }, { status: 500 })
  }
}
