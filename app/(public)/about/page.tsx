import { CheckCircle2 } from "lucide-react";

import { TrustSection } from "@/components/public/TrustSection";
import { brandConfig } from "@/lib/brand-config";

const values = [
  {
    title: "Integrity",
    description: "We approach property conversations with honesty, respect, and careful attention to the facts."
  },
  {
    title: "Transparency",
    description: "We keep communication direct so property owners understand the process and possible next steps."
  },
  {
    title: "Oklahoma Market Knowledge",
    description: "We focus on Oklahoma property conditions, local market realities, and practical real estate solutions."
  },
  {
    title: "Professional Guidance",
    description: "We help property owners evaluate options with a steady, organized, and professional process."
  }
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      <section className="bg-[#02213D] py-18 text-white md:py-24">
        <div className="container-shell">
          <div className="max-w-4xl">
            <p className="font-heading text-xs font-bold uppercase tracking-[0.22em] text-[#D4A017]">
              About
            </p>
            <h1 className="mt-5 font-heading text-4xl font-bold leading-tight md:text-6xl">
              About J Capital Property Group
            </h1>
            <p className="mt-6 max-w-3xl text-lg font-semibold leading-8 text-white/88">
              Professional real estate solutions built on integrity, transparency, and local market knowledge.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-18 md:py-24">
        <div className="container-shell">
          <div className="grid gap-10 md:grid-cols-[0.95fr_1.05fr] md:items-start">
            <div className="border-l-4 border-[#D4A017] bg-[#F2F4F7] p-6 md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6B7280]">Operating Company</p>
              <p className="mt-3 font-heading text-2xl font-bold text-[#02213D]">{brandConfig.companyLegalName}</p>
            </div>

            <div>
              <p className="text-base leading-8 text-[#1F2937]">
                J Capital Property Group helps Oklahoma property owners explore real estate opportunities with
                professionalism, transparency, and practical guidance. Every property situation is unique and deserves
                thoughtful attention. Our goal is to help property owners move forward confidently while providing
                clear communication and a straightforward process.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {values.map((value) => (
                  <article key={value.title} className="border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-[#D4A017]" aria-hidden="true" />
                      <h2 className="font-heading text-lg font-bold text-[#02213D]">{value.title}</h2>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[#4B5563]">{value.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <TrustSection />
    </div>
  );
}
