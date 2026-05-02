// inngest/functions/autoPostSeries.ts
import { inngest } from "../client";
import { adminDb } from "@/lib/firebase-admin";

export const autoPostSeries = inngest.createFunction(
  { id: "auto-post-series" },
  { cron: "0 * * * *" },
  async ({ step }) => {
    const now = new Date();

    const seriesSnaps = await step.run("find-due-series", async () => {
      const snap = await adminDb
        .collection("series")
        .where("active", "==", true)
        .where("nextPostAt", "<=", now)
        .get();

      return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    });

    for (const series of seriesSnaps) {
      await step.run(`process-series-${series.id}`, async () => {
        const userId = series.userId as string;

        await inngest.send({
          name: "reelforge/video.requested",
          data: {
            jobId: "",
            scriptId: "",
            userId,
            captionStyle: "bold_white",
            musicMood: "epic",
            niche: series.niche,
            artStyle: series.artStyle,
            autoPost: true,
            platforms: series.platforms,
          },
        });

        const freq = series.frequency as string;
        let nextDate = new Date(now);
        if (freq === "daily") nextDate.setDate(nextDate.getDate() + 1);
        else if (freq === "every2days") nextDate.setDate(nextDate.getDate() + 2);
        else nextDate.setDate(nextDate.getDate() + 7);

        await adminDb.collection("series").doc(series.id).update({
          lastPostAt: now,
          nextPostAt: nextDate,
          totalVideosPosted: (series.totalVideosPosted || 0) + 1,
        });
      });
    }

    return { processed: seriesSnaps.length };
  }
);
