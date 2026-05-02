// app/api/generate/video/route.ts
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { checkPlanLimits } from "@/lib/checkPlanLimits";
import { inngest } from "@/inngest/client";
import type { GenerateVideoRequest } from "@/types/index";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);

    const body: GenerateVideoRequest = await request.json();
    const { scriptId, userId, captionStyle, musicMood } = body;

    if (decoded.uid !== userId) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const limitCheck = await checkPlanLimits(userId);
    if (!limitCheck.allowed) {
      return Response.json({ error: limitCheck.reason }, { status: 403 });
    }

    const jobRef = adminDb.collection("jobs").doc();
    await jobRef.set({
      userId,
      scriptId,
      status: "queued",
      progress: 0,
      createdAt: new Date(),
    });

    await inngest.send({
      name: "reelforge/video.requested",
      data: {
        jobId: jobRef.id,
        scriptId,
        userId,
        captionStyle: captionStyle || "bold_white",
        musicMood: musicMood || "epic",
      },
    });

    return Response.json({ jobId: jobRef.id });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
