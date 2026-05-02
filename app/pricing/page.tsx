// app/pricing/page.tsx
import Navbar from "@/components/layout/Navbar";
import PricingCards from "@/components/landing/PricingCards";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/layout/Footer";

export default function PricingPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <section className="flex flex-col items-center justify-center px-4 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Simple, transparent pricing
        </h1>
        <p className="mt-4 max-w-xl text-lg text-gray-400">
          Pick the plan that fits your content schedule. Upgrade or cancel anytime.
        </p>
      </section>
      <PricingCards />
      <FAQ />
      <Footer />
    </main>
  );
}
