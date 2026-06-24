import Link from "next/link";
import type { Route } from "next";

import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { JsonLdScript } from "@/components/public/JsonLdScript";
import {
  createBreadcrumbListJsonLd,
  createPublicPageMetadata,
  type BreadcrumbItem
} from "@/lib/public-seo";

export const metadata = createPublicPageMetadata({
  path: "/resources/education",
  title: "J Capital Property Owner Education Center",
  description:
    "Evergreen Oklahoma property education for inherited property, family discussions, ownership changes, deferred maintenance, videos, and property insights."
});

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Home", path: "/" },
  { name: "Education Center", path: "/resources/education" }
];

const learningPath = [
  {
    label: "New Property Owner?",
    href: "/resources/education",
    description: "Start with the big picture before choosing a specific guide."
  },
  {
    label: "Inherited Property",
    href: "/resources/inherited-property-oklahoma",
    description: "Review ownership, timing, documents, condition, and next-step questions."
  },
  {
    label: "Family Discussions",
    href: "/resources/education/family-property-discussions",
    description: "Prepare shared facts, priorities, responsibilities, and questions."
  },
  {
    label: "Ownership Changes",
    href: "/resources/education/property-ownership-change-considerations",
    description: "Think through documents, authority, occupancy, and responsibilities."
  },
  {
    label: "Property Decision Guide",
    href: "/resources/property-insights",
    description: "Compare factors that can influence a practical property decision."
  }
] as const;

const educationGuides = [
  {
    href: "/resources/education/probate-basics-oklahoma-property-owners",
    title: "Probate Basics for Oklahoma Property Owners",
    description: "General education for probate-related property questions, documents, timing, and authority."
  },
  {
    href: "/resources/education/deferred-maintenance-oklahoma",
    title: "Deferred Maintenance Considerations in Oklahoma",
    description: "A practical way to organize known repairs, unknowns, access, safety, and timing questions."
  },
  {
    href: "/resources/education/property-ownership-change-considerations",
    title: "Property Ownership Change Considerations",
    description: "Questions to review when ownership, responsibility, or decision authority may be changing."
  },
  {
    href: "/resources/education/family-property-discussions",
    title: "Preparing for Family Property Discussions",
    description: "A calm framework for shared facts, priorities, roles, and next-step conversations."
  }
] as const;

const centerLanes = [
  {
    href: "/resources/education",
    title: "Property Learning Center",
    description: "Evergreen guides for Oklahoma property owners thinking through common situations."
  },
  {
    href: "/resources/videos",
    title: "Video Learning Center",
    description: "Transcript-first educational video pages ready for future Canva, Loom, or YouTube embeds."
  },
  {
    href: "/resources/property-insights",
    title: "Oklahoma Property Insights",
    description: "Evergreen property decision topics without dated market-update framing."
  }
] as const;

const supportingGuides = [
  {
    href: "/resources/vacant-property-oklahoma",
    title: "Vacant Property Guide",
    description: "Security, upkeep, utilities, access, condition, and timing questions."
  },
  {
    href: "/resources/shared-inherited-property-oklahoma",
    title: "Shared Inherited Property Questions",
    description: "Communication, documents, decision authority, and shared responsibilities."
  },
  {
    href: "/resources/landlord-property-decisions-oklahoma",
    title: "Landlord Property Decisions",
    description: "Rental goals, repairs, management needs, and changing priorities."
  },
  {
    href: "/resources/relocation-property-decisions-oklahoma",
    title: "Relocation Property Decisions",
    description: "Moving timelines, access, repairs, and property responsibilities."
  }
] as const;

