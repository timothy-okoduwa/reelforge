// components/dashboard/StatsCards.tsx
"use client";

import { useState, useEffect } from "react";
import { doc, onSnapshot, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Film, Repeat, Eye } from "lucide-react";

export default function StatsCards() {
  const { user } = useAuth();
  const [videosThisMonth, setVideosThisMonth] = useState(0);
  const [plan, setPlan] = useState("free");
  const [activeSeries, setActiveSeries] = useState(0);

  useEffect(() => {
    if (!user) return;

    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      if (snap.exists()) {
        setVideosThisMonth(snap.data().videosThisMonth || 0);
        setPlan(snap.data().plan || "free");
      }
    });

    const fetchSeries = async () => {
      const snap = await getDocs(
        query(collection(db, "series"), where("userId", "==", user.uid), where("active", "==", true))
      );
      setActiveSeries(snap.size);
    };
    fetchSeries();

    return () => unsub();
  }, [user]);

  const planLimits: Record<string, number> = {
    free: 5,
    starter: 30,
    pro: 150,
    unlimited: Infinity,
    unlimited_forever: Infinity,
  };

  const limit = planLimits[plan] ?? 5;
  const isUnlimited = limit === Infinity;
  const remaining = isUnlimited ? null : Math.max(0, limit - videosThisMonth);

  const stats = [
    {
      label: "Videos Created",
      value: videosThisMonth,
      icon: Film,
      detail: isUnlimited ? "Unlimited" : `${remaining} remaining this month`,
      color: "text-purple-400",
    },
    {
      label: "Active Series",
      value: activeSeries,
      icon: Repeat,
      detail: "Automated series running",
      color: "text-pink-400",
    },
    {
      label: "Total Views",
      value: 0,
      icon: Eye,
      detail: "Across all platforms",
      color: "text-blue-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="bg-[#12121a] border-[#2a2a3e]">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold text-white">
                    {stat.value === Infinity ? "∞" : stat.value}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">{stat.detail}</p>
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#1a1a2e]">
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
