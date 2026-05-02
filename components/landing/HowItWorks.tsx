// components/landing/HowItWorks.tsx
"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: 1,
    title: "Choose Your Niche & Style",
    description:
      "Pick from mythology, scary stories, true crime, and more. Select your art style, video length, language, and caption preferences.",
  },
  {
    number: 2,
    title: "AI Generates Script & Visuals",
    description:
      "Our AI writes a compelling script, generates matching visuals, and creates a natural-sounding voiceover for each scene.",
  },
  {
    number: 3,
    title: "Video Rendered & Posted",
    description:
      "Your video is rendered in HD and automatically posted to TikTok, YouTube Shorts, and Instagram Reels on your schedule.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-[#0a0a0f]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            How It Works
          </h2>
          <p className="mt-4 text-gray-400">
            Three simple steps from idea to viral video.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-purple-600 via-pink-600 to-purple-600 md:left-1/2 md:-translate-x-px" />

          <div className="space-y-12">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className={`relative flex items-start gap-6 md:gap-12 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Step number */}
                <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg shrink-0 shadow-lg shadow-purple-500/30">
                  {step.number}
                </div>

                {/* Content */}
                <div className="flex-1 bg-[#12121a] border border-[#2a2a3e] rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
