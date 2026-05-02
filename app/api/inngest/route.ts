// app/api/inngest/route.ts
import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { generateVideo } from "@/inngest/functions/generateVideo";
import { autoPostSeries } from "@/inngest/functions/autoPostSeries";

export const { GET, POST } = serve({
  client: inngest,
  functions: [generateVideo, autoPostSeries],
});
