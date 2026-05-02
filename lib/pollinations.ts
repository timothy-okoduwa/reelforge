// lib/pollinations.ts

export async function generateImage(
  prompt: string,
  seed: number
): Promise<Buffer> {
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1080&height=1920&nologo=true&seed=${seed}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Image generation failed: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
