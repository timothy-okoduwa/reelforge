// app/dashboard/series/page.tsx
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import SeriesCard from "@/components/series/SeriesCard";
import type { SeriesDoc, Niche, ArtStyle, PostingFrequency } from "@/types";
import { toast } from "sonner";

const NICHES: Niche[] = [
  "Mythology",
  "Scary Stories",
  "History",
  "True Crime",
  "Bible Stories",
  "Anime Stories",
  "Motivational",
  "Facts",
  "Heist Stories",
  "School Drama",
];

const ART_STYLES: ArtStyle[] = [
  "Realistic",
  "Anime",
  "Dark Fantasy",
  "Cinematic",
  "Cartoon",
  "Minimalist",
];

const FREQUENCIES: PostingFrequency[] = ["daily", "every2days", "weekly"];
const PLATFORMS = ["tiktok", "instagram", "youtube"];

interface SeriesForm {
  name: string;
  niche: Niche;
  artStyle: ArtStyle;
  frequency: PostingFrequency;
  postingTime: string;
  platforms: string[];
}

const defaultForm: SeriesForm = {
  name: "",
  niche: "Mythology",
  artStyle: "Cinematic",
  frequency: "daily",
  postingTime: "12:00",
  platforms: [],
};

export default function SeriesPage() {
  const { user } = useAuth();
  const [series, setSeries] = useState<SeriesDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [form, setForm] = useState<SeriesForm>(defaultForm);

  const fetchSeries = async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, "series"),
        where("userId", "==", user.uid)
      );
      const snap = await getDocs(q);
      const data = snap.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as SeriesDoc
      );
      setSeries(data);
    } catch (error) {
      console.error("Error fetching series:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeries();
  }, [user]);

  const handleCreate = async () => {
    if (!user || !form.name.trim()) return;
    try {
      await addDoc(collection(db, "series"), {
        userId: user.uid,
        name: form.name,
        niche: form.niche,
        artStyle: form.artStyle,
        frequency: form.frequency,
        postingTime: form.postingTime,
        platforms: form.platforms,
        active: true,
        totalVideosPosted: 0,
        createdAt: new Date(),
      });
      setShowDialog(false);
      setForm(defaultForm);
      toast.success("Series created!");
      fetchSeries();
    } catch (error) {
      console.error("Error creating series:", error);
      toast.error("Failed to create series");
    }
  };

  const handleDelete = async (seriesId: string) => {
    try {
      await deleteDoc(doc(db, "series", seriesId));
      setSeries((prev) => prev.filter((s) => s.id !== seriesId));
      toast.success("Series deleted");
    } catch (error) {
      console.error("Error deleting series:", error);
      toast.error("Failed to delete series");
    }
  };

  const handleToggleActive = async (seriesId: string, active: boolean) => {
    try {
      await updateDoc(doc(db, "series", seriesId), { active: !active });
      setSeries((prev) =>
        prev.map((s) => (s.id === seriesId ? { ...s, active: !active } : s))
      );
      toast.success(active ? "Series paused" : "Series resumed");
    } catch (error) {
      console.error("Error toggling series:", error);
      toast.error("Failed to update series");
    }
  };

  const togglePlatform = (p: string) => {
    setForm((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(p)
        ? prev.platforms.filter((x) => x !== p)
        : [...prev.platforms, p],
    }));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-48 animate-pulse rounded-lg bg-white/5" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Series</h1>
        <button
          onClick={() => setShowDialog(true)}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
        >
          + Create new series
        </button>
      </div>

      {/* Create Series Dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#12121a] p-6">
            <h2 className="mb-4 text-lg font-bold text-white">
              Create New Series
            </h2>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-gray-400">
                  Series Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
                  placeholder="My Scary Stories Series"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-400">
                  Niche
                </label>
                <select
                  value={form.niche}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      niche: e.target.value as Niche,
                    }))
                  }
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                >
                  {NICHES.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-400">
                  Art Style
                </label>
                <select
                  value={form.artStyle}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      artStyle: e.target.value as ArtStyle,
                    }))
                  }
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                >
                  {ART_STYLES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-400">
                  Posting Frequency
                </label>
                <select
                  value={form.frequency}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      frequency: e.target.value as PostingFrequency,
                    }))
                  }
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                >
                  {FREQUENCIES.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-400">
                  Posting Time
                </label>
                <input
                  type="time"
                  value={form.postingTime}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, postingTime: e.target.value }))
                  }
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-400">
                  Platforms
                </label>
                <div className="flex gap-2">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p}
                      onClick={() => togglePlatform(p)}
                      className={`rounded-lg border px-3 py-1.5 text-sm capitalize transition-colors ${
                        form.platforms.includes(p)
                          ? "border-indigo-500 bg-indigo-600 text-white"
                          : "border-white/10 text-gray-400 hover:bg-white/5"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowDialog(false)}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-400 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!form.name.trim()}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-40"
              >
                Create Series
              </button>
            </div>
          </div>
        </div>
      )}

      {series.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {series.map((s) => (
            <SeriesCard
              key={s.id}
              series={s}
              onToggleActive={() => handleToggleActive(s.id, s.active)}
              onDelete={() => handleDelete(s.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-16 text-center">
          <p className="text-gray-400">No series yet</p>
          <button
            onClick={() => setShowDialog(true)}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500"
          >
            Create your first series
          </button>
        </div>
      )}
    </div>
  );
}
