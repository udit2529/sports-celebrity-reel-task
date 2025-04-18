import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl as getS3SignedUrl } from "@aws-sdk/s3-request-presigner"

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const BUCKET_NAME = "sports-celebrity-reels"

export async function uploadVideo(
  videoBuffer: Buffer,
  fileName: string,
  metadata: Record<string, string> = {},
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: `videos/${fileName}`,
    Body: videoBuffer,
    ContentType: "video/mp4",
    Metadata: metadata,
  })

  await s3Client.send(command)

  // Return the URL to the uploaded video
  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/videos/${fileName}`
}

export async function uploadAudio(audioBuffer: Buffer, fileName: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: `audio/${fileName}`,
    Body: audioBuffer,
    ContentType: "audio/mp3",
  })

  await s3Client.send(command)

  // Return the URL to the uploaded audio
  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/audio/${fileName}`
}

export async function uploadThumbnail(imageBuffer: Buffer, fileName: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: `thumbnails/${fileName}`,
    Body: imageBuffer,
    ContentType: "image/jpeg",
  })

  await s3Client.send(command)

  // Return the URL to the uploaded thumbnail
  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/thumbnails/${fileName}`
}

export async function getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  })

  // Create a signed URL that expires in the specified time (default: 1 hour)
  return getS3SignedUrl(s3Client, command, { expiresIn })
}
