export interface Celebrity {
  id: string
  name: string
  sport: string
  imageUrl?: string
  description?: string
}

export interface Reel {
  id: string
  celebrity: Celebrity
  videoUrl: string
  thumbnailUrl: string
  description: string
  likes: number
  comments: number
  createdAt: string
  duration: number
  tags: string[]
}

export interface GeneratedContent {
  script: string
  audioUrl?: string
  videoUrl?: string
}

export interface VideoGenerationRequest {
  celebrity: Celebrity
  script: string
  audioUrl?: string
}

export interface VideoGenerationResponse {
  videoUrl: string
  thumbnailUrl: string
}
