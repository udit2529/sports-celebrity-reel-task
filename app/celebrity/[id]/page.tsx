import { getCelebrity, getReels } from "@/lib/data-service"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import ReelsContainer from "@/components/reels/reels-container"

interface CelebrityPageProps {
  params: {
    id: string
  }
}

export default async function CelebrityPage({ params }: CelebrityPageProps) {
  const celebrity = await getCelebrity(params.id)

  if (!celebrity) {
    notFound()
  }

  // Get reels for this celebrity
  const allReels = await getReels()
  const celebrityReels = allReels.filter((reel) => reel.celebrity.id === celebrity.id)

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="relative h-64 bg-gradient-to-b from-blue-900 to-black">
        <Link href="/" className="absolute top-4 left-4 p-2 rounded-full bg-black/50 z-10">
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <div className="absolute bottom-0 left-0 w-full p-4 flex items-end">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-700 mr-4 border-2 border-white">
            {celebrity.imageUrl ? (
              <Image
                src={celebrity.imageUrl || "/placeholder.svg"}
                alt={celebrity.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-bold text-2xl">
                {celebrity.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{celebrity.name}</h1>
            <p className="text-gray-300">{celebrity.sport}</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {celebrity.description && <p className="mb-6 text-gray-300">{celebrity.description}</p>}

        <h2 className="text-xl font-bold mb-4">Reels</h2>

        {celebrityReels.length > 0 ? (
          <ReelsContainer initialReels={celebrityReels} />
        ) : (
          <div className="text-center py-8 bg-gray-800/50 rounded-lg">
            <p className="text-gray-400 mb-4">No reels available for this celebrity yet.</p>
            <Link href="/create" className="px-4 py-2 bg-blue-600 rounded-full text-sm font-medium">
              Create a Reel
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
