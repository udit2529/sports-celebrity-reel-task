import { type NextRequest, NextResponse } from "next/server"

// In a real app, this would interact with a database
// For now, we'll use an in-memory store
const likedReels = new Map<string, Set<string>>()

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const reelId = params.id

    // In a real app, you would:
    // 1. Get the user ID from the session
    // 2. Add the like to the database
    // 3. Return the updated like count

    // For now, we'll simulate this with an in-memory store
    // Using a random user ID for demonstration
    const userId = "user-123"

    if (!likedReels.has(reelId)) {
      likedReels.set(reelId, new Set())
    }

    likedReels.get(reelId)?.add(userId)

    return NextResponse.json({
      success: true,
      liked: true,
      likeCount: likedReels.get(reelId)?.size || 0,
    })
  } catch (error) {
    console.error("Error liking reel:", error)
    return NextResponse.json({ error: "Failed to like reel" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const reelId = params.id

    // In a real app, you would:
    // 1. Get the user ID from the session
    // 2. Remove the like from the database
    // 3. Return the updated like count

    // For now, we'll simulate this with an in-memory store
    const userId = "user-123"

    likedReels.get(reelId)?.delete(userId)

    return NextResponse.json({
      success: true,
      liked: false,
      likeCount: likedReels.get(reelId)?.size || 0,
    })
  } catch (error) {
    console.error("Error unliking reel:", error)
    return NextResponse.json({ error: "Failed to unlike reel" }, { status: 500 })
  }
}
