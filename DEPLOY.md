# DEPLOY.md — ReelForge Deployment Guide

## Part 1: Firebase Setup

1. Go to https://console.firebase.google.com → Create project "reelforge"
2. Enable Google Auth:
   - Authentication → Sign-in method → Google → Enable
   - Add your domain to authorized domains
3. Create Firestore database in **production mode** (us-central recommended)
4. Add Firestore security rules:
   - Go to Firestore → Rules tab
   - Paste the contents of `firestore.rules` from the project root
   - Publish
5. Go to Project Settings → Service Accounts → Generate new private key
   - Save as `firebase-service-account.json`
   - Stringify it: `cat firebase-service-account.json | jq -c .`
   - Paste as `FIREBASE_SERVICE_ACCOUNT_JSON` in `.env.local`
6. Copy all web app config values to `.env.local` (already done — see Project Settings → General → Your apps → Web app)
7. **Set yourself as admin:**
   - Firestore → users → find your uid → Edit → Add field: `isAdmin: true` (boolean)
   - Also add: `plan: "free"`, `videosThisMonth: 0`, `isUnlimited: false`, `banned: false`, `lastResetDate: "2026-05"`
8. Create the `config/plans` doc:

```json
{
  "free": { "videosPerMonth": 5, "autoPost": false, "platforms": [] },
  "starter": {
    "videosPerMonth": 30,
    "autoPost": true,
    "platforms": ["tiktok", "instagram"]
  },
  "pro": {
    "videosPerMonth": 150,
    "autoPost": true,
    "platforms": ["tiktok", "instagram", "youtube"]
  },
  "unlimited": {
    "videosPerMonth": 999999,
    "autoPost": true,
    "platforms": ["tiktok", "instagram", "youtube"]
  }
}
```

9. Create the `config/stats` doc:

```json
{
  "totalUsers": 0,
  "totalVideosGenerated": 0
}
```

---

## Part 2: Cloudinary Setup

1. Sign up at https://cloudinary.com (free tier)
2. Dashboard → copy **Cloud Name**, **API Key**, **API Secret** to `.env.local`
3. Settings → Upload → Add upload preset named `reelforge_videos` (unsigned, for videos)

---

## Part 3: Lemon Squeezy Setup

1. Sign up at https://lemonsqueezy.com → Create store "ReelForge"
2. Create product "ReelForge Subscription" with 3 variants:
   - Starter: $9/month
   - Pro: $29/month
   - Unlimited: $79/month
3. Copy each **Variant ID** to `.env.local`:
   - `LEMON_SQUEEZY_VARIANT_STARTER`
   - `LEMON_SQUEEZY_VARIANT_PRO`
   - `LEMON_SQUEEZY_VARIANT_UNLIMITED`
4. Settings → API → Create API key → Copy to `LEMON_SQUEEZY_API_KEY`
5. Copy Store ID to `LEMON_SQUEEZY_STORE_ID`
6. Settings → Webhooks → Add webhook:
   - URL: `https://yourdomain.com/api/webhooks/lemonsqueezy`
   - Events: `subscription_created`, `subscription_updated`, `subscription_cancelled`
7. Copy webhook signing secret to `LEMON_SQUEEZY_WEBHOOK_SECRET`

---

## Part 4: Inngest Setup

1. Sign up at https://inngest.com (free tier)
2. Create app "reelforge"
3. Copy **Event Key** and **Signing Key** to `.env.local`
4. After deploying to Vercel, go to Inngest dashboard → Apps → Add sync URL: `https://yourdomain.com/api/inngest`

---

## Part 5: Deploy Worker to Render

1. Sign up at https://render.com
2. Go to Dashboard → New → **Web Service**
3. Connect your GitHub account and select the **`timothy-okoduwa/reelforge`** repository
4. Configure the service:
   - **Name**: `reelforge-worker`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `worker` (this tells Render to use the `/worker` subfolder)
   - **Runtime**: **Docker** (Render will detect the `Dockerfile` in the `worker/` folder)
   - **Instance Type**: Starter ($7/mo) or higher (the worker needs FFmpeg, so at least 2 GB RAM is recommended)
5. Add environment variables in the Render dashboard:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `WORKER_SECRET` (same value as in `.env.local`)
   - `NEXT_PUBLIC_APP_URL` (your Vercel production URL)
   - `PORT` — set to `3001` (optional; defaults to 3001 in the worker code)
6. Click **Create Web Service** — Render will build the Docker image and deploy
7. After deployment succeeds, copy the Render public URL (e.g. `https://reelforge-worker.onrender.com`) → paste as `RENDER_WORKER_URL` in your `.env.local` and Vercel environment variables
8. **Optional — keep-alive**: Render free tier spins down after 15 min of inactivity. The first request after spin-down takes ~30s. If you need always-on, use a paid plan or a cron ping service (e.g. UptimeRobot) hitting the worker's health check every 5 minutes.

> **Note:** The worker folder is part of the same monorepo as the frontend. Render's "Root Directory" setting handles this — you do not need a separate GitHub repo.

---

## Part 6: Deploy Frontend to Vercel

