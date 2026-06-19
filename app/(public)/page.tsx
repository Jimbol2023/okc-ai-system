import Link from "next/link";

import { ContactSection } from "@/components/public/ContactSection";
import { HeroSection } from "@/components/public/HeroSection";
import { TrustSection } from "@/components/public/TrustSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustSection />
      <section className="bg-white py-18 md:py-24">
        <div className="container-shell">
          <div className="grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-center">
            <div>
              <p className="font-heading text-xs font-bold uppercase tracking-[0.22em] text-[#D4A017]">
                About
              </p>
              <h2 className="mt-4 font-heading text-3xl font-bold leading-tight text-[#02213D] md:text-5xl">
                Local real estate guidance with a professional standard
              </h2>
            </div>
            <div className="border-l-4 border-[#D4A017] bg-[#F2F4F7] p-6 md:p-8">
              <p className="text-base leading-8 text-[#1F2937]">
                J Capital Property Group helps Oklahoma property owners explore real estate opportunities with
                professionalism, transparency, and practical guidance.
              </p>
              <Link
                href="/about"
                className="mt-6 inline-flex min-h-12 items-center justify-center rounded-md bg-[#02213D] px-5 py-3 font-heading text-sm font-bold text-white transition hover:bg-[#01172c]"
              >
                Learn About J Capital
              </Link>
            </div>
          </div>
        </div>
      </section>
      <ContactSection />
    </>
  );
}
