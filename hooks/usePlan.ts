// hooks/usePlan.ts
"use client";

import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Plan, UserDoc } from "@/types/index";

export function usePlan(uid: string | null) {
  const [plan, setPlan] = useState<Plan>("free");
  const [videosThisMonth, setVideosThisMonth] = useState(0);
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [banned, setBanned] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    const unsub = onSnapshot(doc(db, "users", uid), (snap) => {
      if (snap.exists()) {
        const data = snap.data() as UserDoc;
        setPlan(data.plan || "free");
        setVideosThisMonth(data.videosThisMonth || 0);
        setIsUnlimited(data.isUnlimited || false);
        setIsAdmin(data.isAdmin || false);
        setBanned(data.banned || false);
      }
      setLoading(false);
    });

    return () => unsub();
  }, [uid]);

  return { plan, videosThisMonth, isUnlimited, isAdmin, banned, loading };
}
