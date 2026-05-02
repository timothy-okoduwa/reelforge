// components/landing/Features.tsx
"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { PenTool, Image, Share2 } from "lucide-react";
import type { ReactNode } from "react";

interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <PenTool className="h-6 w-6" />,
    title: "AI Script Writer",
    description:
      "Tell us your niche and style. Our AI crafts compelling scripts with scene-by-scene narration and image prompts tailored for maximum engagement.",
  },
  {
    icon: <Image className="h-6 w-6" />,
    title: "AI Visual Generator",
    description:
      "Stunning AI-generated images and voiceovers for every scene. Choose from realistic, anime, dark fantasy, cinematic, and more art styles.",
  },
  {
    icon: <Share2 className="h-6 w-6" />,
    title: "Auto-Post Everywhere",
    description:
      "Set it and forget it. Automatically post to TikTok, YouTube Shorts, and Instagram Reels on a schedule you control.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-[#0a0a0f]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Everything You Need to Go Viral
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            From script to screen to social — ReelForge handles every step so
            you never have to show your face or touch editing software.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <Card className="group relative overflow-hidden border-[#2a2a3e] hover:border-purple-500/50 transition-all duration-300">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="relative p-8">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/20 mb-4">
                    <span className="text-purple-400">{feature.icon}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
