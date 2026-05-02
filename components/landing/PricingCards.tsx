// components/landing/PricingCards.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  featured?: boolean;
  variantId: string;
}

const plans: Plan[] = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Try it out with basic features",
    features: [
      "2 videos per month",
      "1 art style",
      "720p resolution",
      "Manual download only",
    ],
    cta: "Get Started",
    variantId: "",
  },
  {
    name: "Starter",
    price: "$19",
    period: "/month",
    description: "For creators just getting started",
    features: [
      "15 videos per month",
      "All art styles",
      "1080p resolution",
      "Auto-post to 1 platform",
      "AI script editing",
    ],
    cta: "Start Starter",
    variantId: process.env.NEXT_PUBLIC_LS_STARTER_VARIANT_ID ?? "",
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    description: "For serious content creators",
    features: [
      "60 videos per month",
      "All art styles",
      "1080p resolution",
      "Auto-post to 3 platforms",
      "AI script editing",
      "Priority rendering",
      "Series automation",
    ],
    cta: "Start Pro",
    featured: true,
    variantId: process.env.NEXT_PUBLIC_LS_PRO_VARIANT_ID ?? "",
  },
  {
    name: "Unlimited",
    price: "$99",
    period: "/month",
    description: "For agencies and power users",
    features: [
      "Unlimited videos",
      "All art styles",
      "1080p resolution",
      "Auto-post to all platforms",
      "AI script editing",
      "Priority rendering",
      "Series automation",
      "API access",
      "Dedicated support",
    ],
    cta: "Start Unlimited",
    variantId: process.env.NEXT_PUBLIC_LS_UNLIMITED_VARIANT_ID ?? "",
  },
];

export default function PricingCards() {
  const handleCheckout = (variantId: string) => {
    if (!variantId) return;
    // LemonSqueezy checkout — in production this uses the LemonSqueezy.js overlay
    window.open(
      `https://reelforge.lemonsqueezy.com/checkout/buy/${variantId}`,
      "_blank"
    );
  };

  return (
    <section id="pricing" className="py-24 bg-[#0a0a0f]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-gray-400">
            Start free. Upgrade when you&apos;re ready to scale.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col bg-[#12121a] border rounded-xl p-6 transition-all duration-300",
                plan.featured
                  ? "border-purple-500/50 shadow-lg shadow-purple-500/10 scale-[1.02]"
                  : "border-[#2a2a3e] hover:border-[#3a3a4e]"
              )}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 border-0 text-white px-3 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="text-sm text-gray-500">{plan.period}</span>
                </div>
              </div>

              <ul className="flex-1 space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.featured ? "default" : "secondary"}
                className="w-full"
                onClick={() => handleCheckout(plan.variantId)}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
