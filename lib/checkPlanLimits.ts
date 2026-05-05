import { adminDb } from "./firebase-admin";
import type { Plan, UserDoc, PlansConfig } from "@/types/index";

const DEFAULT_PLANS: PlansConfig = {
  free: { videosPerMonth: 5, autoPost: false, platforms: [] },
  starter: { videosPerMonth: 30, autoPost: true, platforms: ["tiktok", "instagram"] },
  pro: { videosPerMonth: 150, autoPost: true, platforms: ["tiktok", "instagram", "youtube"] },
  unlimited: { videosPerMonth: 999999, autoPost: true, platforms: ["tiktok", "instagram", "youtube"] },
};

export async function checkPlanLimits(
  userId: string
): Promise<{ allowed: boolean; reason?: string; plan: Plan }> {
  const userSnap = await adminDb.collection("users").doc(userId).get();
  if (!userSnap.exists) {
    return { allowed: false, reason: "User not found", plan: "free" };
  }

  const user = userSnap.data() as UserDoc;

  if (user.banned) {
    return { allowed: false, reason: "Account suspended", plan: user.plan };
  }

  const currentMonth = new Date().toISOString().slice(0, 7);

  if (user.lastResetDate !== currentMonth) {
    await adminDb.collection("users").doc(userId).update({
      videosThisMonth: 0,
      lastResetDate: currentMonth,
    });
  }

  if (user.isUnlimited) {
    return { allowed: true, plan: user.plan };
  }

  const plansSnap = await adminDb.collection("config").doc("plans").get();
  const plans = (plansSnap.exists ? plansSnap.data() : DEFAULT_PLANS) as PlansConfig;

  const planConfig = plans[user.plan as keyof PlansConfig];
  if (!planConfig) {
    return { allowed: false, reason: "Invalid plan", plan: user.plan };
  }

  const videosThisMonth =
    user.lastResetDate !== currentMonth ? 0 : user.videosThisMonth;

  if (videosThisMonth >= planConfig.videosPerMonth) {
    return {
      allowed: false,
      reason: "Monthly video limit reached. Upgrade your plan for more videos.",
      plan: user.plan,
    };
  }

  return { allowed: true, plan: user.plan };
}
