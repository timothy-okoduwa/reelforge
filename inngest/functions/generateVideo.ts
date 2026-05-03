// inngest/functions/generateVideo.ts
import { inngest } from "../client";
import { adminDb } from "@/lib/firebase-admin";
import { generateImage } from "@/lib/pollinations";
import { generateAudio } from "@/lib/tts";
import { cloudinary } from "@/lib/cloudinary";
import type { Scene } from "@/types/index";

export const generateVideo = inngest.createFunction(
  { id: "generate-video", retries: 2 },
  { event: "reelforge/video.requested" },
  async ({ event, step }) => {
    const { jobId, scriptId, userId, captionStyle, musicMood } = event.data;

    const scriptSnap = await step.run("get-script", async () => {
      const snap = await adminDb.collection("scripts").doc(scriptId).get();
      return snap.data();
    });

    if (!scriptSnap) throw new Error("Script not found");

    const scenes = scriptSnap.scenes as Scene[];

    await step.run("update-generating-images", async () => {
      await adminDb.collection("jobs").doc(jobId).update({
        status: "generating_images",
        progress: 10,
      });
    });

    const scenesWithImages = await step.run("generate-images", async () => {
      const updated: Scene[] = [];
      for (let i = 0; i < scenes.length; i++) {
        const scene = scenes[i];
        try {
          const imageBuffer = await generateImage(
            scene.imagePrompt,
            scene.id
          );
          const b64 = imageBuffer.toString("base64");
          const result = await cloudinary.uploader.upload(
            `data:image/png;base64,${b64}`,
            {
              folder: `reelforge/images/${userId}`,
              resource_type: "image",
            }
          );
          updated.push({ ...scene, imageUrl: result.secure_url });
        } catch {
          const placeholder =
            "https://placehold.co/1080x1920/1a1a2e/8b5cf6?text=Scene+" +
            scene.id;
          updated.push({ ...scene, imageUrl: placeholder });
        }
      }
      return updated;
    });

    await step.run("update-generating-voice", async () => {
      await adminDb.collection("jobs").doc(jobId).update({
        status: "generating_voice",
        progress: 40,
      });
    });

    const scenesWithAudio = await step.run("generate-audio", async () => {
      const updated: typeof scenesWithImages = [];
      for (let i = 0; i < scenesWithImages.length; i++) {
        const scene = scenesWithImages[i];
        const audioBuffer = await generateAudio(scene.narration);
        if (audioBuffer) {
          const b64 = audioBuffer.toString("base64");
          const result = await cloudinary.uploader.upload(
            `data:audio/mp3;base64,${b64}`,
            {
              folder: `reelforge/audio/${userId}`,
              resource_type: "video",
            }
          );
          updated.push({ ...scene, audioUrl: result.secure_url });
        } else {
          updated.push({ ...scene, audioUrl: undefined });
        }
      }
      return updated;
    });

    await step.run("trigger-render", async () => {
      await adminDb.collection("jobs").doc(jobId).update({
        status: "rendering",
        progress: 70,
      });

      const workerUrl = process.env.RENDER_WORKER_URL;
      const workerSecret = process.env.WORKER_SECRET;
      const appUrl = process.env.NEXT_PUBLIC_APP_URL;

      const renderPayload = {
        jobId,
        scenes: scenesWithAudio.map((s) => ({
          imageUrl: s.imageUrl || "",
          audioUrl: s.audioUrl || null,
          durationSeconds: s.durationSeconds,
          narration: s.narration,
        })),
        captionStyle,
        musicTrack: musicMood,
        callbackUrl: `${appUrl}/api/jobs/callback`,
      };

      const res = await fetch(`${workerUrl}/render`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-worker-secret": workerSecret || "",
        },
        body: JSON.stringify(renderPayload),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Worker render failed: ${res.status} — ${err}`);
      }

      await adminDb.collection("jobs").doc(jobId).update({
        status: "rendering",
        progress: 80,
      });
    });

    return { jobId, success: true };
  }
);
