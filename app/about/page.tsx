import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Zap, Shield, Users, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { ReactNode } from "react";

interface Value {
  icon: ReactNode;
  title: string;
  description: string;
}

const values: Value[] = [
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Speed",
    description:
      "From idea to published video in under 2 minutes. We automate every step so you can focus on strategy, not production.",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Privacy",
    description:
      "Faceless by design. Your identity stays completely private — our AI handles all visuals and narration.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Creator-First",
    description:
      "Built by creators, for creators. Every feature is designed to help you grow your audience without burning out.",
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: "Consistency",
    description:
      "Set up a series and let ReelForge post on schedule. No more missed upload days or creative blocks.",
  },
];

export default function AboutPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />

      <section className="pt-24 pb-16 px-4 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
          About ReelForge
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
          We&apos;re building the future of faceless content creation — where
          anyone can produce viral short-form videos without showing their face
          or touching editing software.
        </p>
      </section>

      <section className="py-16 px-4 bg-[#0a0a0f]">
        <div className="max-w-3xl mx-auto space-y-6 text-gray-400 leading-relaxed">
          <p>
            ReelForge was born from a simple frustration: creating consistent,
            high-quality short-form content takes too much time. Between
            scripting, finding visuals, recording voiceovers, editing, and
            posting — a single 60-second video can eat hours of your day.
          </p>
          <p>
            We believed there had to be a better way. So we built an AI-powered
            pipeline that handles every step automatically. You pick your niche
            and style, and ReelForge generates the script, creates the visuals,
            produces the voiceover, renders the final video, and — if you want
            — posts it straight to TikTok, Instagram Reels, and YouTube Shorts.
          </p>
          <p>
            Our mission is to democratize content creation. Whether you&apos;re
            a solo creator growing your first account or an agency managing
            dozens of channels, ReelForge lets you produce at scale without
            scaling your workload.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-[#0a0a0f]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value) => (
              <Card
                key={value.title}
                className="group border-[#2a2a3e] hover:border-purple-500/50 transition-all duration-300"
              >
                <CardContent className="p-8">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/20 mb-4">
                    <span className="text-purple-400">{value.icon}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-[#0a0a0f] border-t border-[#2a2a3e]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">The Team</h2>
          <p className="text-gray-400">
            We&apos;re a small, focused team of engineers and creators who care
            deeply about building tools that actually help people. If you have
            questions, ideas, or just want to say hi — we&apos;re always
            reachable at{" "}
            <a
              href="mailto:support@reelforge.com"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              support@reelforge.com
            </a>
            .
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
