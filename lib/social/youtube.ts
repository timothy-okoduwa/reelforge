// lib/social/youtube.ts
import { adminDb } from "@/lib/firebase-admin";

export async function postToYouTube(
  videoUrl: string,
  title: string,
  description: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const userSnap = await adminDb.collection("users").doc(userId).get();
  const userData = userSnap.data();
  const accessToken = userData?.youtubeAccessToken;

  if (!accessToken) {
    return { success: false, error: "YouTube not connected" };
  }

  try {
    const res = await fetch(
      "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          snippet: {
            title: title.slice(0, 100),
            description: description.slice(0, 5000),
            categoryId: "22",
          },
          status: {
            privacyStatus: "public",
            selfDeclaredMadeForKids: false,
          },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      return { success: false, error: `YouTube upload failed: ${err}` };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
