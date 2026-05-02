// components/landing/Testimonials.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Star } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: "Alex M.",
    role: "Content Creator",
    content:
      "ReelForge completely changed my channel. I went from spending 8 hours per video to literally pressing one button. My TikTok went from 500 to 50K followers in 3 months.",
    rating: 5,
  },
  {
    name: "Sarah K.",
    role: "TikTok Star",
    content:
      "I was skeptical at first, but the AI scripts are genuinely good. The mythology series I created has over 2M views now. This tool is a game-changer.",
    rating: 5,
  },
  {
    name: "Marcus D.",
    role: "YouTube Creator",
    content:
      "The auto-posting feature alone is worth the price. I set up 3 series and they just run. Consistent content without me touching anything.",
    rating: 5,
  },
  {
    name: "Priya S.",
    role: "Social Media Manager",
    content:
      "Managing multiple client accounts was stressful until I found ReelForge. Now I can produce faceless content for 5 clients simultaneously.",
    rating: 4,
  },
  {
    name: "James R.",
    role: "Faceless Channel Owner",
    content:
      "The dark fantasy art style is incredible. My scary story videos look so cinematic that people can't believe they're AI-generated.",
    rating: 5,
  },
  {
    name: "Linda C.",
    role: "Digital Nomad",
    content:
      "I literally make videos from my laptop in a cafe in Bali. ReelForge handles the creative work while I enjoy my freedom. Best investment ever.",
    rating: 5,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-[#1a1a2e] text-[#2a2a3e]"
          }`}
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();

    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => clearInterval(autoplay);
  }, [emblaApi]);

  return (
    <section className="py-24 bg-[#0a0a0f]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Loved by Creators
          </h2>
          <p className="mt-4 text-gray-400">
            Join thousands of creators already using ReelForge.
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {testimonials.map((t) => (
                <div
                  key={t.name}
                  className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)]"
                >
                  <div className="h-full bg-[#12121a] border border-[#2a2a3e] rounded-xl p-6 flex flex-col">
                    <StarRating rating={t.rating} />
                    <p className="mt-4 text-sm text-gray-300 leading-relaxed flex-1">
                      &ldquo;{t.content}&rdquo;
                    </p>
                    <div className="mt-4 pt-4 border-t border-[#2a2a3e]">
                      <p className="text-sm font-semibold text-white">
                        {t.name}
                      </p>
                      <p className="text-xs text-gray-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-[#12121a] border border-[#2a2a3e] flex items-center justify-center text-gray-400 hover:text-white hover:border-purple-500/50 transition-colors hidden sm:flex"
            aria-label="Previous"
          >
            &larr;
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-[#12121a] border border-[#2a2a3e] flex items-center justify-center text-gray-400 hover:text-white hover:border-purple-500/50 transition-colors hidden sm:flex"
            aria-label="Next"
          >
            &rarr;
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === selectedIndex
                    ? "bg-purple-500 w-6"
                    : "bg-[#2a2a3e] hover:bg-[#3a3a4e]"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
