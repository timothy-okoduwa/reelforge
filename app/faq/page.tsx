import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FAQ from "@/components/landing/FAQ";

export default function FAQPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />

      <section className="pt-24 pb-4 px-4 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
          Frequently Asked Questions
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-lg text-gray-400">
          Everything you need to know about ReelForge.
        </p>
      </section>

      <FAQ />

      <section className="py-16 px-4 bg-[#0a0a0f] border-t border-[#2a2a3e]">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-xl font-semibold text-white mb-3">
            Still have questions?
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Reach out to us and we&apos;ll get back to you within 24 hours.
          </p>
          <a
            href="mailto:support@reelforge.com"
            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all"
          >
            Contact Support
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
