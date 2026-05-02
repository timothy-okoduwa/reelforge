// app/api/social/youtube/auth/route.ts
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const uid = url.searchParams.get("state");
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/social/youtube/auth`;

  const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=https://www.googleapis.com/auth/youtube.upload&response_type=code&access_type=offline&state=${uid}`;

  return Response.redirect(googleUrl);
}
