// inngest/functions/autoPostSeries.ts
import { inngest } from "../client";
import { adminDb } from "@/lib/firebase-admin";

interface SeriesData {
  id: string;
  userId: string;
  niche: string;
  artStyle: string;
  platforms: string[];
  frequency: string;
  totalVideosPosted: number;
}

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

      return snap.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          userId: d.userId as string,
          niche: d.niche as string,
          artStyle: d.artStyle as string,
          platforms: d.platforms as string[],
          frequency: d.frequency as string,
          totalVideosPosted: (d.totalVideosPosted as number) || 0,
        } as SeriesData;
      });
    });

    for (const series of seriesSnaps) {
      await step.run(`process-series-${series.id}`, async () => {
        await inngest.send({
          name: "reelforge/video.requested",
          data: {
            jobId: "",
            scriptId: "",
            userId: series.userId,
            captionStyle: "bold_white",
            musicMood: "epic",
            niche: series.niche,
            artStyle: series.artStyle,
            autoPost: true,
            platforms: series.platforms,
          },
        });

        let nextDate = new Date(now);
        if (series.frequency === "daily") nextDate.setDate(nextDate.getDate() + 1);
        else if (series.frequency === "every2days") nextDate.setDate(nextDate.getDate() + 2);
        else nextDate.setDate(nextDate.getDate() + 7);

        await adminDb.collection("series").doc(series.id).update({
          lastPostAt: now,
          nextPostAt: nextDate,
          totalVideosPosted: series.totalVideosPosted + 1,
        });
      });
    }

    return { processed: seriesSnaps.length };
  }
);
