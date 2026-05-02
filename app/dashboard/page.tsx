// app/dashboard/page.tsx
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import StatsCards from "@/components/dashboard/StatsCards";
import VideoGrid from "@/components/dashboard/VideoGrid";
import Link from "next/link";
import type { JobDoc, SeriesDoc } from "@/types";

export default function DashboardPage() {
  const { user } = useAuth();
  const [recentJobs, setRecentJobs] = useState<JobDoc[]>([]);
  const [activeSeries, setActiveSeries] = useState<SeriesDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const jobsQuery = query(
          collection(db, "jobs"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc"),
          limit(6)
        );
        const jobsSnap = await getDocs(jobsQuery);
        const jobs = jobsSnap.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as JobDoc
        );
        setRecentJobs(jobs);

        const seriesQuery = query(
          collection(db, "series"),
          where("userId", "==", user.uid),
          where("active", "==", true)
        );
        const seriesSnap = await getDocs(seriesQuery);
        const series = seriesSnap.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as SeriesDoc
        );
        setActiveSeries(series);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-white/5" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl bg-white/5"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <Link
          href="/dashboard/create"
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
        >
          + Create new video
        </Link>
      </div>

      <StatsCards />

      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">Recent Videos</h2>
        {recentJobs.length > 0 ? (
          <VideoGrid jobs={recentJobs} />
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-16 text-center">
            <p className="text-gray-400">No videos yet</p>
            <Link
              href="/dashboard/create"
              className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500"
            >
              Create your first video
            </Link>
          </div>
        )}
      </section>

      {activeSeries.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-white">
            Active Series
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeSeries.map((series) => (
              <div
                key={series.id}
                className="rounded-xl border border-white/10 bg-[#12121a] p-4"
              >
                <h3 className="font-medium text-white">{series.name}</h3>
                <p className="mt-1 text-sm text-gray-400">
                  {series.niche} &middot; {series.frequency}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {series.totalVideosPosted} videos posted
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
