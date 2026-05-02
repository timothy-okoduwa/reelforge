// components/dashboard/SeriesCard.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SeriesDoc, PostingFrequency } from "@/types";

interface SeriesCardProps {
  series: SeriesDoc;
  onToggleActive: (id: string, active: boolean) => void;
}

const frequencyLabels: Record<PostingFrequency, string> = {
  daily: "Daily",
  every2days: "Every 2 days",
  weekly: "Weekly",
};

const frequencyColors: Record<PostingFrequency, string> = {
  daily: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  every2days: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  weekly: "bg-green-500/20 text-green-400 border-green-500/30",
};

export default function SeriesCard({ series, onToggleActive }: SeriesCardProps) {
  const nextPost = series.nextPostAt
    ? new Date(series.nextPostAt.seconds * 1000).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "Not scheduled";

  return (
    <Card className="bg-[#12121a] border-[#2a2a3e] hover:border-[#3a3a4e] transition-colors">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-white truncate">
              {series.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1">{series.niche}</p>
          </div>

          {/* Active / Paused toggle */}
          <button
            onClick={() => onToggleActive(series.id, !series.active)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
              series.active ? "bg-purple-600" : "bg-[#2a2a3e]"
            }`}
            aria-label={series.active ? "Pause series" : "Activate series"}
          >
            <span
              className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                series.active ? "translate-x-4.5" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-3">
          <Badge className={frequencyColors[series.frequency]}>
            {frequencyLabels[series.frequency]}
          </Badge>

          {series.active ? (
            <span className="text-xs text-green-400">Active</span>
          ) : (
            <span className="text-xs text-gray-500">Paused</span>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-[#2a2a3e] flex items-center justify-between text-xs text-gray-500">
          <span>Next: {nextPost}</span>
          <span>{series.totalVideosPosted} posted</span>
        </div>
      </CardContent>
    </Card>
  );
}
