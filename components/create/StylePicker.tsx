// components/create/StylePicker.tsx
"use client";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ArtStyle, MusicMood, CaptionStyle } from "@/types";

const artStyles: { value: ArtStyle; label: string; preview: string }[] = [
  { value: "Realistic", label: "Realistic", preview: "Photorealistic imagery" },
  { value: "Anime", label: "Anime", preview: "Japanese anime style" },
  { value: "Dark Fantasy", label: "Dark Fantasy", preview: "Dark moody fantasy" },
  { value: "Cinematic", label: "Cinematic", preview: "Movie-like scenes" },
  { value: "Cartoon", label: "Cartoon", preview: "Colorful cartoon art" },
  { value: "Minimalist", label: "Minimalist", preview: "Clean minimal design" },
];

const musicMoods: { value: MusicMood; label: string }[] = [
  { value: "none", label: "No Music" },
  { value: "epic", label: "Epic" },
  { value: "chill", label: "Chill" },
  { value: "mysterious", label: "Mysterious" },
  { value: "motivational", label: "Motivational" },
  { value: "sad", label: "Sad" },
];

const captionStyles: { value: CaptionStyle; label: string }[] = [
  { value: "bold_white", label: "Bold White" },
  { value: "neon_green", label: "Neon Green" },
  { value: "minimal", label: "Minimal" },
  { value: "none", label: "No Captions" },
];

interface StylePickerProps {
  artStyle: ArtStyle | "";
  musicMood: MusicMood | "";
  captionStyle: CaptionStyle | "";
  onArtStyleChange: (value: ArtStyle) => void;
  onMusicMoodChange: (value: MusicMood) => void;
  onCaptionStyleChange: (value: CaptionStyle) => void;
}

export default function StylePicker({
  artStyle,
  musicMood,
  captionStyle,
  onArtStyleChange,
  onMusicMoodChange,
  onCaptionStyleChange,
}: StylePickerProps) {
  return (
    <div className="space-y-8">
      {/* Art Style Grid */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Art Style
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {artStyles.map((style) => (
            <button
              key={style.value}
              onClick={() => onArtStyleChange(style.value)}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 cursor-pointer",
                artStyle === style.value
                  ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/10"
                  : "border-[#2a2a3e] bg-[#12121a] hover:border-[#3a3a4e] hover:bg-[#1a1a2e]"
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center text-xl",
                  artStyle === style.value
                    ? "bg-gradient-to-br from-purple-600/30 to-pink-600/30"
                    : "bg-[#1a1a2e]"
                )}
              >
                {style.value === "Realistic" && "📷"}
                {style.value === "Anime" && "🎌"}
                {style.value === "Dark Fantasy" && "🌑"}
                {style.value === "Cinematic" && "🎬"}
                {style.value === "Cartoon" && "🎨"}
                {style.value === "Minimalist" && "◻️"}
              </div>
              <span
                className={cn(
                  "text-sm font-medium",
                  artStyle === style.value ? "text-white" : "text-gray-400"
                )}
              >
                {style.label}
              </span>
              <span className="text-xs text-gray-500 text-center">
                {style.preview}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Music Mood */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Music Mood
        </label>
        <Select
          value={musicMood}
          onValueChange={(v) => onMusicMoodChange(v as MusicMood)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select music mood" />
          </SelectTrigger>
          <SelectContent>
            {musicMoods.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Caption Style */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Caption Style
        </label>
        <Select
          value={captionStyle}
          onValueChange={(v) => onCaptionStyleChange(v as CaptionStyle)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select caption style" />
          </SelectTrigger>
          <SelectContent>
            {captionStyles.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
