"use client";

import { useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { auth, provider } from "@/lib/firebase";

async function ensureUserDoc(user: User) {
  try {
    const idToken = await user.getIdToken();
    await fetch("/api/user", {
      method: "POST",
      headers: { Authorization: `Bearer ${idToken}` },
    });
  } catch (error) {
    console.error("Failed to ensure user doc:", error);
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);

      if (u) {
        await ensureUserDoc(u);
      }
    });
    return () => unsub();
  }, []);

  const signInWithGoogle = () => signInWithPopup(auth, provider);
  const logout = () => signOut(auth);

  return { user, loading, signInWithGoogle, logout };
}
