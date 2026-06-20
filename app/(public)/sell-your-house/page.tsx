import Image from "next/image";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";

import { ContactSection } from "@/components/public/ContactSection";
import { TrustSection } from "@/components/public/TrustSection";
import { brandConfig } from "@/lib/brand-config";
import { createPublicPageMetadata } from "@/lib/public-seo";

export const metadata = createPublicPageMetadata({
  path: "/sell-your-house",
  title: "Discuss Your Property",
  description:
    "Discuss inherited property, vacant property, deferred maintenance, landlord fatigue, relocation, or private property questions with J Capital Property Group."
});

const processSteps = [
  {
    step: "01",
    title: "Contact J Capital",
    description: "Call or email when you want a private place to ask property questions."
  },
  {
    step: "02",
    title: "Discuss Your Situation",
    description: "Talk through inherited property, vacancy, repairs, landlord concerns, relocation, or other details."
  },
  {
    step: "03",
    title: "Review Possible Options",
    description: "Review practical considerations clearly so you can compare possible paths without pressure."
  },
  {
    step: "04",
    title: "Decide What Makes Sense",
    description: "You choose whether any path fits your goals, timing, and property circumstances."
  }
];

const situations = [
  {
    title: "Inherited property",
    description: "Ownership changes can create questions about timing, condition, and practical next steps."
  },
  {
    title: "Vacant property",
    description: "Vacant homes often require clear planning around upkeep, security, and future use."
  },
  {
    title: "Deferred maintenance",
    description: "Properties with repairs or delayed maintenance deserve a straightforward review."
  },
  {
    title: "Tired landlord situations",
    description: "Rental ownership can become difficult when time, repairs, or management needs change."
  },
  {
    title: "Relocation",
    description: "Moving timelines can make property decisions feel more complex than expected."
  },
  {
    title: "Private property discussion",
    description: "Some situations are best handled through a direct, respectful, and confidential conversation."
  }
];

const educationLinks = [
  {
    href: "/resources/education",
    title: "Education Center",
    description: "Start with learning paths and core property-owner guides."
  },
  {
    href: "/resources/education/deferred-maintenance-oklahoma",
    title: "Deferred Maintenance",
    description: "Organize repair and condition questions before a property conversation."
  },
  {
    href: "/resources/videos",
    title: "Video Learning Center",
    description: "Review transcript-first lessons for common property situations."
  }
] as const;

export default function SellYourPropertyPage() {
  return (
    <div className="bg-white">
      <section className="bg-[#02213D] py-18 text-white md:py-24">
        <div className="container-shell">
          <div className="max-w-4xl">
            <p className="font-heading text-xs font-bold uppercase tracking-[0.22em] text-[#D4A017]">
              Discuss Your Property
            </p>
            <h1 className="mt-5 font-heading text-4xl font-bold leading-tight md:text-6xl">
              A professional conversation about your Oklahoma property
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/82 md:text-lg">
              Property decisions can involve repairs, timing, inherited ownership, vacancy, landlord concerns,
              relocation, or private questions. J Capital Property Group provides a calm place to discuss your
              situation and understand practical next steps without pressure.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={brandConfig.phoneHref}
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-md bg-[#D4A017] px-6 py-3.5 font-heading text-sm font-bold text-[#02213D] transition hover:bg-[#e0af2e]"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Call J Capital Property Group
              </a>
              <a
                href={`mailto:${brandConfig.primaryEmail}`}
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-md border border-white/20 bg-white/8 px-6 py-3.5 font-heading text-sm font-bold text-white transition hover:bg-white/14"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                Email J Capital Property Group
              </a>
            </div>
            <p className="mt-4 text-sm text-white/68">{brandConfig.phone}</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-10 md:py-14">
        <div className="container-shell">
          <div className="relative aspect-[1058/352] overflow-hidden rounded-md shadow-[0_22px_50px_rgba(2,33,61,0.14)]">
            <Image
              src="/images/sell-property-banner.jpg"
              alt="J Capital Property Group sell your property brand banner"
              fill
              sizes="(min-width: 1280px) 1120px, calc(100vw - 2rem)"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#F2F4F7] py-18 md:py-24">
        <div className="container-shell">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-heading text-3xl font-bold text-[#02213D] md:text-5xl">
              How The Conversation Works
            </h2>
            <p className="mt-4 text-base leading-7 text-[#4B5563]">
              Each conversation is handled with clarity, respect, and attention to the details that matter for your
              property.
            </p>
          </div>

          <ol className="mt-10 grid gap-4 md:grid-cols-4" aria-label="Property conversation decision path">
            {processSteps.map((item) => (
              <li key={item.step} className="border border-slate-200 bg-white p-6 shadow-sm">
                <p className="font-heading text-sm font-bold text-[#D4A017]">{item.step}</p>
                <h3 className="mt-3 font-heading text-xl font-bold text-[#02213D]">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#4B5563]">{item.description}</p>
              </li>
            ))}
          </ol>
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
                <div key={situation.title} className="border-l-4 border-[#D4A017] bg-[#F2F4F7] px-5 py-4">
                  <h3 className="font-heading text-base font-bold text-[#02213D]">{situation.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#4B5563]">{situation.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F2F4F7] py-18 md:py-24" aria-labelledby="property-education-heading">
        <div className="container-shell">
          <div className="grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-start">
            <div>
              <p className="font-heading text-xs font-bold uppercase tracking-[0.22em] text-[#D4A017]">
                Education Center
              </p>
              <h2 id="property-education-heading" className="mt-4 font-heading text-3xl font-bold leading-tight text-[#02213D] md:text-5xl">
                Learn before you decide
              </h2>
              <p className="mt-4 text-base leading-7 text-[#4B5563]">
                These guides help organize ownership, condition, timing, and next-step questions before a private
                property conversation.
              </p>
            </div>
            <div className="grid gap-3">
              {educationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="border border-slate-200 bg-white p-5 shadow-sm transition hover:bg-[#F8FAFC]"
                >
                  <span className="block font-heading text-lg font-bold text-[#02213D]">{link.title}</span>
                  <span className="mt-2 block text-sm leading-6 text-[#4B5563]">{link.description}</span>
                </Link>
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
