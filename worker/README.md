# ReelForge Worker

FFmpeg-based video rendering worker for ReelForge. Runs on Railway.

## Local Development

1. Copy `.env.example` to `.env` and fill in values
2. Install dependencies:
   ```bash
   npm install
   ```
3. Install FFmpeg (macOS):
   ```bash
   brew install ffmpeg
   ```
4. Run in dev mode:
   ```bash
   npm run dev
   ```

The server starts on port 3001.

## API

### POST /render

Render a video from scene images and audio.

**Headers:**
- `x-worker-secret`: Shared secret for authentication
- `Content-Type`: application/json

**Body:**
```json
{
  "jobId": "string",
  "scenes": [
    {
      "imageUrl": "https://...",
      "audioUrl": "https://... or null",
      "durationSeconds": 8,
      "narration": "spoken text"
    }
  ],
  "captionStyle": "bold_white | neon_green | minimal | none",
  "musicTrack": "epic | chill | mysterious | motivational | sad | none",
  "callbackUrl": "https://your-app.vercel.app/api/jobs/callback"
}
```

**Response:** 200 with `{ received: true }` — rendering happens in the background. When complete, a POST request is sent to `callbackUrl` with the result.

### GET /health

Health check endpoint. Returns `{ status: "ok" }`.

## Deploy to Railway

1. Push this folder to a GitHub repository
2. Create a new Railway project → Deploy from GitHub
3. Railway will auto-detect the Dockerfile and build
4. Add environment variables in Railway dashboard
5. Copy the Railway URL to your Next.js `.env.local` as `RAILWAY_WORKER_URL`

## How It Works

1. Downloads all scene images and audio files to `/tmp/{jobId}/`
2. For each scene, creates a video clip with the image shown for `durationSeconds` and audio overlaid
3. Concatenates all clips using FFmpeg concat demuxer
4. Adds background music at 15% volume (mixed with scene audio)
5. Burns in captions based on `captionStyle` using FFmpeg `drawtext` filter
6. Uploads the final MP4 and a thumbnail to Cloudinary
7. POSTs result to `callbackUrl`
8. Cleans up temporary files
