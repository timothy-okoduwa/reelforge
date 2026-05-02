// lib/social/tiktok.ts
import { adminDb } from "@/lib/firebase-admin";

export async function postToTikTok(
  videoUrl: string,
  caption: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const userSnap = await adminDb.collection("users").doc(userId).get();
  const userData = userSnap.data();
  const accessToken = userData?.tiktokAccessToken;
  const openId = userData?.tiktokOpenId;

  if (!accessToken || !openId) {
    return { success: false, error: "TikTok not connected" };
  }

  try {
    const initRes = await fetch(
      "https://open.tiktokapis.com/v2/post/publish/video/init/",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post_info: { title: caption.slice(0, 150), privacy_level: "PUBLIC_TO_EVERYONE" },
          source_info: { source: "PULL_FROM_URL", video_url: videoUrl },
        }),
      }
    );

    if (!initRes.ok) {
      const err = await initRes.text();
      return { success: false, error: `TikTok init failed: ${err}` };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
