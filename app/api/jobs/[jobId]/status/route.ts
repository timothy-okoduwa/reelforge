// app/api/jobs/[jobId]/status/route.ts
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split("Bearer ")[1];
    await adminAuth.verifyIdToken(token);

    const { jobId } = await params;
    const jobSnap = await adminDb.collection("jobs").doc(jobId).get();

    if (!jobSnap.exists) {
      return Response.json({ error: "Job not found" }, { status: 404 });
    }

    return Response.json({ id: jobSnap.id, ...jobSnap.data() });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
