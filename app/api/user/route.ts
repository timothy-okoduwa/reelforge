import { NextRequest, NextResponse } from "next/server";
import { admin, adminAuth, adminDb } from "@/lib/firebase-admin";

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

    return NextResponse.json({ created: true });
  } catch (error) {
    console.error("Error creating user doc:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
