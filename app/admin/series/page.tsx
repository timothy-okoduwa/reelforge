// app/admin/series/page.tsx
"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pause, Trash2, Play } from "lucide-react";
import { toast } from "sonner";

export default function AdminSeries() {
  const [series, setSeries] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    async function load() {
      const snap = await getDocs(collection(db, "series"));
      setSeries(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }
    load();
  }, []);

  async function toggleActive(id: string, current: boolean) {
    await updateDoc(doc(db, "series", id), { active: !current });
    setSeries((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !current } : s))
    );
    toast.success(current ? "Series paused" : "Series resumed");
  }

  async function deleteSeries(id: string) {
    await deleteDoc(doc(db, "series", id));
    setSeries((prev) => prev.filter((s) => s.id !== id));
    toast.success("Series deleted");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Series</h1>

      <Card>
        <CardHeader>
          <CardTitle>{series.length} Series</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2a2a3e] text-gray-400">
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">User</th>
                  <th className="text-left p-3">Niche</th>
                  <th className="text-left p-3">Frequency</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Videos Posted</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {series.map((s) => (
                  <tr key={s.id as string} className="border-b border-[#2a2a3e]/50">
                    <td className="p-3">{(s.name as string) || "Untitled"}</td>
                    <td className="p-3 font-mono text-xs">{(s.userId as string)?.slice(0, 8)}</td>
                    <td className="p-3">{s.niche as string}</td>
                    <td className="p-3">{s.frequency as string}</td>
                    <td className="p-3">
                      <Badge variant={s.active ? "default" : "secondary"}>
                        {s.active ? "Active" : "Paused"}
                      </Badge>
                    </td>
                    <td className="p-3">{(s.totalVideosPosted as number) || 0}</td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleActive(s.id as string, s.active as boolean)}
                        >
                          {s.active ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteSeries(s.id as string)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
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
