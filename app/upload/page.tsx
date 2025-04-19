"use client"

import { useState, useRef, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, X, Video, ImageIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import Header from "@/components/layout/header"
import type { Celebrity } from "@/lib/types"

export default function UploadReelPage() {
  const router = useRouter()
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null)
  const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")
  const [selectedCelebrity, setSelectedCelebrity] = useState<Celebrity | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Celebrity[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const videoInputRef = useRef<HTMLInputElement>(null)
  const thumbnailInputRef = useRef<HTMLInputElement>(null)

  // Mock celebrities data for search
  const mockCelebrities = [
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

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check if file is a video
    if (!file.type.startsWith("video/")) {
      setError("Please select a valid video file")
      return
    }

    // Check file size (limit to 100MB for example)
    if (file.size > 100 * 1024 * 1024) {
      setError("Video file is too large (max 100MB)")
      return
    }

    setSelectedVideo(file)
    setVideoPreview(URL.createObjectURL(file))
    setError(null)
  }

  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file for the thumbnail")
      return
    }

    setSelectedThumbnail(file)
    setThumbnailPreview(URL.createObjectURL(file))
    setError(null)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)

    if (!query.trim()) {
      setSearchResults([])
      return
    }

    // Filter celebrities based on search query
    const results = mockCelebrities.filter(
      (celebrity) =>
        celebrity.name.toLowerCase().includes(query.toLowerCase()) ||
        celebrity.sport.toLowerCase().includes(query.toLowerCase()),
    )

    setSearchResults(results)
  }

  const handleSelectCelebrity = (celebrity: Celebrity) => {
    setSelectedCelebrity(celebrity)
    setSearchQuery("")
    setSearchResults([])
  }

  const handleUpload = async () => {
    if (!selectedVideo || !selectedCelebrity || !description.trim()) {
      setError("Please fill in all required fields")
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 5
        })
      }, 300)

      // In a real app, you would:
      // 1. Create a FormData object
      // 2. Append the video, thumbnail, and metadata
      // 3. Send it to your API endpoint
      // 4. Handle the response

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000))

      clearInterval(progressInterval)
      setUploadProgress(100)

      // Wait a moment to show 100% progress
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Redirect to home page or the new reel page
      router.push("/")
    } catch (err) {
      setError("Failed to upload reel. Please try again.")
      setIsUploading(false)
    }
  }

  const clearVideo = () => {
    setSelectedVideo(null)
    setVideoPreview(null)
    if (videoInputRef.current) {
      videoInputRef.current.value = ""
    }
  }

  const clearThumbnail = () => {
    setSelectedThumbnail(null)
    setThumbnailPreview(null)
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = ""
    }
  }

  return (
    <div className="min-h-screen bg-black text-white pb-16">
      <Header />

      <div className="max-w-md mx-auto pt-20 px-4">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/" className="p-2 rounded-full hover:bg-gray-800">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold">Upload Reel</h1>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500 p-3 rounded mb-4">{error}</div>}

        <div className="space-y-6">
          {/* Video Upload Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Video <span className="text-red-500">*</span>
            </label>
            <div
              className={`border-2 border-dashed rounded-lg ${
                selectedVideo ? "border-blue-500" : "border-gray-700"
              } p-4 text-center cursor-pointer hover:bg-gray-800/50 transition-colors`}
              onClick={() => videoInputRef.current?.click()}
            >
              {videoPreview ? (
                <div className="relative">
                  <video src={videoPreview} className="w-full h-48 object-cover rounded-lg" controls />
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      clearVideo()
                    }}
                    className="absolute top-2 right-2 p-1 bg-black/70 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="py-8">
                  <Video className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-400">Click to select a video</p>
                  <p className="text-xs text-gray-500 mt-1">MP4, MOV, or WebM (max 100MB)</p>
                </div>
              )}
              <input ref={videoInputRef} type="file" accept="video/*" onChange={handleVideoChange} className="hidden" />
            </div>
          </div>

          {/* Thumbnail Upload Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Thumbnail (Optional)</label>
            <div
              className={`border-2 border-dashed rounded-lg ${
                selectedThumbnail ? "border-blue-500" : "border-gray-700"
              } p-4 text-center cursor-pointer hover:bg-gray-800/50 transition-colors`}
              onClick={() => thumbnailInputRef.current?.click()}
            >
              {thumbnailPreview ? (
                <div className="relative">
                  <Image
                    src={thumbnailPreview || "/placeholder.svg"}
                    alt="Thumbnail preview"
                    width={400}
                    height={225}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      clearThumbnail()
                    }}
                    className="absolute top-2 right-2 p-1 bg-black/70 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="py-8">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-400">Click to select a thumbnail</p>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG, or WebP</p>
                </div>
              )}
              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Celebrity Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Celebrity <span className="text-red-500">*</span>
            </label>
            {selectedCelebrity ? (
              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                    {selectedCelebrity.imageUrl ? (
                      <Image
                        src={selectedCelebrity.imageUrl || "/placeholder.svg"}
                        alt={selectedCelebrity.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-bold">
                        {selectedCelebrity.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{selectedCelebrity.name}</div>
                    <div className="text-sm text-gray-400">{selectedCelebrity.sport}</div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCelebrity(null)}
                  className="text-sm text-blue-400 hover:underline mt-2"
                >
                  Change celebrity
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Search for a sports celebrity..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {searchResults.length > 0 && (
                  <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                    {searchResults.map((celebrity) => (
                      <div
                        key={celebrity.id}
                        className="p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0"
                        onClick={() => handleSelectCelebrity(celebrity)}
                      >
                        <div className="font-medium">{celebrity.name}</div>
                        <div className="text-sm text-gray-400">{celebrity.sport}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Add a description for your reel..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Tags (Optional)</label>
            <input
              type="text"
              placeholder="Add tags separated by commas..."
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500">Example: basketball, nba, sports</p>
          </div>

          {/* Upload Button */}
          {isUploading ? (
            <div className="space-y-2">
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-400 text-center">
                {uploadProgress < 50 ? "Uploading video..." : "Processing..."}
              </div>
            </div>
          ) : (
            <button
              onClick={handleUpload}
              disabled={!selectedVideo || !selectedCelebrity || !description.trim()}
              className="w-full py-3 bg-blue-600 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Upload className="h-5 w-5" />
              Upload Reel
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
