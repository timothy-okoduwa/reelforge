// app/api/social/tiktok/auth/route.ts
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const uid = url.searchParams.get("state");
  const clientId = process.env.TIKTOK_CLIENT_KEY;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/social/tiktok/auth`;

  const tiktokUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientId}&scope=user.info.basic,video.publish&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&state=${uid}`;

  return Response.redirect(tiktokUrl);
}
