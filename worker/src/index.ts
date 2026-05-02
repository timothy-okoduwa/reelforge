// worker/src/index.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { renderVideo } from "./render";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const WORKER_SECRET = process.env.WORKER_SECRET || "";
const PORT = parseInt(process.env.PORT || "3001", 10);

app.post("/render", async (req, res) => {
  const secret = req.headers["x-worker-secret"];
  if (secret !== WORKER_SECRET) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  try {
    const { jobId, scenes, captionStyle, musicTrack, callbackUrl } = req.body;
    res.status(200).json({ received: true });

    // Process in background
    renderVideo(jobId, scenes, captionStyle, musicTrack, callbackUrl).catch(
      (err) => {
        console.error(`Render failed for ${jobId}:`, err);
      }
    );
  } catch (err) {
    res.status(500).json({ error: "Failed to start render" });
  }
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`ReelForge worker listening on port ${PORT}`);
});

export { app };
