import { Mail, Phone } from "lucide-react";

import { ContactSection } from "@/components/public/ContactSection";
import { TrustSection } from "@/components/public/TrustSection";
import { brandConfig } from "@/lib/brand-config";

const processSteps = [
  {
    step: "01",
    title: "Contact Us",
    description: "Call or email to share your property questions and the situation you are working through."
  },
  {
    step: "02",
    title: "Property Review",
    description: "We review the property details, condition, timing, and practical considerations with care."
  },
  {
    step: "03",
    title: "Explore Options",
    description: "We discuss possible next steps clearly so you can compare options without pressure."
  },
  {
    step: "04",
    title: "Move Forward",
    description: "If a path makes sense, we help keep the process organized, direct, and professional."
  }
];

const situations = [
  "Inherited property",
  "Repairs needed",
  "Landlord fatigue",
  "Timeline changes",
  "Vacant property",
  "Financial uncertainty"
];

export default function SellYourPropertyPage() {
  return (
    <div className="bg-white">
      <section className="bg-[#02213D] py-18 text-white md:py-24">
        <div className="container-shell">
          <div className="max-w-4xl">
            <p className="font-heading text-xs font-bold uppercase tracking-[0.22em] text-[#D4A017]">
              Sell Your Property
            </p>
            <h1 className="mt-5 font-heading text-4xl font-bold leading-tight md:text-6xl">
              Professional Property Solutions for Oklahoma Property Owners
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/82 md:text-lg">
              Property decisions can involve repairs, timing, ownership changes, or financial uncertainty. J Capital
              Property Group provides a calm, professional place to discuss your situation and understand practical
              next steps without pressure.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={brandConfig.phoneHref}
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-md bg-[#D4A017] px-6 py-3.5 font-heading text-sm font-bold text-[#02213D] transition hover:bg-[#e0af2e]"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                {brandConfig.phone}
              </a>
              <a
                href={`mailto:${brandConfig.primaryEmail}`}
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-md border border-white/20 bg-white/8 px-6 py-3.5 font-heading text-sm font-bold text-white transition hover:bg-white/14"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                Email Us
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F2F4F7] py-18 md:py-24">
        <div className="container-shell">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-heading text-3xl font-bold text-[#02213D] md:text-5xl">A Simple Process</h2>
            <p className="mt-4 text-base leading-7 text-[#4B5563]">
              Each conversation is handled with clarity, respect, and attention to the details that matter for your
              property.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {processSteps.map((item) => (
              <article key={item.step} className="border border-slate-200 bg-white p-6 shadow-sm">
                <p className="font-heading text-sm font-bold text-[#D4A017]">{item.step}</p>
                <h3 className="mt-3 font-heading text-xl font-bold text-[#02213D]">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#4B5563]">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-18 md:py-24">
        <div className="container-shell">
          <div className="grid gap-10 md:grid-cols-[0.85fr_1.15fr] md:items-start">
            <div>
              <p className="font-heading text-xs font-bold uppercase tracking-[0.22em] text-[#D4A017]">
                Common Situations
              </p>
              <h2 className="mt-4 font-heading text-3xl font-bold leading-tight text-[#02213D] md:text-5xl">
                Property circumstances deserve thoughtful guidance
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {situations.map((situation) => (
                <div key={situation} className="border-l-4 border-[#D4A017] bg-[#F2F4F7] px-5 py-4">
                  <p className="font-heading text-base font-bold text-[#02213D]">{situation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <TrustSection />
      <ContactSection />
    </div>
  );
}
