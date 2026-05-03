// app/dashboard/settings/page.tsx
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getAuth, updateProfile } from "firebase/auth";
import { toast } from "sonner";
import type { UserDoc, Plan } from "@/types";
import * as Tabs from "@radix-ui/react-tabs";

const PLAN_NAMES: Record<Plan, string> = {
  free: "Free",
  starter: "Starter",
  pro: "Pro",
  unlimited: "Unlimited",
  unlimited_forever: "Unlimited (Forever)",
};

export default function SettingsPage() {
  const { user } = useAuth();
  const [userDoc, setUserDoc] = useState<UserDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [saving, setSaving] = useState(false);

  // Notification toggles
  const [notifyVideoComplete, setNotifyVideoComplete] = useState(true);
  const [notifyPostScheduled, setNotifyPostScheduled] = useState(true);
  const [notifyWeeklyReport, setNotifyWeeklyReport] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchUserDoc = async () => {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const data = snap.data() as UserDoc;
          setUserDoc(data);
          setDisplayName(data.displayName || "");
          setPhotoURL(data.photoURL || "");
        }
      } catch (error) {
        console.error("Error fetching user doc:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserDoc();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        displayName,
        photoURL,
      });
      const auth = getAuth();
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName, photoURL });
      }
      toast.success("Profile updated");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-48 animate-pulse rounded-lg bg-white/5" />
        <div className="h-64 animate-pulse rounded-xl bg-white/5" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Settings</h1>

      <Tabs.Root defaultValue="profile" className="space-y-4">
        <Tabs.List className="flex gap-1 rounded-xl bg-white/5 p-1">
          <Tabs.Trigger
            value="profile"
            className="flex-1 rounded-lg px-4 py-2 text-sm text-gray-400 transition-colors data-[state=active]:bg-white/10 data-[state=active]:text-white"
          >
            Profile
          </Tabs.Trigger>
          <Tabs.Trigger
            value="subscription"
            className="flex-1 rounded-lg px-4 py-2 text-sm text-gray-400 transition-colors data-[state=active]:bg-white/10 data-[state=active]:text-white"
          >
            Subscription
          </Tabs.Trigger>
          <Tabs.Trigger
            value="platforms"
            className="flex-1 rounded-lg px-4 py-2 text-sm text-gray-400 transition-colors data-[state=active]:bg-white/10 data-[state=active]:text-white"
          >
            Platforms
          </Tabs.Trigger>
          <Tabs.Trigger
            value="notifications"
            className="flex-1 rounded-lg px-4 py-2 text-sm text-gray-400 transition-colors data-[state=active]:bg-white/10 data-[state=active]:text-white"
          >
            Notifications
          </Tabs.Trigger>
        </Tabs.List>

        {/* Profile Tab */}
        <Tabs.Content value="profile" className="rounded-xl border border-white/10 bg-[#12121a] p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-gray-400">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full max-w-md rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-400">
                Photo URL
              </label>
              <input
                type="text"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                className="w-full max-w-md rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-purple-500"
                placeholder="https://example.com/photo.jpg"
              />
            </div>
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500 disabled:opacity-40"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </Tabs.Content>

        {/* Subscription Tab */}
        <Tabs.Content value="subscription" className="rounded-xl border border-white/10 bg-[#12121a] p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Subscription
          </h2>
          {userDoc && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">Current Plan:</span>
                <span className="rounded-full bg-purple-600/20 px-3 py-1 text-sm font-medium text-purple-400">
                  {PLAN_NAMES[userDoc.plan]}
                </span>
              </div>
              <div className="text-sm text-gray-400">
                Videos this month: {userDoc.videosThisMonth}
              </div>
              {userDoc.plan !== "unlimited" &&
                userDoc.plan !== "unlimited_forever" && (
                  <a
                    href="/pricing"
                    className="inline-block rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500"
                  >
                    Upgrade Plan
                  </a>
                )}
              {userDoc.lsCustomerId && (
                <p className="text-xs text-gray-500">
                  Manage your billing through the Lemon Squeezy customer portal.
                </p>
              )}
            </div>
          )}
        </Tabs.Content>

        {/* Platforms Tab */}
        <Tabs.Content value="platforms" className="rounded-xl border border-white/10 bg-[#12121a] p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Platform Connections
          </h2>
          <div className="space-y-4">
            {/* TikTok */}
            <div className="flex items-center justify-between rounded-lg border border-white/5 p-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-white">TikTok</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    userDoc?.tiktokAccessToken
                      ? "bg-green-500/20 text-green-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {userDoc?.tiktokAccessToken ? "Connected" : "Not connected"}
                </span>
              </div>
              <button
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-400 hover:bg-white/5"
                onClick={() => {
                  if (userDoc?.tiktokAccessToken) {
                    toast.info("Disconnect not yet implemented");
                  } else {
                    toast.info("TikTok OAuth flow not yet configured");
                  }
                }}
              >
                {userDoc?.tiktokAccessToken ? "Disconnect" : "Connect"}
              </button>
            </div>

            {/* Instagram */}
            <div className="flex items-center justify-between rounded-lg border border-white/5 p-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-white">
                  Instagram
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    userDoc?.instagramAccessToken
                      ? "bg-green-500/20 text-green-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {userDoc?.instagramAccessToken
                    ? "Connected"
                    : "Not connected"}
                </span>
              </div>
              <button
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-400 hover:bg-white/5"
                onClick={() => {
                  if (userDoc?.instagramAccessToken) {
                    toast.info("Disconnect not yet implemented");
                  } else {
                    toast.info("Instagram OAuth flow not yet configured");
                  }
                }}
              >
                {userDoc?.instagramAccessToken ? "Disconnect" : "Connect"}
              </button>
            </div>

            {/* YouTube */}
            <div className="flex items-center justify-between rounded-lg border border-white/5 p-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-white">YouTube</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    userDoc?.youtubeAccessToken
                      ? "bg-green-500/20 text-green-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {userDoc?.youtubeAccessToken ? "Connected" : "Not connected"}
                </span>
              </div>
              <button
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-400 hover:bg-white/5"
                onClick={() => {
                  if (userDoc?.youtubeAccessToken) {
                    toast.info("Disconnect not yet implemented");
                  } else {
                    toast.info("YouTube OAuth flow not yet configured");
                  }
                }}
              >
                {userDoc?.youtubeAccessToken ? "Disconnect" : "Connect"}
              </button>
            </div>
          </div>
        </Tabs.Content>

        {/* Notifications Tab */}
        <Tabs.Content value="notifications" className="rounded-xl border border-white/10 bg-[#12121a] p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white">Video Complete</p>
                <p className="text-xs text-gray-500">
                  Notify when a video finishes rendering
                </p>
              </div>
              <button
                onClick={() => setNotifyVideoComplete((v) => !v)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  notifyVideoComplete ? "bg-purple-600" : "bg-white/10"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                    notifyVideoComplete ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white">Post Scheduled</p>
                <p className="text-xs text-gray-500">
                  Notify when a post is scheduled
                </p>
              </div>
              <button
                onClick={() => setNotifyPostScheduled((v) => !v)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  notifyPostScheduled ? "bg-purple-600" : "bg-white/10"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                    notifyPostScheduled ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white">Weekly Report</p>
                <p className="text-xs text-gray-500">
                  Receive a weekly performance summary
                </p>
              </div>
              <button
                onClick={() => setNotifyWeeklyReport((v) => !v)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  notifyWeeklyReport ? "bg-purple-600" : "bg-white/10"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                    notifyWeeklyReport ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
