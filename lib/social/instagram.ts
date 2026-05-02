// lib/social/instagram.ts
import { adminDb } from "@/lib/firebase-admin";

export async function postToInstagram(
  videoUrl: string,
  caption: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const userSnap = await adminDb.collection("users").doc(userId).get();
  const userData = userSnap.data();
  const accessToken = userData?.instagramAccessToken;
  const igUserId = userData?.instagramUserId;

  if (!accessToken || !igUserId) {
    return { success: false, error: "Instagram not connected" };
  }

  try {
    // Create container
    const containerRes = await fetch(
      `https://graph.facebook.com/v18.0/${igUserId}/media`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          media_type: "REELS",
          video_url: videoUrl,
          caption: caption.slice(0, 2200),
          access_token: accessToken,
        }),
      }
    );

    if (!containerRes.ok) {
      const err = await containerRes.text();
      return { success: false, error: `Instagram container failed: ${err}` };
    }

    const { id: containerId } = await containerRes.json();

    // Poll for container readiness
    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 5000));
      const statusRes = await fetch(
        `https://graph.facebook.com/v18.0/${containerId}?fields=status_code&access_token=${accessToken}`
      );
      const statusData = await statusRes.json();
      if (statusData.status_code === "FINISHED") break;
      if (statusData.status_code === "ERROR") {
        return { success: false, error: "Instagram processing failed" };
      }
    }

    // Publish
    const publishRes = await fetch(
      `https://graph.facebook.com/v18.0/${igUserId}/media_publish`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creation_id: containerId,
          access_token: accessToken,
        }),
      }
    );

    if (!publishRes.ok) {
      const err = await publishRes.text();
      return { success: false, error: `Instagram publish failed: ${err}` };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