1. Push the entire project to GitHub (exclude `/worker` if it's a separate repo)
   - Make sure `.env.local` is in `.gitignore` (it is by default)
2. Go to https://vercel.com → New Project → Import from GitHub
3. Framework: Next.js (auto-detected)
4. Add all environment variables from `.env.local` in Vercel dashboard
   - Use `RENDER_WORKER_URL` (not `RAILWAY_WORKER_URL`) as the worker URL variable
5. Deploy → copy the production URL
6. Update `NEXT_PUBLIC_APP_URL` in Vercel env vars to your production URL
7. Redeploy

---

## Part 7: Social Platform Setup (Optional — needed for auto-posting)

### TikTok

1. Go to https://developers.tiktok.com → Create app
2. Add "Login Kit" and "Content Posting API" capabilities
3. Add redirect URI: `https://yourdomain.com/api/social/tiktok/auth`
4. Copy **Client Key** and **Client Secret** to `.env.local` as `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET`

### Instagram / Meta

1. Go to https://developers.facebook.com → Create app
2. Add Instagram Graph API product
3. Add redirect URI: `https://yourdomain.com/api/social/instagram/auth`
4. Copy **App ID** and **App Secret** to `.env.local` as `META_APP_ID`, `META_APP_SECRET`

### YouTube

1. Go to https://console.cloud.google.com → New project
2. Enable YouTube Data API v3
3. Create OAuth 2.0 credentials → Add redirect URI: `https://yourdomain.com/api/social/youtube/auth`
4. Copy **Client ID** and **Client Secret** to `.env.local` as `YOUTUBE_CLIENT_ID`, `YOUTUBE_CLIENT_SECRET`

### ElevenLabs (for TTS fallback)

1. Sign up at https://elevenlabs.io (free tier — 10k chars/month)
2. Copy API key to `.env.local` as `ELEVENLABS_API_KEY`

---

## Part 8: Final Checks

- [ ] Visit your Vercel URL — landing page loads
- [ ] Sign in with Google — redirected to dashboard
- [ ] Check Firestore — user doc was created with correct fields
- [ ] Create a test video — job queues in Inngest
- [ ] Check Render logs — worker receives render request
- [ ] Video completes — appears in library with Cloudinary URL
- [ ] Click upgrade — Lemon Squeezy checkout opens
- [ ] Superadmin: visit /admin — stats page loads
- [ ] Grant yourself unlimited in /admin/users
- [ ] Lemon Squeezy webhook test — subscription updates user plan
- [ ] Series auto-posting is working (check Inngest dashboard for cron runs)

---

## Environment Variables Summary

| Variable                                   | Where to get it                                          |
| ------------------------------------------ | -------------------------------------------------------- |
| `OPENROUTER_API_KEY`                       | https://openrouter.ai → Keys                             |
| `CLOUDINARY_CLOUD_NAME`                    | Cloudinary dashboard                                     |
| `CLOUDINARY_API_KEY`                       | Cloudinary dashboard                                     |
| `CLOUDINARY_API_SECRET`                    | Cloudinary dashboard                                     |
| `NEXT_PUBLIC_FIREBASE_API_KEY`             | Firebase → Project Settings → Web app                    |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`         | Firebase → Project Settings → Web app                    |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID`          | Firebase → Project Settings → Web app                    |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`      | Firebase → Project Settings → Web app                    |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase → Project Settings → Web app                    |
| `NEXT_PUBLIC_FIREBASE_APP_ID`              | Firebase → Project Settings → Web app                    |
| `FIREBASE_SERVICE_ACCOUNT_JSON`            | Firebase → Service Accounts → Generate key (stringified) |
| `LEMON_SQUEEZY_API_KEY`                    | Lemon Squeezy → Settings → API                           |
| `LEMON_SQUEEZY_STORE_ID`                   | Lemon Squeezy → Settings → Store                         |
| `LEMON_SQUEEZY_WEBHOOK_SECRET`             | Lemon Squeezy → Settings → Webhooks                      |
| `LEMON_SQUEEZY_VARIANT_STARTER`            | Lemon Squeezy → Product → Starter variant                |
| `LEMON_SQUEEZY_VARIANT_PRO`                | Lemon Squeezy → Product → Pro variant                    |
| `LEMON_SQUEEZY_VARIANT_UNLIMITED`          | Lemon Squeezy → Product → Unlimited variant              |
| `INNGEST_EVENT_KEY`                        | Inngest → App settings                                   |
| `INNGEST_SIGNING_KEY`                      | Inngest → App settings                                   |
| `WORKER_SECRET`                            | Random string you choose                                 |
| `RENDER_WORKER_URL`                        | Render deployment URL                                    |
| `NEXT_PUBLIC_APP_URL`                      | Your Vercel production URL                               |
| `TIKTOK_CLIENT_KEY`                        | TikTok Developer Portal                                  |
| `TIKTOK_CLIENT_SECRET`                     | TikTok Developer Portal                                  |
| `META_APP_ID`                              | Meta Developer Portal                                    |
| `META_APP_SECRET`                          | Meta Developer Portal                                    |
| `YOUTUBE_CLIENT_ID`                        | Google Cloud Console                                     |
| `YOUTUBE_CLIENT_SECRET`                    | Google Cloud Console                                     |
| `ELEVENLABS_API_KEY`                       | ElevenLabs dashboard                                     |
