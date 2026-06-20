import Link from "next/link";

import { ContactSection } from "@/components/public/ContactSection";
import { HeroSection } from "@/components/public/HeroSection";
import { ServiceAreaLinks } from "@/components/public/ServiceAreaLinks";
import { TrustSection } from "@/components/public/TrustSection";
import { brandConfig } from "@/lib/brand-config";
import { createPublicPageMetadata } from "@/lib/public-seo";

export const metadata = createPublicPageMetadata({
  path: "/",
  title: "Professional Real Estate Solutions for Oklahoma Property Owners",
  description:
    "J Capital Property Group helps Oklahoma property owners explore real estate opportunities with professionalism, transparency, and local market knowledge."
});

const conversationSteps = [
  {
    title: "Contact J Capital",
    description: "Start with the path that fits your need: general contact or a property-specific discussion."
  },
  {
    title: "Discuss Your Situation",
    description: "Share the property details, timing, and circumstances you want help thinking through."
  },
  {
    title: "Review Possible Options",
    description: "Talk through practical paths and considerations in plain language."
  },
  {
    title: "Decide What Makes Sense",
    description: "Choose the next step that fits your goals, timeline, and comfort level."
  }
];

const faqPreview = [
  {
    question: "Is there any obligation?",
    answer: "No. Contacting J Capital Property Group starts a conversation so you can decide what makes sense."
  },
  {
    question: "What property situations do you discuss?",
    answer: "Inherited property, vacant homes, repairs, landlord concerns, relocation, timing, and private questions."
  },
  {
    question: "How do I contact J Capital Property Group?",
    answer: `Call ${brandConfig.phone} or email ${brandConfig.primaryEmail}.`
  },
  {
    question: "What areas do you serve?",
    answer: "J Capital Property Group focuses on Oklahoma property conversations."
  }
];

const resourcePreview = [
  {
    href: "/resources/education",
    title: "Education Center",
    description: "Start with learning paths, authority guides, video lessons, and property insights."
  },
  {
    href: "/resources/education/probate-basics-oklahoma-property-owners",
    title: "Probate Basics",
    description: "General education for inherited property, documents, timing, and authority questions."
  },
  {
    href: "/resources/videos",
    title: "Video Learning Center",
    description: "Transcript-first video pages for common Oklahoma property situations."
  },
  {
    href: "/resources/property-insights",
    title: "Property Insights",
    description: "Evergreen topics for understanding property questions without dated market updates."
  }
] as const;

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
          <ol className="mt-10 grid gap-4 md:grid-cols-4" aria-label="Property conversation decision path">
            {conversationSteps.map((step, index) => (
              <li key={step.title} className="border border-slate-200 bg-white p-5 shadow-sm">
                <p className="font-heading text-sm font-bold text-[#D4A017]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-heading text-lg font-bold text-[#02213D]">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#4B5563]">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="bg-white py-18 md:py-24" aria-labelledby="homepage-faq-heading">
        <div className="container-shell">
          <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-start">
            <div>
              <p className="font-heading text-xs font-bold uppercase tracking-[0.22em] text-[#D4A017]">
                FAQ
              </p>
              <h2 id="homepage-faq-heading" className="mt-4 font-heading text-3xl font-bold leading-tight text-[#02213D] md:text-5xl">
                Frequently Asked Questions
              </h2>
              <Link
                href="/faq"
                className="mt-6 inline-flex min-h-12 items-center justify-center rounded-md border border-[#02213D]/18 bg-white px-5 py-3 font-heading text-sm font-bold text-[#02213D] transition hover:bg-[#F2F4F7]"
              >
                View All FAQs
              </Link>
            </div>
            <div className="grid gap-3">
              {faqPreview.map((item) => (
                <article key={item.question} className="border border-slate-200 bg-[#F2F4F7] p-5">
                  <h3 className="font-heading text-lg font-bold text-[#02213D]">{item.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#4B5563]">{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#F2F4F7] py-18 md:py-24" aria-labelledby="homepage-resources-heading">
        <div className="container-shell">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-heading text-xs font-bold uppercase tracking-[0.22em] text-[#D4A017]">
              Education Center
            </p>
            <h2 id="homepage-resources-heading" className="mt-4 font-heading text-3xl font-bold leading-tight text-[#02213D] md:text-5xl">
              Property Owner Education Center
            </h2>
            <p className="mt-4 text-base leading-7 text-[#4B5563]">
              Evergreen guides, transcript-first video lessons, and property insights for Oklahoma owners who want to
              understand practical choices.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {resourcePreview.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border border-slate-200 bg-white p-5 shadow-sm transition hover:bg-[#F8FAFC]"
              >
                <span className="block font-heading text-lg font-bold text-[#02213D]">{item.title}</span>
                <span className="mt-3 block text-sm leading-6 text-[#4B5563]">{item.description}</span>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/resources/education"
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-[#02213D]/18 bg-white px-5 py-3 font-heading text-sm font-bold text-[#02213D] transition hover:bg-[#eef1f5]"
            >
              Open Education Center
            </Link>
          </div>
        </div>
      </section>
      <section className="bg-white py-18 md:py-24" aria-labelledby="homepage-service-areas-heading">
        <div className="container-shell">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-heading text-xs font-bold uppercase tracking-[0.22em] text-[#D4A017]">
              Service Areas
            </p>
            <h2
              id="homepage-service-areas-heading"
              className="mt-4 font-heading text-3xl font-bold leading-tight text-[#02213D] md:text-5xl"
            >
              Oklahoma Service Areas
            </h2>
            <p className="mt-4 text-base leading-7 text-[#4B5563]">
              Local property guidance pages for Oklahoma owners who want a professional place to start.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-4xl">
            <ServiceAreaLinks />
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
