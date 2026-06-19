import Link from "next/link";

import { ContactSection } from "@/components/public/ContactSection";
import { HeroSection } from "@/components/public/HeroSection";
import { TrustSection } from "@/components/public/TrustSection";
import { brandConfig } from "@/lib/brand-config";
import { createPublicPageMetadata } from "@/lib/public-seo";

export const metadata = createPublicPageMetadata({
  path: "/",
  title: "Professional Real Estate Solutions for Oklahoma Property Owners",
  description:
    "J Capital Property Group helps Oklahoma property owners explore real estate opportunities with professionalism, transparency, and local market knowledge."
});

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustSection />
      <section className="bg-[#F2F4F7] py-18 md:py-24">
        <div className="container-shell">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-heading text-xs font-bold uppercase tracking-[0.22em] text-[#D4A017]">
              How The Conversation Works
            </p>
            <h2 className="mt-4 font-heading text-3xl font-bold leading-tight text-[#02213D] md:text-5xl">
              Clear steps, thoughtful review, and room to decide
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {["You contact us", "We review the situation", "We discuss possible next steps", "You decide what makes sense"].map(
              (step, index) => (
                <article key={step} className="border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="font-heading text-sm font-bold text-[#D4A017]">{String(index + 1).padStart(2, "0")}</p>
                  <h3 className="mt-3 font-heading text-lg font-bold text-[#02213D]">{step}</h3>
                </article>
              )
            )}
          </div>
        </div>
      </section>
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
              <p className="mt-4 text-sm leading-6 text-[#4B5563]">
                For property questions, private situations, or timing concerns, our team is available at{" "}
                <a href={brandConfig.phoneHref} className="font-semibold text-[#02213D] underline underline-offset-4">
                  {brandConfig.phone}
                </a>
                .
              </p>
              <Link
                href="/about"
                className="mt-6 inline-flex min-h-12 items-center justify-center rounded-md bg-[#D4A017] px-5 py-3 font-heading text-sm font-bold text-[#02213D] shadow-[0_12px_28px_rgba(212,160,23,0.22)] transition hover:bg-[#B88712] hover:text-[#02213D] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#02213D]"
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
