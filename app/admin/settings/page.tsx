// app/admin/settings/page.tsx
"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { PlansConfig } from "@/types/index";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AdminSettings() {
  const [plans, setPlans] = useState<PlansConfig>({
    free: { videosPerMonth: 5, autoPost: false, platforms: [] },
    starter: { videosPerMonth: 30, autoPost: true, platforms: ["tiktok", "instagram"] },
    pro: { videosPerMonth: 150, autoPost: true, platforms: ["tiktok", "instagram", "youtube"] },
    unlimited: { videosPerMonth: 999999, autoPost: true, platforms: ["tiktok", "instagram", "youtube"] },
  });

  useEffect(() => {
    async function load() {
      const snap = await getDoc(doc(db, "config", "plans"));
      if (snap.exists()) {
        setPlans(snap.data() as PlansConfig);
      }
    }
    load();
  }, []);

  async function savePlans() {
    await setDoc(doc(db, "config", "plans"), plans);
    toast.success("Plan limits saved");
  }

  const planKeys = ["free", "starter", "pro", "unlimited"] as const;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Plan Limits Configuration</h1>
      <p className="text-gray-400 mb-6">
        Edit plan limits here. Changes take effect immediately — no redeployment needed.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {planKeys.map((key) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle className="capitalize">{key} Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Videos per month</label>
                <Input
                  type="number"
                  value={plans[key].videosPerMonth}
                  onChange={(e) =>
                    setPlans((prev) => ({
                      ...prev,
                      [key]: { ...prev[key], videosPerMonth: parseInt(e.target.value) || 0 },
                    }))
                  }
                  className="bg-[#1a1a2e] border-[#2a2a3e]"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">Auto-post</label>
                <select
                  value={plans[key].autoPost ? "true" : "false"}
                  onChange={(e) =>
                    setPlans((prev) => ({
                      ...prev,
                      [key]: { ...prev[key], autoPost: e.target.value === "true" },
                    }))
                  }
                  className="w-full mt-1 p-2 rounded-md bg-[#1a1a2e] border border-[#2a2a3e] text-white"
                >
                  <option value="true">Enabled</option>
                  <option value="false">Disabled</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400">Platforms (comma-separated)</label>
                <Input
                  value={plans[key].platforms.join(", ")}
                  onChange={(e) =>
                    setPlans((prev) => ({
                      ...prev,
                      [key]: {
                        ...prev[key],
                        platforms: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      },
                    }))
                  }
                  className="bg-[#1a1a2e] border-[#2a2a3e]"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button onClick={savePlans} size="lg">
        Save Plan Configuration
      </Button>
    </div>
  );
}
