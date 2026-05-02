// components/landing/FAQ.tsx
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "What is ReelForge?",
    a: "ReelForge is an AI-powered platform that automatically generates faceless short-form videos for TikTok, Instagram Reels, and YouTube Shorts. Just pick your niche and style, and our AI handles the rest — script, visuals, voiceover, and posting.",
  },
  {
    q: "How does it work?",
    a: "Choose your niche and art style, then our AI writes a viral script, generates images, creates voiceover audio, and renders a complete video. On paid plans, it can even auto-post to your connected social accounts.",
  },
  {
    q: "Do I need to show my face?",
    a: "No! That's the whole point. ReelForge creates faceless videos — everything is AI-generated, from visuals to narration. Your identity stays completely private.",
  },
  {
    q: "What niches are available?",
    a: "We support 10+ niches including Mythology, Scary Stories, History, True Crime, Bible Stories, Anime Stories, Motivational, Facts, Heist Stories, and School Drama. More are added regularly.",
  },
  {
    q: "Can I edit the AI-generated script?",
    a: "Yes! After the AI generates a script, you can review and edit every scene before the video is rendered. Change the narration, image prompts, or timing.",
  },
  {
    q: "What video lengths are supported?",
    a: "We support 30-second, 60-second, and 90-second videos — perfect for all short-form platforms.",
  },
  {
    q: "How does auto-posting work?",
    a: "On Starter and above plans, connect your TikTok, Instagram, and/or YouTube accounts. Then set up a series with your preferred posting schedule, and ReelForge will automatically generate and post videos on your behalf.",
  },
  {
    q: "Can I cancel my subscription?",
    a: "Yes, you can cancel anytime through the billing portal. You'll retain access until the end of your billing period, then your account reverts to the free plan.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 px-4 bg-[#0a0a0f]">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-[#2a2a3e] rounded-xl bg-[#12121a] overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#1a1a2e] transition-colors"
              >
                <span className="font-medium pr-4">{faq.q}</span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-gray-400 flex-shrink-0 transition-transform",
                    openIndex === i && "rotate-180"
                  )}
                />
              </button>
              {openIndex === i && (
                <div className="px-4 pb-4 text-gray-400 text-sm leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
