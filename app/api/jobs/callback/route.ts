// app/api/jobs/callback/route.ts
import { adminDb } from "@/lib/firebase-admin";
import type { WorkerRenderCallback } from "@/types/index";

export async function POST(request: Request) {
  try {
    const workerSecret = request.headers.get("x-worker-secret");
    if (workerSecret !== process.env.WORKER_SECRET) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const body: WorkerRenderCallback = await request.json();
    const { jobId, videoUrl, thumbnailUrl, success, error } = body;

    if (success) {
      const jobSnap = await adminDb.collection("jobs").doc(jobId).get();
      const jobData = jobSnap.data();

      await adminDb.collection("jobs").doc(jobId).update({
        status: "complete",
        videoUrl,
        thumbnailUrl,
        completedAt: new Date(),
      });

      if (jobData?.userId) {
        await adminDb.collection("users").doc(jobData.userId).update({
          videosThisMonth:
            (await adminDb.collection("users").doc(jobData.userId).get()).data()
              ?.videosThisMonth + 1,
        });
      }
    } else {
      await adminDb.collection("jobs").doc(jobId).update({
        status: "failed",
        error: error || "Render failed",
      });
    }

    return Response.json({ ok: true });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
