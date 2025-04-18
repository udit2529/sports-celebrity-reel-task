import ReelsContainer from "@/components/reels/reels-container"
import Header from "@/components/layout/header"
import { getReels } from "@/lib/data-service"

export default async function Home() {
  const reels = await getReels()

  return (
    <main className="flex min-h-screen flex-col items-center bg-black text-white">
      <Header />
      <ReelsContainer initialReels={reels} />
    </main>
  )
}
