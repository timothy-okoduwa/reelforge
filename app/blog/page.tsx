import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
}

const posts: Post[] = [
  {
    slug: "getting-started-with-faceless-content",
    title: "Getting Started with Faceless Content in 2026",
    excerpt:
      "Everything you need to know about the faceless creator movement — why it works, which niches are hottest, and how ReelForge makes it effortless.",
    date: "2026-04-28",
    category: "Guides",
  },
  {
    slug: "top-10-niches-for-short-form-video",
    title: "Top 10 Niches for Short-Form Video Right Now",
    excerpt:
      "From true crime to motivational quotes — we analyzed millions of views to find the niches with the highest engagement and lowest competition.",
    date: "2026-04-15",
    category: "Strategy",
  },
  {
    slug: "how-ai-is-changing-content-creation",
    title: "How AI Is Changing Content Creation",
    excerpt:
      "AI video generation isn't the future — it's the present. Here's how creators are using tools like ReelForge to produce 10x more content without 10x more work.",
    date: "2026-03-30",
    category: "Industry",
  },
  {
    slug: "auto-posting-tiktok-instagram-youtube",
    title: "Auto-Posting to TikTok, Instagram & YouTube",
    excerpt:
      "A deep dive into setting up scheduled posting across all three platforms, including best times to post and how to avoid algorithm penalties.",
    date: "2026-03-12",
    category: "Guides",
  },
  {
    slug: "monetizing-faceless-youtube-shorts",
    title: "Monetizing Faceless YouTube Shorts",
    excerpt:
      "YouTube's Shorts monetization is here. Learn how faceless creators are earning real revenue and how to qualify faster.",
    date: "2026-02-20",
    category: "Strategy",
  },
  {
    slug: "reelforge-2-0-launch",
    title: "Announcing ReelForge 2.0",
    excerpt:
      "Series scheduling, new art styles, faster rendering, and more. Here's everything that's new in our biggest update yet.",
    date: "2026-02-01",
    category: "Product",
  },
];

export default function BlogPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />

      <section className="pt-24 pb-16 px-4 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
          Blog
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-lg text-gray-400">
          Tips, strategies, and updates for faceless content creators.
        </p>
      </section>

      <section className="py-8 pb-20 px-4 bg-[#0a0a0f]">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <Card
              key={post.slug}
              className="group border-[#2a2a3e] hover:border-purple-500/50 transition-all duration-300"
            >
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-500">{post.date}</span>
                </div>
                <h2 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>
                <p className="text-sm text-gray-400 leading-relaxed flex-1">
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 mt-4 transition-colors"
                >
                  Read more
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
