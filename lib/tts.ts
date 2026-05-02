// lib/tts.ts

export async function generateAudio(text: string): Promise<Buffer | null> {
  // Try Kokoro TTS first
  try {
    const kokoroRes = await fetch(
      "https://api.kokoro-tts.com/v1/audio/speech",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "kokoro",
          voice: "af_bella",
          input: text,
        }),
      }
    );
    if (kokoroRes.ok) {
      const buf = await kokoroRes.arrayBuffer();
      return Buffer.from(buf);
    }
  } catch {
    // Kokoro unavailable, try fallback
  }

  // Fallback: ElevenLabs
  try {
    const elevenRes = await fetch(
      "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM",
      {
        method: "POST",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      }
    );
    if (elevenRes.ok) {
      const buf = await elevenRes.arrayBuffer();
      return Buffer.from(buf);
    }
  } catch {
    // ElevenLabs unavailable
  }

  // Both failed — return null (video will be silent for this scene)
  return null;
}
