// app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Video, DollarSign, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVideos: 0,
    activeSubs: 0,
    revenue: 0,
  });

  useEffect(() => {
    async function load() {
      const usersSnap = await getDocs(collection(db, "users"));
      const jobsSnap = await getDocs(collection(db, "jobs"));
      const paidUsers = usersSnap.docs.filter(
        (d) => d.data().plan && d.data().plan !== "free"
      ).length;

      setStats({
        totalUsers: usersSnap.size,
        totalVideos: jobsSnap.docs.filter((d) => d.data().status === "complete")
          .length,
        activeSubs: paidUsers,
        revenue: paidUsers * 19,
      });
    }
    load();
  }, []);

  const cards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-purple-500",
    },
    {
      label: "Total Videos",
      value: stats.totalVideos,
      icon: Video,
      color: "text-pink-500",
    },
    {
      label: "Active Subscriptions",
      value: stats.activeSubs,
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      label: "Est. Monthly Revenue",
      value: `$${stats.revenue}`,
      icon: DollarSign,
      color: "text-yellow-500",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  {card.label}
                </CardTitle>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{card.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
