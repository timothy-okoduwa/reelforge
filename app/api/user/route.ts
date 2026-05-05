import { NextRequest, NextResponse } from "next/server";
import { admin, adminAuth, adminDb } from "@/lib/firebase-admin";

const DEFAULT_PLANS = {
  free: { videosPerMonth: 5, autoPost: false, platforms: [] },
  starter: { videosPerMonth: 30, autoPost: true, platforms: ["tiktok", "instagram"] },
  pro: { videosPerMonth: 150, autoPost: true, platforms: ["tiktok", "instagram", "youtube"] },
  unlimited: { videosPerMonth: 999999, autoPost: true, platforms: ["tiktok", "instagram", "youtube"] },
};

async function ensureConfigDocs() {
  try {
    const plansSnap = await adminDb.collection("config").doc("plans").get();
    if (!plansSnap.exists) {
      await adminDb.collection("config").doc("plans").set(DEFAULT_PLANS);
    }

    const statsSnap = await adminDb.collection("config").doc("stats").get();
    if (!statsSnap.exists) {
      await adminDb.collection("config").doc("stats").set({
        totalUsers: 0,
        totalVideosGenerated: 0,
      });
    }
  } catch (error) {
    console.error("Failed to ensure config docs:", error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(idToken);
    const uid = decoded.uid;

    const userRef = adminDb.collection("users").doc(uid);
    const userSnap = await userRef.get();

    // Ensure config docs exist (auto-seed on first user sign-up)
    await ensureConfigDocs();

    if (userSnap.exists) {
      return NextResponse.json({ exists: true });
    }

    await userRef.set({
      email: decoded.email || "",
      displayName: decoded.name || "",
      photoURL: decoded.picture || "",
      plan: "free",
      isUnlimited: false,
      isAdmin: false,
      banned: false,
      videosThisMonth: 0,
      lastResetDate: new Date().toISOString().slice(0, 7),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Increment totalUsers in stats
    try {
      await adminDb.collection("config").doc("stats").update({
        totalUsers: admin.firestore.FieldValue.increment(1),
      });
    } catch {
      // Stats doc might not exist yet, ignore
    }

    return NextResponse.json({ created: true });
  } catch (error) {
    console.error("Error creating user doc:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
