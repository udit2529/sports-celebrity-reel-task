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
      {
        id: "2",
        celebrity: {
          id: "201",
          name: "Virat Kohli",
          sport: "Cricket",
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
        id: "3",
        celebrity: {
          id: "202",
          name: "MS Dhoni",
          sport: "Cricket",
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
      {
        id: "4",
        celebrity: {
          id: "203",
          name: "Rohit Sharma",
          sport: "Cricket",
        },
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        thumbnailUrl: "/placeholder.svg?height=720&width=405",
        description: "Rohit Sharma's rise to becoming one of cricket's most explosive batsmen and successful captains.",
        likes: 19876,
        comments: 543,
        createdAt: new Date().toISOString(),
        duration: 31,
        tags: ["cricket", "india", "hitman"],
      },
      {
        id: "5",
        celebrity: {
          id: "301",
          name: "Akshay Kumar",
          sport: "Acting",
        },
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        thumbnailUrl: "/placeholder.svg?height=720&width=405",
        description:
          "The inspiring journey of Akshay Kumar from martial artist to becoming one of Bollywood's most successful actors.",
        likes: 21345,
        comments: 654,
        createdAt: new Date().toISOString(),
        duration: 34,
        tags: ["bollywood", "actor", "action"],
      },
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
