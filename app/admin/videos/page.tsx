// app/admin/videos/page.tsx
"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { JobDoc } from "@/types/index";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Video } from "lucide-react";
import { toast } from "sonner";

export default function AdminVideos() {
  const [videos, setVideos] = useState<(JobDoc & { id: string })[]>([]);

  useEffect(() => {
    async function load() {
      const snap = await getDocs(collection(db, "jobs"));
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as JobDoc & { id: string }));
      setVideos(data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
    }
    load();
  }, []);

  async function deleteVideo(id: string) {
    await deleteDoc(doc(db, "jobs", id));
    setVideos((prev) => prev.filter((v) => v.id !== id));
    toast.success("Video deleted");
  }

  const statusColors: Record<string, string> = {
    queued: "bg-yellow-500/20 text-yellow-400",
    generating_images: "bg-blue-500/20 text-blue-400",
    generating_voice: "bg-blue-500/20 text-blue-400",
    rendering: "bg-purple-500/20 text-purple-400",
    complete: "bg-green-500/20 text-green-400",
    failed: "bg-red-500/20 text-red-400",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Videos</h1>

      <Card>
        <CardHeader>
          <CardTitle>{videos.length} Videos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2a2a3e] text-gray-400">
                  <th className="text-left p-3">ID</th>
                  <th className="text-left p-3">User</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Created</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((v) => (
                  <tr key={v.id} className="border-b border-[#2a2a3e]/50">
                    <td className="p-3 font-mono text-xs">{v.id.slice(0, 8)}</td>
                    <td className="p-3 font-mono text-xs">{v.userId?.slice(0, 8)}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${statusColors[v.status] || ""}`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="p-3 text-gray-400">
                      {v.createdAt?.seconds
                        ? new Date(v.createdAt.seconds * 1000).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="p-3">
                      <Button size="sm" variant="destructive" onClick={() => deleteVideo(v.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
