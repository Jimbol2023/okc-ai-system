import Link from "next/link";
import type { Route } from "next";

import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { JsonLdScript } from "@/components/public/JsonLdScript";
import { createBreadcrumbListJsonLd, createPublicPageMetadata, type BreadcrumbItem } from "@/lib/public-seo";

export const metadata = createPublicPageMetadata({
  path: "/resources/property-insights",
  title: "Oklahoma Property Insights",
  description:
    "Evergreen Oklahoma property insights covering property trends, ownership questions, and factors that influence property decisions."
});

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Home", path: "/" },
  { name: "Education Center", path: "/resources/education" },
  { name: "Property Insights", path: "/resources/property-insights" }
];

const insights = [
  {
    title: "Understanding Oklahoma Property Trends",
    body:
      "Property trends are best understood as context, not a one-size-fits-all answer. Owners may want to consider condition, location, timing, occupancy, financing environment, repair needs, and personal goals before deciding what matters most."
  },
  {
    title: "Common Property Ownership Questions",
    body:
      "Ownership questions often involve documents, decision authority, title records, estate questions, leases, insurance, utilities, and ongoing responsibilities. Qualified professionals can help review situation-specific details."
  },
  {
    title: "Factors That Influence Property Decisions",
    body:
      "Property decisions may be influenced by timing, repairs, family needs, relocation, landlord responsibilities, vacancy, access, privacy, carrying costs, and the owner's comfort level with different options."
  }
] as const;

const relatedResources = [
  {
    href: "/resources/education/property-ownership-change-considerations",
    label: "Ownership Change Considerations",
    description: "Helpful when ownership, documents, or decision authority are part of the question."
  },
  {
    href: "/resources/education/deferred-maintenance-oklahoma",
    label: "Deferred Maintenance Considerations",
    description: "Useful when property condition or delayed repairs affect timing."
  },
  {
    href: "/resources/videos",
    label: "Video Learning Center",
    description: "Transcript-first lessons for common property situations."
  },
  {
    href: "/resources/education",
    label: "Education Center",
    description: "Return to the full property owner learning path."
  }
] as const;

export default function PropertyInsightsPage() {
  return (
    <div className="bg-white">
      <JsonLdScript data={createBreadcrumbListJsonLd(breadcrumbs)} />
      <section className="bg-[#02213D] py-16 text-white md:py-24">
        <div className="container-shell">
          <Breadcrumbs items={breadcrumbs} />
          <div className="max-w-4xl">
            <p className="font-heading text-xs font-bold uppercase tracking-[0.22em] text-[#D4A017]">
              Oklahoma Property Insights
            </p>
            <h1 className="mt-5 font-heading text-4xl font-bold leading-tight md:text-6xl">
              Evergreen property insights for Oklahoma owners
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/82 md:text-lg">
              Durable property-owner topics that help organize questions without relying on monthly market updates or
              unsupported property claims.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24" aria-labelledby="insights-heading">
        <div className="container-shell">
          <div className="mx-auto max-w-4xl">
            <h2 id="insights-heading" className="font-heading text-3xl font-bold text-[#02213D] md:text-5xl">
              Property insight topics
            </h2>
            <div className="mt-8 grid gap-4">
              {insights.map((insight) => (
                <article key={insight.title} className="border border-slate-200 bg-[#F2F4F7] p-6">
                  <h3 className="font-heading text-xl font-bold text-[#02213D]">{insight.title}</h3>
                  <p className="mt-3 text-base leading-7 text-[#4B5563]">{insight.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F2F4F7] py-16 md:py-24" aria-labelledby="insights-guidance-heading">
        <div className="container-shell">
          <div className="mx-auto max-w-4xl border-l-4 border-[#D4A017] bg-white p-6 shadow-sm">
            <h2 id="insights-guidance-heading" className="font-heading text-2xl font-bold text-[#02213D]">
              General educational guidance
            </h2>
            <p className="mt-3 text-base leading-7 text-[#4B5563]">
              These insights are general information only. They are not legal, tax, financial, title, valuation,
              investment, or market advice. Property owners should review situation-specific questions with qualified
              professionals.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24" aria-labelledby="insights-related-heading">
        <div className="container-shell">
          <div className="mx-auto max-w-4xl">
            <h2 id="insights-related-heading" className="font-heading text-3xl font-bold text-[#02213D] md:text-5xl">
              Related learning resources
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {relatedResources.map((resource) => (
                <Link
                  key={resource.href}
                  href={resource.href as Route}
                  className="border border-slate-200 bg-[#F2F4F7] p-5 transition hover:bg-[#e7ebf0]"
                >
                  <span className="block font-heading text-lg font-bold text-[#02213D]">{resource.label}</span>
                  <span className="mt-2 block text-sm leading-6 text-[#4B5563]">{resource.description}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