export default function EducationCenterPage() {
  return (
    <div className="bg-white">
      <JsonLdScript data={createBreadcrumbListJsonLd(breadcrumbs)} />
      <section className="bg-[#02213D] py-16 text-white md:py-24">
        <div className="container-shell">
          <Breadcrumbs items={breadcrumbs} />
          <div className="max-w-4xl">
            <p className="font-heading text-xs font-bold uppercase tracking-[0.22em] text-[#D4A017]">
              Education Center
            </p>
            <h1 className="mt-5 font-heading text-4xl font-bold leading-tight md:text-6xl">
              Oklahoma Property Owner Education Center
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/82 md:text-lg">
              Evergreen guides, video-ready lessons, and property insights for Oklahoma owners who want to organize
              questions before making a property decision.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24" aria-labelledby="learning-path-heading">
        <div className="container-shell">
          <div className="mx-auto max-w-4xl">
            <p className="font-heading text-xs font-bold uppercase tracking-[0.22em] text-[#D4A017]">
              Learning Path
            </p>
            <h2 id="learning-path-heading" className="mt-4 font-heading text-3xl font-bold text-[#02213D] md:text-5xl">
              A simple path for property questions
            </h2>
            <p className="mt-4 text-base leading-7 text-[#4B5563]">
              Start broad, then move toward the guide that matches the ownership, family, timing, or condition question
              you are trying to understand.
            </p>
            <ol className="mt-8 grid gap-4">
              {learningPath.map((step, index) => (
                <li key={step.label} className="grid gap-3 border border-slate-200 bg-[#F2F4F7] p-5 md:grid-cols-[4rem_1fr_auto] md:items-center">
                  <span className="font-heading text-sm font-bold text-[#D4A017]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block font-heading text-xl font-bold text-[#02213D]">{step.label}</span>
                    <span className="mt-2 block text-sm leading-6 text-[#4B5563]">{step.description}</span>
                  </span>
                  <Link
                    href={step.href as Route}
                    className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#02213D]/18 bg-white px-4 py-2 font-heading text-sm font-bold text-[#02213D] transition hover:bg-[#eef1f5]"
                  >
                    Open Guide
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-[#F2F4F7] py-16 md:py-24" aria-labelledby="center-lanes-heading">
        <div className="container-shell">
          <div className="mx-auto max-w-3xl text-center">
            <h2 id="center-lanes-heading" className="font-heading text-3xl font-bold text-[#02213D] md:text-5xl">
              Education Center sections
            </h2>
            <p className="mt-4 text-base leading-7 text-[#4B5563]">
              Each section is built to stay useful over time and support deeper property-owner research.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {centerLanes.map((lane) => (
              <Link
                key={lane.href}
                href={lane.href as Route}
                className="border border-slate-200 bg-white p-6 shadow-sm transition hover:bg-[#F8FAFC]"
              >
                <span className="block font-heading text-xl font-bold text-[#02213D]">{lane.title}</span>
                <span className="mt-3 block text-sm leading-6 text-[#4B5563]">{lane.description}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24" aria-labelledby="authority-guides-heading">
        <div className="container-shell">
          <div className="mx-auto max-w-4xl">
            <h2 id="authority-guides-heading" className="font-heading text-3xl font-bold text-[#02213D] md:text-5xl">
              Core authority guides
            </h2>
            <p className="mt-4 text-base leading-7 text-[#4B5563]">
              These guides focus on durable property-owner questions instead of short-lived updates.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {educationGuides.map((guide) => (
                <Link
                  key={guide.href}
                  href={guide.href as Route}
                  className="border border-slate-200 bg-[#F2F4F7] p-5 transition hover:bg-[#e7ebf0]"
                >
                  <span className="block font-heading text-lg font-bold text-[#02213D]">{guide.title}</span>
                  <span className="mt-2 block text-sm leading-6 text-[#4B5563]">{guide.description}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F2F4F7] py-16 md:py-24" aria-labelledby="supporting-guides-heading">
        <div className="container-shell">
          <div className="mx-auto max-w-4xl">
            <h2 id="supporting-guides-heading" className="font-heading text-3xl font-bold text-[#02213D] md:text-5xl">
              Situation-based guides
            </h2>
            <p className="mt-4 text-base leading-7 text-[#4B5563]">
              Use these resources when a specific property situation is already clear.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {supportingGuides.map((guide) => (
                <Link
                  key={guide.href}
                  href={guide.href as Route}
                  className="border border-slate-200 bg-white p-5 shadow-sm transition hover:bg-[#F8FAFC]"
                >
                  <span className="block font-heading text-lg font-bold text-[#02213D]">{guide.title}</span>
                  <span className="mt-2 block text-sm leading-6 text-[#4B5563]">{guide.description}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
