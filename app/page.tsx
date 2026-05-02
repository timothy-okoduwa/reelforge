// app/page.tsx
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import PricingCards from "@/components/landing/PricingCards";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/layout/Footer";

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <Hero />
      <div id="features">
        <Features />
      </div>
      <HowItWorks />
      <PricingCards />
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  );
}
