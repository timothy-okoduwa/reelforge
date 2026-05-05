import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(idToken);

    // Only allow admins to seed
    const userSnap = await adminDb.collection("users").doc(decoded.uid).get();
    if (!userSnap.exists || !userSnap.data()?.isAdmin) {
      return NextResponse.json({ error: "Admin only" }, { status: 403 });
    }

    // Create config/plans
    await adminDb.collection("config").doc("plans").set({
      free: { videosPerMonth: 5, autoPost: false, platforms: [] },
      starter: {
        videosPerMonth: 30,
        autoPost: true,
        platforms: ["tiktok", "instagram"],
      },
      pro: {
        videosPerMonth: 150,
        autoPost: true,
        platforms: ["tiktok", "instagram", "youtube"],
      },
      unlimited: {
        videosPerMonth: 999999,
        autoPost: true,
        platforms: ["tiktok", "instagram", "youtube"],
      },
    });

    // Create config/stats
    await adminDb.collection("config").doc("stats").set({
      totalUsers: 0,
      totalVideosGenerated: 0,
    });

    return NextResponse.json({ success: true, seeded: ["config/plans", "config/stats"] });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
