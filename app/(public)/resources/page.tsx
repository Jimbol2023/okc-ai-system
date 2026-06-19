import Link from "next/link";

import { ServiceAreaLinks } from "@/components/public/ServiceAreaLinks";
import { createPublicPageMetadata } from "@/lib/public-seo";

export const metadata = createPublicPageMetadata({
  path: "/resources",
  title: "Resources",
  description:
    "A foundation for Oklahoma property resources, inherited property questions, vacant property guidance, landlord guidance, and property decision support."
});

const resourceSections = [
  {
    title: "Oklahoma Property Resources",
    description:
      "General information for Oklahoma property owners who want to understand practical questions before making a property decision.",
    futureResources: [
      "Understanding Property Solutions In Oklahoma",
      "When To Discuss A Property Situation With A Professional"
    ]
  },
  {
    title: "Inherited Property Questions",
    description:
      "Helpful starting points for owners thinking through timing, condition, family communication, and next steps after an ownership change.",
    futureResources: ["How To Handle An Inherited Property In Oklahoma"]
  },
  {
    title: "Vacant Property Questions",
    description:
      "Guidance for owners considering upkeep, safety, timing, and long-term planning for vacant property.",
    futureResources: ["Options For Vacant Property Owners In Oklahoma"]
  },
  {
    title: "Landlord Property Guidance",
    description:
      "Plain-language support for landlords reviewing rental property goals, repairs, management needs, or a change in plans.",
    futureResources: ["Property Guidance For Landlords In Oklahoma"]
  },
  {
    title: "Property Decision Support",
    description:
      "Decision-focused resources for comparing possible paths, asking better questions, and choosing what fits your circumstances.",
    futureResources: ["When To Discuss A Property Situation With A Professional"]
  },
  {
    title: "Accessibility-Friendly Information",
    description:
      "Future resources will keep plain language, readable structure, and clear headings in mind for older adults, low-vision users, and screen readers.",
    futureResources: ["Accessibility-Friendly Property Decision Guides"]
  }
];

export default function ResourcesPage() {
  return (
    <div className="bg-white">
      <section className="bg-[#F2F4F7] py-16 md:py-20">
        <div className="container-shell">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-heading text-xs font-bold uppercase tracking-[0.22em] text-[#D4A017]">Resources</p>
            <h1 className="mt-4 font-heading text-4xl font-bold leading-tight text-[#02213D] md:text-6xl">
              Oklahoma Property Resources
            </h1>
            <p className="mt-5 text-base leading-8 text-[#4B5563]">
              A growing hub for property-owner questions, decision support, and accessible information.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20" aria-labelledby="resource-hub-heading">
        <div className="container-shell">
          <div className="mx-auto max-w-3xl text-center">
            <h2 id="resource-hub-heading" className="font-heading text-3xl font-bold text-[#02213D] md:text-5xl">
              Resource Hub Foundation
            </h2>
            <p className="mt-4 text-base leading-7 text-[#4B5563]">
              These sections are placeholders for future guides. They are intentionally brief until full resources are
              ready for review.
            </p>
          </div>

          <section className="mx-auto mt-10 max-w-4xl" aria-labelledby="featured-resource-heading">
            <div className="border-l-4 border-[#D4A017] bg-white p-5 shadow-sm">
              <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-[#D4A017]">
                Featured Resource
              </p>
              <h2 id="featured-resource-heading" className="mt-3 font-heading text-2xl font-bold text-[#02213D]">
                How To Handle An Inherited Property In Oklahoma
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#4B5563]">
                A practical, educational starting point for owners thinking through inherited property questions.
              </p>
              <Link
                href="/resources/inherited-property-oklahoma"
                className="mt-5 inline-flex min-h-12 items-center justify-center rounded-md bg-[#D4A017] px-5 py-3 font-heading text-sm font-bold text-[#02213D] transition hover:bg-[#B88712]"
              >
                Read Inherited Property Guide
              </Link>
            </div>
          </section>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {resourceSections.map((section) => (
              <section key={section.title} className="border border-slate-200 bg-[#F2F4F7] p-5">
                <h3 className="font-heading text-xl font-bold text-[#02213D]">{section.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#4B5563]">{section.description}</p>
                <div className="mt-5 border-t border-slate-200 pt-4">
                  <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-[#D4A017]">
                    Future resources
                  </p>
                  <ul className="mt-3 grid gap-2 text-sm leading-6 text-[#4B5563]">
                    {section.futureResources.map((resource) => (
                      <li key={resource}>{resource}</li>
                    ))}
                  </ul>
                </div>
              </section>
            ))}
          </div>

          <section className="mx-auto mt-10 max-w-4xl" aria-labelledby="resources-service-area-heading">
            <h2 id="resources-service-area-heading" className="font-heading text-2xl font-bold text-[#02213D]">
              Oklahoma service areas
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#4B5563]">
              Explore local property guidance pages by area.
            </p>
            <div className="mt-5">
              <ServiceAreaLinks variant="white" />
            </div>
          </section>

          <div className="mx-auto mt-10 max-w-3xl text-center">
            <Link
              href="/sell-your-house"
              className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#D4A017] px-5 py-3 font-heading text-sm font-bold text-[#02213D] shadow-[0_12px_28px_rgba(212,160,23,0.22)] transition hover:bg-[#B88712] hover:text-[#02213D]"
            >
              Discuss Your Property
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
