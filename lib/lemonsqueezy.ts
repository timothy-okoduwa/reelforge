// lib/lemonsqueezy.ts
import crypto from "crypto";

export function getCheckoutUrl(variantId: string, userId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://reelforge.app";
  return `https://reelforge.lemonsqueezy.com/checkout/buy/${variantId}?checkout[custom][user_id]=${userId}&checkout[redirect_url]=${baseUrl}/dashboard`;
}

export function getCustomerPortalUrl(customerId: string): string {
  return `https://reelforge.lemonsqueezy.com/billing?customer_id=${customerId}`;
}

export function verifyWebhookSignature(
  payload: string,
  signature: string
): boolean {
  const expected = crypto
    .createHmac("sha256", process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || "")
    .update(payload)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(signature)
  );
}
