// app/api/webhooks/lemonsqueezy/route.ts
import { adminDb } from "@/lib/firebase-admin";
import { verifyWebhookSignature } from "@/lib/lemonsqueezy";
import type { LemonSqueezyWebhookPayload } from "@/types/index";

const variantToPlan: Record<string, string> = {
  [process.env.LEMON_SQUEEZY_VARIANT_STARTER || ""]: "starter",
  [process.env.LEMON_SQUEEZY_VARIANT_PRO || ""]: "pro",
  [process.env.LEMON_SQUEEZY_VARIANT_UNLIMITED || ""]: "unlimited",
};

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-signature") || "";

    if (!verifyWebhookSignature(rawBody, signature)) {
      return Response.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload: LemonSqueezyWebhookPayload = JSON.parse(rawBody);
    const eventName = payload.meta.event_name;
    const data = payload.data;

    if (
      eventName === "subscription_created" ||
      eventName === "subscription_updated"
    ) {
      const variantId = String(data.attributes.variant_id);
      const plan = variantToPlan[variantId] || "free";
      const customerId = String(data.attributes.customer_id);
      const userId = payload.meta.custom_data?.user_id;

      let userQuery;
      if (userId) {
        userQuery = adminDb.collection("users").doc(userId);
      } else {
        const snap = await adminDb
          .collection("users")
          .where("lsCustomerId", "==", customerId)
          .limit(1)
          .get();
        if (snap.empty) {
          return Response.json({ error: "User not found" }, { status: 404 });
        }
        userQuery = snap.docs[0].ref;
      }

      await userQuery.update({
        plan,
        lsCustomerId: customerId,
        lsSubscriptionId: data.id,
        lsVariantId: variantId,
      });
    }

    if (eventName === "subscription_cancelled") {
      const customerId = String(data.attributes.customer_id);
      const snap = await adminDb
        .collection("users")
        .where("lsCustomerId", "==", customerId)
        .limit(1)
        .get();

      if (!snap.empty) {
        await snap.docs[0].ref.update({ plan: "free" });
      }
    }

    return Response.json({ ok: true });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
