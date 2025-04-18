export default function ReelLoading() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-black">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-gray-400">Loading reel...</p>
    </div>
  )
}
