import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { Celebrity, GeneratedContent } from "./types"
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly"

// Initialize Polly client
const pollyClient = new PollyClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function generateCelebrityScript(celebrity: Celebrity): Promise<string> {
  const prompt = `
    Create a short, engaging script about ${celebrity.name}, the ${celebrity.sport} legend.
    Focus on their career highlights, achievements, and impact on the sport.
    Include specific statistics, records, championships, and memorable moments.
    Keep it concise (around 100-150 words) and make it engaging for social media.
    Format it as a narrative that could be read by a voiceover for a short video.
    Do not include any introductory phrases like "Here's the script:" - just provide the script text.
  `

  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt,
  })

  return text
}

export async function generateAudio(script: string, voiceId = "Matthew"): Promise<Buffer> {
  const command = new SynthesizeSpeechCommand({
    Text: script,
    OutputFormat: "mp3",
    VoiceId: voiceId,
    Engine: "neural",
  })

  const response = await pollyClient.send(command)

  if (!response.AudioStream) {
    throw new Error("Failed to generate audio")
  }

  // Convert the audio stream to a buffer
  return Buffer.from(await response.AudioStream.transformToByteArray())
}

// In a real application, this would integrate with a video generation API
// For now, we'll mock this functionality
export async function generateVideoContent(celebrity: Celebrity): Promise<GeneratedContent> {
  try {
    // 1. Generate script using AI
    const script = await generateCelebrityScript(celebrity)

    // 2. Generate audio from script using Amazon Polly
    // In a real app, you would:
    // const audioBuffer = await generateAudio(script)
    // const audioFileName = `${uuidv4()}.mp3`
    // const audioUrl = await uploadAudio(audioBuffer, audioFileName)

    // 3. For now, we'll return a mock response
    return {
      script,
      // audioUrl,
      // In a real app, you would generate a video and return its URL
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    }
  } catch (error) {
    console.error("Error generating content:", error)
    throw new Error("Failed to generate content")
  }
}
