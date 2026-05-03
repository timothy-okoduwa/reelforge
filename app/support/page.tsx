"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Mail,
  MessageCircle,
  BookOpen,
  Video,
} from "lucide-react";
import type { ReactNode } from "react";

interface Channel {
  icon: ReactNode;
  title: string;
  description: string;
  action: string;
  href: string;
}

const channels: Channel[] = [
  {
    icon: <Mail className="h-6 w-6" />,
    title: "Email Support",
    description:
      "Get a response within 24 hours. Best for account issues, billing questions, and detailed technical problems.",
    action: "Send Email",
    href: "mailto:support@reelforge.com",
  },
  {
    icon: <MessageCircle className="h-6 w-6" />,
    title: "Community Discord",
    description:
      "Chat with other ReelForge users and our team in real time. Great for tips, feedback, and quick questions.",
    action: "Join Discord",
    href: "https://discord.gg/reelforge",
  },
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: "Documentation",
    description:
      "Step-by-step guides on setting up your account, creating videos, connecting social platforms, and more.",
    action: "Read Docs",
    href: "/faq",
  },
  {
    icon: <Video className="h-6 w-6" />,
    title: "Video Tutorials",
    description:
      "Watch walkthroughs of every feature — from your first video to setting up auto-posting series.",
    action: "Watch Tutorials",
    href: "https://youtube.com/@reelforge",
  },
];

export default function SupportPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />

      <section className="pt-24 pb-16 px-4 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
          How Can We Help?
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-lg text-gray-400">
          We&apos;re here to make sure your ReelForge experience is smooth.
          Pick the support channel that works best for you.
        </p>
      </section>

      <section className="py-8 pb-20 px-4 bg-[#0a0a0f]">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {channels.map((channel) => (
            <Card
              key={channel.title}
              className="group border-[#2a2a3e] hover:border-purple-500/50 transition-all duration-300"
            >
              <CardContent className="p-8 flex flex-col h-full">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/20 mb-4">
                  <span className="text-purple-400">{channel.icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {channel.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed flex-1">
                  {channel.description}
                </p>
                <a href={channel.href}>
                  <Button variant="secondary" size="sm" className="mt-4">
                    {channel.action}
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
