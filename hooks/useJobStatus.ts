"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import type { JobStatus } from "@/types/index";

interface JobStatusReturn {
  status: JobStatus;
  progress: number;
  statusText: string;
  isLoading: boolean;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  error: string | null;
}

export function useJobStatus(jobId: string | null): JobStatusReturn {
  const [status, setStatus] = useState<JobStatus>("queued");
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;

    setIsLoading(true);

    const interval = setInterval(async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const idToken = await user.getIdToken();
        const res = await fetch(`/api/jobs/${jobId}/status`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });

        if (res.ok) {
          const data = await res.json();
          setStatus(data.status);
          setProgress(data.progress ?? 0);
          if (data.videoUrl) setVideoUrl(data.videoUrl);
          if (data.thumbnailUrl) setThumbnailUrl(data.thumbnailUrl);
          if (data.error) setError(data.error);
          if (data.status === "complete" || data.status === "failed") {
            setIsLoading(false);
            clearInterval(interval);
          }
        }
      } catch {
        // Retry on next interval
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [jobId]);

  const statusTextMap: Record<JobStatus, string> = {
    queued: "Waiting in queue...",
    generating_images: "Generating images...",
    generating_voice: "Generating voiceover...",
    rendering: "Rendering video...",
    complete: "Video ready!",
    failed: "Generation failed",
  };

  return {
    status,
    progress,
    statusText: statusTextMap[status],
    isLoading,
    videoUrl,
    thumbnailUrl,
    error,
  };
}
