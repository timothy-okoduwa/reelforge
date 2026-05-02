// app/dashboard/library/page.tsx
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import VideoGrid from "@/components/dashboard/VideoGrid";
import type { JobDoc, Niche } from "@/types";
import { toast } from "sonner";

type PlatformFilter = "all" | "tiktok" | "instagram" | "youtube";
type DateFilter = "all" | "today" | "week" | "month";

export default function LibraryPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>("all");
  const [nicheFilter, setNicheFilter] = useState<Niche | "all">("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");

  const fetchJobs = async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, "jobs"),
        where("userId", "==", user.uid),
        where("status", "==", "complete"),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      const data = snap.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as JobDoc
      );
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [user]);

  const handleDelete = async (jobId: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, "jobs", jobId));
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      toast.success("Video deleted");
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete video");
    }
  };

  const filteredJobs = jobs.filter((job) => {
    if (dateFilter !== "all") {
      const now = Date.now();
      const jobTime = job.createdAt?.seconds
        ? job.createdAt.seconds * 1000
        : 0;
      const dayMs = 86400000;
      if (dateFilter === "today" && now - jobTime > dayMs) return false;
      if (dateFilter === "week" && now - jobTime > 7 * dayMs) return false;
      if (dateFilter === "month" && now - jobTime > 30 * dayMs) return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-48 animate-pulse rounded-lg bg-white/5" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-xl bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Video Library</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={platformFilter}
          onChange={(e) =>
            setPlatformFilter(e.target.value as PlatformFilter)
          }
          className="rounded-lg border border-white/10 bg-[#12121a] px-3 py-2 text-sm text-white"
        >
          <option value="all">All Platforms</option>
          <option value="tiktok">TikTok</option>
          <option value="instagram">Instagram</option>
          <option value="youtube">YouTube</option>
        </select>

        <select
          value={nicheFilter}
          onChange={(e) => setNicheFilter(e.target.value as Niche | "all")}
          className="rounded-lg border border-white/10 bg-[#12121a] px-3 py-2 text-sm text-white"
        >
          <option value="all">All Niches</option>
          <option value="Mythology">Mythology</option>
          <option value="Scary Stories">Scary Stories</option>
          <option value="History">History</option>
          <option value="True Crime">True Crime</option>
          <option value="Bible Stories">Bible Stories</option>
          <option value="Anime Stories">Anime Stories</option>
          <option value="Motivational">Motivational</option>
          <option value="Facts">Facts</option>
          <option value="Heist Stories">Heist Stories</option>
          <option value="School Drama">School Drama</option>
        </select>

        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value as DateFilter)}
          className="rounded-lg border border-white/10 bg-[#12121a] px-3 py-2 text-sm text-white"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {filteredJobs.length > 0 ? (
        <VideoGrid jobs={filteredJobs} onDelete={handleDelete} />
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-16 text-center">
          <p className="text-gray-400">No videos found</p>
        </div>
      )}
    </div>
  );
}
