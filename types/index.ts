// types/index.ts

export type Plan = "free" | "starter" | "pro" | "unlimited" | "unlimited_forever";

export type JobStatus = "queued" | "generating_images" | "generating_voice" | "rendering" | "complete" | "failed";

export type Niche = "Mythology" | "Scary Stories" | "History" | "True Crime" | "Bible Stories" | "Anime Stories" | "Motivational" | "Facts" | "Heist Stories" | "School Drama";

export type ArtStyle = "Realistic" | "Anime" | "Dark Fantasy" | "Cinematic" | "Cartoon" | "Minimalist";

export type MusicMood = "none" | "epic" | "chill" | "mysterious" | "motivational" | "sad";

export type CaptionStyle = "bold_white" | "neon_green" | "minimal" | "none";

export type VideoLength = 30 | 60 | 90;

export type Language = "en" | "es" | "fr" | "pt";

export type PostingFrequency = "daily" | "every2days" | "weekly";

export interface Scene {
  id: number;
  narration: string;
  imagePrompt: string;
  durationSeconds: number;
  imageUrl?: string;
  audioUrl?: string;
}

export interface Script {
  title: string;
  scenes: Scene[];
  totalDuration: number;
  musicMood: MusicMood;
}

export interface ScriptDoc extends Script {
  id: string;
  userId: string;
  niche: Niche;
  length: VideoLength;
  language: Language;
  artStyle: ArtStyle;
  createdAt: { seconds: number; nanoseconds: number };
}

export interface UserDoc {
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: { seconds: number; nanoseconds: number };
  plan: Plan;
  isUnlimited: boolean;
  isAdmin: boolean;
  banned: boolean;
  videosThisMonth: number;
  lastResetDate: string;
  lsCustomerId?: string;
  lsSubscriptionId?: string;
  lsVariantId?: string;
  tiktokAccessToken?: string;
  tiktokOpenId?: string;
  instagramAccessToken?: string;
  instagramUserId?: string;
  youtubeAccessToken?: string;
  youtubeRefreshToken?: string;
  youtubeChannelId?: string;
}

export interface JobDoc {
  id: string;
  userId: string;
  scriptId: string;
  status: JobStatus;
  progress: number;
  videoUrl?: string;
  thumbnailUrl?: string;
  error?: string;
  createdAt: { seconds: number; nanoseconds: number };
  completedAt?: { seconds: number; nanoseconds: number };
}

export interface SeriesDoc {
  id: string;
  userId: string;
  name: string;
  niche: Niche;
  artStyle: ArtStyle;
  frequency: PostingFrequency;
  postingTime: string;
  platforms: string[];
  active: boolean;
  nextPostAt?: { seconds: number; nanoseconds: number };
  lastPostAt?: { seconds: number; nanoseconds: number };
  totalVideosPosted: number;
  createdAt: { seconds: number; nanoseconds: number };
}

export interface PlanConfig {
  videosPerMonth: number;
  autoPost: boolean;
  platforms: string[];
}

export interface PlansConfig {
  free: PlanConfig;
  starter: PlanConfig;
  pro: PlanConfig;
  unlimited: PlanConfig;
}

export interface StatsConfig {
  totalUsers: number;
  totalVideosGenerated: number;
}

export interface CreateVideoRequest {
  niche: Niche;
  length: VideoLength;
  language: Language;
  artStyle: ArtStyle;
  musicMood: MusicMood;
  captionStyle: CaptionStyle;
}

export interface GenerateScriptRequest {
  niche: Niche;
  length: VideoLength;
  language: Language;
  style: ArtStyle;
}

export interface GenerateVideoRequest {
  scriptId: string;
  userId: string;
  captionStyle: CaptionStyle;
  musicMood: MusicMood;
}

export interface WorkerRenderRequest {
  jobId: string;
  scenes: {
    imageUrl: string;
    audioUrl: string | null;
    durationSeconds: number;
    narration: string;
  }[];
  captionStyle: CaptionStyle;
  musicTrack: MusicMood;
  callbackUrl: string;
}

export interface WorkerRenderCallback {
  jobId: string;
  videoUrl: string;
  thumbnailUrl: string;
  success: boolean;
  error?: string;
}

export interface LemonSqueezyWebhookPayload {
  meta: {
    event_name: string;
    custom_data: {
      user_id?: string;
    };
  };
  data: {
    id: string;
    type: string;
    attributes: {
      customer_id: number;
      variant_id: number;
      status: string;
      urls: {
        customer_portal?: string;
      };
    };
  };
}
