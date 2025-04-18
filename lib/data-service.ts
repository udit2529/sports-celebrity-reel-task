import type { Reel, Celebrity } from "./types"

// This function would typically fetch from a database
export async function getReels(limit = 10, offset = 0): Promise<Reel[]> {
  // In a real app, this would fetch from a database
  const mockReels: Reel[] = [
    {
      id: "1",
      celebrity: {
        id: "101",
        name: "Michael Jordan",
        sport: "Basketball",
        imageUrl: "/placeholder.svg?height=40&width=40",
      },
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", // Placeholder
      thumbnailUrl: "/placeholder.svg?height=720&width=405",
      description:
        "Michael Jordan's journey from North Carolina to becoming the greatest basketball player of all time with 6 NBA championships and 5 MVP awards.",
      likes: 15243,
      comments: 342,
      createdAt: new Date().toISOString(),
      duration: 30,
      tags: ["basketball", "nba", "goat"],
    },
    {
      id: "2",
      celebrity: {
        id: "102",
        name: "Serena Williams",
        sport: "Tennis",
        imageUrl: "/placeholder.svg?height=40&width=40",
      },
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", // Placeholder
      thumbnailUrl: "/placeholder.svg?height=720&width=405",
      description:
        "The incredible story of Serena Williams dominating tennis for over two decades with 23 Grand Slam singles titles.",
      likes: 12453,
      comments: 231,
      createdAt: new Date().toISOString(),
      duration: 28,
      tags: ["tennis", "grandslam", "legend"],
    },
    {
      id: "3",
      celebrity: {
        id: "103",
        name: "Lionel Messi",
        sport: "Soccer",
        imageUrl: "/placeholder.svg?height=40&width=40",
      },
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", // Placeholder
      thumbnailUrl: "/placeholder.svg?height=720&width=405",
      description:
        "From La Masia to becoming one of the greatest footballers of all time with 7 Ballon d'Or awards and a World Cup victory.",
      likes: 18932,
      comments: 542,
      createdAt: new Date().toISOString(),
      duration: 32,
      tags: ["soccer", "football", "worldcup"],
    },
  ]

  // In a real app, we would sign the URLs here
  // const reelsWithSignedUrls = await Promise.all(
  //   mockReels.map(async (reel) => {
  //     const signedVideoUrl = await getSignedUrl(`videos/${reel.id}.mp4`);
  //     return { ...reel, videoUrl: signedVideoUrl };
  //   })
  // );

  return mockReels.slice(offset, offset + limit)
}

export async function getCelebrity(id: string): Promise<Celebrity | null> {
  // In a real app, this would fetch from a database
  const mockCelebrities: Celebrity[] = [
    {
      id: "101",
      name: "Michael Jordan",
      sport: "Basketball",
      imageUrl: "/placeholder.svg?height=40&width=40",
      description: "Widely regarded as the greatest basketball player of all time.",
    },
    {
      id: "102",
      name: "Serena Williams",
      sport: "Tennis",
      imageUrl: "/placeholder.svg?height=40&width=40",
      description: "One of the greatest tennis players of all time with 23 Grand Slam singles titles.",
    },
    {
      id: "103",
      name: "Lionel Messi",
      sport: "Soccer",
      imageUrl: "/placeholder.svg?height=40&width=40",
      description: "Argentine professional footballer widely regarded as one of the greatest players of all time.",
    },
  ]

  return mockCelebrities.find((celebrity) => celebrity.id === id) || null
}

export async function searchCelebrities(query: string): Promise<Celebrity[]> {
  // In a real app, this would search in a database
  const mockCelebrities: Celebrity[] = [
    {
      id: "101",
      name: "Michael Jordan",
      sport: "Basketball",
      imageUrl: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "102",
      name: "Serena Williams",
      sport: "Tennis",
      imageUrl: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "103",
      name: "Lionel Messi",
      sport: "Soccer",
      imageUrl: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "104",
      name: "Usain Bolt",
      sport: "Track & Field",
      imageUrl: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "105",
      name: "Tom Brady",
      sport: "American Football",
      imageUrl: "/placeholder.svg?height=40&width=40",
    },
  ]

  if (!query) return []

  const lowercaseQuery = query.toLowerCase()
  return mockCelebrities.filter(
    (celebrity) =>
      celebrity.name.toLowerCase().includes(lowercaseQuery) || celebrity.sport.toLowerCase().includes(lowercaseQuery),
  )
}

export async function saveReel(reel: Omit<Reel, "id" | "createdAt">): Promise<Reel> {
  // In a real app, this would save to a database
  const newReel: Reel = {
    ...reel,
    id: `reel-${Date.now()}`,
    createdAt: new Date().toISOString(),
  }

  // Here you would save to your database
  console.log("Saving reel:", newReel)

  return newReel
}
