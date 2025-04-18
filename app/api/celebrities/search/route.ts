import { type NextRequest, NextResponse } from "next/server"
import { searchCelebrities } from "@/lib/data-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""

    if (!query) {
      return NextResponse.json({ celebrities: [] })
    }

    const celebrities = await searchCelebrities(query)

    return NextResponse.json({ celebrities })
  } catch (error) {
    console.error("Error searching celebrities:", error)
    return NextResponse.json({ error: "Failed to search celebrities" }, { status: 500 })
  }
}
