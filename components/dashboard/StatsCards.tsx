// components/dashboard/StatsCards.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Film, Repeat, Eye } from "lucide-react";
import type { Plan } from "@/types";

interface StatsCardsProps {
  videosThisMonth: number;
  activeSeries: number;
  totalViews: number;
  plan: Plan;
  videosLimit: number;
}

const planLimits: Record<Plan, number> = {
  free: 2,
  starter: 15,
  pro: 60,
  unlimited: Infinity,
  unlimited_forever: Infinity,
};

export default function StatsCards({
  videosThisMonth,
  activeSeries,
  totalViews,
  plan,
  videosLimit,
}: StatsCardsProps) {
  const limit = videosLimit ?? planLimits[plan];
  const isUnlimited = limit === Infinity;
  const remaining = isUnlimited ? null : Math.max(0, limit - videosThisMonth);

  const stats = [
    {
      label: "Videos Created",
      value: videosThisMonth,
      icon: Film,
      detail: isUnlimited
        ? "Unlimited"
        : `${remaining} remaining this month`,
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
      value: totalViews.toLocaleString(),
      icon: Eye,
      detail: "Across all platforms",
      color: "text-blue-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-[#12121a] border-[#2a2a3e]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-white">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-gray-500">{stat.detail}</p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#1a1a2e]">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
