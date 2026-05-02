// components/dashboard/VideoCard.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { JobDoc, JobStatus } from "@/types";

interface VideoCardProps {
  video: JobDoc;
}

const statusConfig: Record<
  JobStatus,
  { label: string; className: string; variant: "default" | "secondary" | "outline" }
> = {
  queued: { label: "Queued", className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", variant: "outline" },
  generating_images: { label: "Generating", className: "bg-blue-500/20 text-blue-400 border-blue-500/30", variant: "outline" },
  generating_voice: { label: "Voiceover", className: "bg-blue-500/20 text-blue-400 border-blue-500/30", variant: "outline" },
  rendering: { label: "Rendering", className: "bg-purple-500/20 text-purple-400 border-purple-500/30", variant: "outline" },
  complete: { label: "Complete", className: "bg-green-500/20 text-green-400 border-green-500/30", variant: "outline" },
  failed: { label: "Failed", className: "bg-red-500/20 text-red-400 border-red-500/30", variant: "outline" },
};

export default function VideoCard({ video }: VideoCardProps) {
  const status = statusConfig[video.status];
  const date = new Date(
    video.createdAt.seconds * 1000
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card className="bg-[#12121a] border-[#2a2a3e] overflow-hidden hover:border-[#3a3a4e] transition-colors">
      {/* Thumbnail / Skeleton */}
      <div className="aspect-video w-full bg-[#1a1a2e] relative overflow-hidden">
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt="Video thumbnail"
            className="w-full h-full object-cover"
          />
        ) : (
          <Skeleton className="w-full h-full" />
        )}

        {/* Status badge overlay */}
        <div className="absolute top-2 left-2">
          <Badge className={status.className}>{status.label}</Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">
              Video #{video.id.slice(0, 8)}
            </p>
            <p className="text-xs text-gray-500 mt-1">{date}</p>
          </div>

          {video.status === "complete" && video.videoUrl && (
            <Button variant="ghost" size="icon" className="shrink-0" asChild>
              <a href={video.videoUrl} download aria-label="Download video">
                <Download className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>

        {video.status === "failed" && video.error && (
          <p className="mt-2 text-xs text-red-400 truncate" title={video.error}>
            {video.error}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
