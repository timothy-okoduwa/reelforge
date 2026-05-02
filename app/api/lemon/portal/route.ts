// app/api/lemon/portal/route.ts
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { getCustomerPortalUrl } from "@/lib/lemonsqueezy";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);

    const userSnap = await adminDb.collection("users").doc(decoded.uid).get();
    const userData = userSnap.data();

    if (!userData?.lsCustomerId) {
      return Response.json({ error: "No subscription found" }, { status: 404 });
    }

    const url = getCustomerPortalUrl(String(userData.lsCustomerId));
    return Response.json({ url });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
