import { CheckCircle2 } from "lucide-react";

const values = ["Integrity", "Transparency", "Oklahoma Market Knowledge", "Professional Guidance"];

export function AboutSection() {
  return (
    <section id="about" className="bg-white py-18 md:py-24">
      <div className="container-shell">
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-start">
          <div>
            <p className="font-heading text-xs font-bold uppercase tracking-[0.22em] text-[#D4A017]">
              About
            </p>
            <h2 className="mt-4 font-heading text-3xl font-bold leading-tight text-[#02213D] md:text-5xl">
              About J Capital Property Group
            </h2>
            <p className="mt-5 text-lg font-semibold leading-8 text-[#1F2937]">
              Professional real estate solutions built on integrity, transparency, and local market knowledge.
            </p>
          </div>

          <div className="border-l-4 border-[#D4A017] bg-[#F2F4F7] p-6 md:p-8">
            <p className="text-base leading-8 text-[#1F2937]">
              J Capital Property Group helps Oklahoma property owners explore real estate opportunities with
              professionalism, transparency, and practical guidance. Every property situation is unique and deserves
              thoughtful attention. Our goal is to help property owners move forward confidently while providing clear
              communication and a straightforward process.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {values.map((value) => (
                <div key={value} className="flex items-center gap-3 bg-white px-4 py-3 text-sm font-semibold text-[#02213D]">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#D4A017]" aria-hidden="true" />
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
