// app/admin/users/page.tsx
"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { UserDoc } from "@/types/index";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Crown, Ban, ShieldOff, Search } from "lucide-react";
import { toast } from "sonner";

interface UserRow extends UserDoc {
  id: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");

  useEffect(() => {
    async function load() {
      const snap = await getDocs(collection(db, "users"));
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as UserRow));
      setUsers(data);
    }
    load();
  }, []);

  const filtered = users.filter((u) => {
    const matchSearch = u.email?.toLowerCase().includes(search.toLowerCase());
    const matchPlan = planFilter === "all" || u.plan === planFilter;
    return matchSearch && matchPlan;
  });

  async function grantUnlimited(uid: string) {
    await updateDoc(doc(db, "users", uid), {
      plan: "unlimited_forever",
      isUnlimited: true,
    });
    setUsers((prev) =>
      prev.map((u) =>
        u.id === uid ? { ...u, plan: "unlimited_forever", isUnlimited: true } : u
      )
    );
    toast.success("Granted unlimited forever");
  }

  async function revokeUnlimited(uid: string) {
    await updateDoc(doc(db, "users", uid), {
      plan: "free",
      isUnlimited: false,
    });
    setUsers((prev) =>
      prev.map((u) =>
        u.id === uid ? { ...u, plan: "free", isUnlimited: false } : u
      )
    );
    toast.success("Revoked unlimited");
  }

  async function banUser(uid: string) {
    await updateDoc(doc(db, "users", uid), { banned: true });
    setUsers((prev) =>
      prev.map((u) => (u.id === uid ? { ...u, banned: true } : u))
    );
    toast.success("User banned");
  }

  async function unbanUser(uid: string) {
    await updateDoc(doc(db, "users", uid), { banned: false });
    setUsers((prev) =>
      prev.map((u) => (u.id === uid ? { ...u, banned: false } : u))
    );
    toast.success("User unbanned");
  }

  const plans = ["all", "free", "starter", "pro", "unlimited", "unlimited_forever"];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">User Management</h1>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-[#1a1a2e] border-[#2a2a3e]"
          />
        </div>
        <div className="flex gap-2">
          {plans.map((p) => (
            <Button
              key={p}
              variant={planFilter === p ? "default" : "outline"}
              size="sm"
              onClick={() => setPlanFilter(p)}
            >
              {p === "all" ? "All" : p}
            </Button>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{filtered.length} Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2a2a3e] text-gray-400">
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Plan</th>
                  <th className="text-left p-3">Videos/Mo</th>
                  <th className="text-left p-3">Created</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-b border-[#2a2a3e]/50">
                    <td className="p-3 flex items-center gap-2">
                      {u.isUnlimited && <Crown className="h-4 w-4 text-yellow-500" />}
                      {u.email}
                    </td>
                    <td className="p-3">
                      <Badge variant={u.plan === "free" ? "secondary" : "default"}>
                        {u.plan}
                      </Badge>
                    </td>
                    <td className="p-3">{u.videosThisMonth ?? 0}</td>
                    <td className="p-3 text-gray-400">
                      {u.createdAt?.seconds
                        ? new Date(u.createdAt.seconds * 1000).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="p-3">
                      {u.banned ? (
                        <Badge variant="destructive">Banned</Badge>
                      ) : (
                        <Badge variant="secondary">Active</Badge>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        {!u.isUnlimited && (
                          <Button size="sm" variant="outline" onClick={() => grantUnlimited(u.id)}>
                            <Crown className="h-3 w-3 mr-1" /> Grant
                          </Button>
                        )}
                        {u.isUnlimited && (
                          <Button size="sm" variant="outline" onClick={() => revokeUnlimited(u.id)}>
                            <ShieldOff className="h-3 w-3 mr-1" /> Revoke
                          </Button>
                        )}
                        {!u.banned ? (
                          <Button size="sm" variant="destructive" onClick={() => banUser(u.id)}>
                            <Ban className="h-3 w-3 mr-1" /> Ban
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => unbanUser(u.id)}>
                            Unban
                          </Button>
                        )}
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
