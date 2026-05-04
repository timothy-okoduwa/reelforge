import { admin, adminAuth, adminDb } from "@/lib/firebase-admin";
import { generateScript } from "@/lib/openrouter";
import type { GenerateScriptRequest, Niche, ArtStyle, Language, VideoLength } from "@/types/index";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);

    const body: GenerateScriptRequest = await request.json();
    const { niche, length, language, style } = body;

    const sceneCount = length <= 30 ? 4 : length <= 60 ? 7 : 11;
    const langName: Record<Language, string> = {
      en: "English", es: "Spanish", fr: "French", pt: "Portuguese"
    };

    const systemPrompt = `You are a viral short-form video scriptwriter. You write engaging, story-driven scripts for faceless videos. Always respond with valid JSON only, no markdown fences, no extra text.`;

    const userPrompt = `Write a ${length}-second short-form video script about "${niche}" in ${langName[language || "en"]} with an ${style} visual style.

Return ONLY a JSON object with this exact structure:
{
  "title": "video title",
  "scenes": [
    {
      "id": 1,
      "narration": "spoken text for this scene (2-3 sentences)",
      "imagePrompt": "detailed visual description for AI image generation, ${style} style, vertical 9:16 format",
      "durationSeconds": 8
    }
  ],
  "totalDuration": ${length},
  "musicMood": "epic"
}

Rules:
- Exactly ${sceneCount} scenes
- Each scene narration should be speakable in the given durationSeconds
- Total durationSeconds across all scenes should equal ${length}
- imagePrompt should be vivid and detailed for AI image generation
- musicMood should be one of: epic, chill, mysterious, motivational, sad
- Make it engaging, with a hook in the first scene and a satisfying conclusion`;

    const content = await generateScript(userPrompt, systemPrompt);
    console.log("OpenRouter raw response length:", content?.length);

    let parsed;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("Failed to parse AI script output:", content?.slice(0, 500));
      return Response.json({ error: "Failed to parse AI script output" }, { status: 500 });
    }

    const scriptRef = adminDb.collection("scripts").doc();
    await scriptRef.set({
      userId: decoded.uid,
      niche,
      length,
      language: language || "en",
      artStyle: style,
      title: parsed.title,
      scenes: parsed.scenes,
      totalDuration: parsed.totalDuration,
      musicMood: parsed.musicMood,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return Response.json({ scriptId: scriptRef.id, script: parsed });
  } catch (err) {
    console.error("Script generation error:", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
