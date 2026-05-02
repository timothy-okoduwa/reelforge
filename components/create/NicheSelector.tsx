// components/create/NicheSelector.tsx
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Niche, VideoLength, Language } from "@/types";

const niches: Niche[] = [
  "Mythology",
  "Scary Stories",
  "History",
  "True Crime",
  "Bible Stories",
  "Anime Stories",
  "Motivational",
  "Facts",
  "Heist Stories",
  "School Drama",
];

const videoLengths: { value: string; label: string }[] = [
  { value: "30", label: "30 seconds" },
  { value: "60", label: "60 seconds" },
  { value: "90", label: "90 seconds" },
];

const languages: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "pt", label: "Portuguese" },
];

interface NicheSelectorProps {
  niche: Niche | "";
  length: VideoLength | "";
  language: Language | "";
  onNicheChange: (value: Niche) => void;
  onLengthChange: (value: VideoLength) => void;
  onLanguageChange: (value: Language) => void;
}

export default function NicheSelector({
  niche,
  length,
  language,
  onNicheChange,
  onLengthChange,
  onLanguageChange,
}: NicheSelectorProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Niche
        </label>
        <Select
          value={niche}
          onValueChange={(v) => onNicheChange(v as Niche)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a niche" />
          </SelectTrigger>
          <SelectContent>
            {niches.map((n) => (
              <SelectItem key={n} value={n}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Video Length
        </label>
        <Select
          value={length ? String(length) : ""}
          onValueChange={(v) => onLengthChange(Number(v) as VideoLength)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select length" />
          </SelectTrigger>
          <SelectContent>
            {videoLengths.map((l) => (
              <SelectItem key={l.value} value={l.value}>
                {l.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Language
        </label>
        <Select
          value={language}
          onValueChange={(v) => onLanguageChange(v as Language)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((l) => (
              <SelectItem key={l.value} value={l.value}>
                {l.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
