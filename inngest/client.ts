// inngest/client.ts
import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "reelforge",
  eventKey: process.env.INNGEST_EVENT_KEY!,
});
