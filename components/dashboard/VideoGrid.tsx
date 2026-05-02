// components/dashboard/VideoGrid.tsx
"use client";

import { useState, useMemo } from "react";
import VideoCard from "@/components/dashboard/VideoCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { JobDoc } from "@/types";

interface VideoGridProps {
  videos: JobDoc[];
}

type SortOption = "newest" | "oldest" | "status";
type FilterOption = "all" | "queued" | "generating_images" | "generating_voice" | "rendering" | "complete" | "failed";

export default function VideoGrid({ videos }: VideoGridProps) {
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");

  const filtered = useMemo(() => {
    let result = [...videos];

    if (filterBy !== "all") {
      result = result.filter((v) => v.status === filterBy);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.createdAt.seconds - a.createdAt.seconds;
        case "oldest":
          return a.createdAt.seconds - b.createdAt.seconds;
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    return result;
  }, [videos, sortBy, filterBy]);

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Select value={filterBy} onValueChange={(v) => setFilterBy(v as FilterOption)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="queued">Queued</SelectItem>
            <SelectItem value="generating_images">Generating Images</SelectItem>
            <SelectItem value="generating_voice">Generating Voice</SelectItem>
            <SelectItem value="rendering">Rendering</SelectItem>
            <SelectItem value="complete">Complete</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="status">By Status</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p>No videos found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
