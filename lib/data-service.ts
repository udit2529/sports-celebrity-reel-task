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
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Michael_Jordan_in_2014.jpg",
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
        id: "201",
        name: "Virat Kohli",
        sport: "Cricket",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Virat_Kohli.jpg",
      },
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", // Placeholder
      thumbnailUrl: "/placeholder.svg?height=720&width=405",
      description:
        "The journey of Virat Kohli from a young Delhi cricketer to becoming one of the greatest batsmen in cricket history, with numerous records and achievements for India.",
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
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d9/MS_Dhoni_in_2011.jpg",
      },
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // Placeholder
      thumbnailUrl: "/placeholder.svg?height=720&width=405",
      description:
        "The remarkable story of MS Dhoni, from a railway ticket collector to India's most successful captain, leading the team to World Cup, Champions Trophy, and T20 World Cup victories.",
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
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/36/Rohit_Sharma_2023.jpg",
      },
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", // Placeholder
      thumbnailUrl: "/placeholder.svg?height=720&width=405",
      description:
        "Rohit Sharma's rise to becoming one of cricket's most explosive batsmen and successful captains, known for his record-breaking ODI double centuries.",
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
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Akshay_Kumar.jpg",
      },
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", // Placeholder
      thumbnailUrl: "/placeholder.svg?height=720&width=405",
      description:
        "The inspiring journey of Akshay Kumar from martial artist to becoming one of Bollywood's most successful actors, known for his discipline and versatility.",
      likes: 21345,
      comments: 654,
      createdAt: new Date().toISOString(),
      duration: 34,
      tags: ["bollywood", "actor", "action"],
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
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Michael_Jordan_in_2014.jpg",
      description: "Widely regarded as the greatest basketball player of all time.",
    },
    {
      id: "201",
      name: "Virat Kohli",
      sport: "Cricket",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Virat_Kohli.jpg",
      description:
        "Indian cricket superstar known for his aggressive batting and leadership, considered one of the greatest batsmen of all time.",
    },
    {
      id: "202",
      name: "MS Dhoni",
      sport: "Cricket",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d9/MS_Dhoni_in_2011.jpg",
      description:
        "Former Indian cricket team captain known for his calm demeanor and finishing abilities, led India to multiple World Cup victories.",
    },
    {
      id: "203",
      name: "Rohit Sharma",
      sport: "Cricket",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/36/Rohit_Sharma_2023.jpg",
      description:
        "Indian cricket team captain and opening batsman known for his elegant batting style and record-breaking ODI double centuries.",
    },
    {
      id: "301",
      name: "Akshay Kumar",
      sport: "Acting",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Akshay_Kumar.jpg",
      description:
        "Bollywood superstar known for his action roles, discipline, and versatility across various film genres.",
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
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Michael_Jordan_in_2014.jpg",
    },
    {
      id: "201",
      name: "Virat Kohli",
      sport: "Cricket",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Virat_Kohli.jpg",
    },
    {
      id: "202",
      name: "MS Dhoni",
      sport: "Cricket",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d9/MS_Dhoni_in_2011.jpg",
    },
    {
      id: "203",
      name: "Rohit Sharma",
      sport: "Cricket",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/36/Rohit_Sharma_2023.jpg",
    },
    {
      id: "301",
      name: "Akshay Kumar",
      sport: "Acting",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Akshay_Kumar.jpg",
    },
    {
      id: "104",
      name: "Usain Bolt",
      sport: "Track & Field",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Usain_Bolt_smiling_Berlin_2009.JPG/800px-Usain_Bolt_smiling_Berlin_2009.JPG",
    },
    {
      id: "105",
      name: "Tom Brady",
      sport: "American Football",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Tom_Brady_2019.jpg/800px-Tom_Brady_2019.jpg",
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
