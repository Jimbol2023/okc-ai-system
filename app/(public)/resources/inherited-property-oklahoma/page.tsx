import Link from "next/link";
import type { Route } from "next";

import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { JsonLdScript } from "@/components/public/JsonLdScript";
import { ServiceAreaLinks } from "@/components/public/ServiceAreaLinks";
import {
  createArticleJsonLd,
  createBreadcrumbListJsonLd,
  createPublicPageMetadata,
  type BreadcrumbItem
} from "@/lib/public-seo";

const pageTitle = "How To Handle An Inherited Property In Oklahoma";
const pageDescription =
  "Educational guidance for Oklahoma owners thinking through inherited property, shared ownership, condition, timing, and professional guidance questions.";

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Home", path: "/" },
  { name: "Education Center", path: "/resources/education" },
  { name: pageTitle }
];

const relatedResources = [
  {
    href: "/resources/shared-inherited-property-oklahoma",
    label: "Shared Inherited Property Questions",
    description: "Helpful when more than one family member is involved in the decision."
  },
  {
    href: "/resources/vacant-property-oklahoma",
    label: "Vacant Property Guide",
    description: "Useful when an inherited property is empty or needs regular monitoring."
  },
  {
    href: "/resources/landlord-property-decisions-oklahoma",
    label: "Landlord Property Decisions",
    description: "Helpful when an inherited property is rented or may become a rental."
  },
  {
    href: "/resources/relocation-property-decisions-oklahoma",
    label: "Relocation Property Decisions",
    description: "Useful when family location or moving timelines affect property planning."
  }
] as const;

export const metadata = createPublicPageMetadata({
  path: "/resources/inherited-property-oklahoma",
  title: pageTitle,
  description: pageDescription
});

const sections = [
  {
    title: "Understanding the Probate Process",
    body:
      "Some inherited property situations may involve probate or other estate administration steps. The right path depends on the property, ownership records, estate documents, and family circumstances."
  },
  {
    title: "When Property Transfers to Heirs",
    body:
      "A transfer can create questions about title, insurance, utilities, maintenance, occupancy, and who has authority to make decisions. Organizing those details early can make the next conversation clearer."
  },
  {
    title: "Multiple Heirs and Shared Ownership",
    body:
      "When more than one person has an interest in a property, communication matters. It can help to list each person's goals, timeline, concerns, and preferred next step before decisions are made."
  },
  {
    title: "Property Condition Considerations",
    body:
      "Inherited homes may be occupied, vacant, updated, or in need of repairs. Condition can affect timing, upkeep, safety concerns, and the type of guidance an owner may need."
  },
  {
    title: "Tax and Professional Guidance Considerations",
    body:
      "Inherited property can raise legal, tax, financial, and title questions. Owners should consider speaking with qualified professionals before relying on assumptions or making final decisions."
  },
  {
    title: "Common Mistakes to Avoid",
    body:
      "Common mistakes include waiting too long to secure a vacant property, making decisions before the right people are involved, overlooking repair or utility needs, and assuming every inherited property follows the same path."
  },
  {
    title: "Questions to Discuss Before Making a Decision",
    body:
      "Useful questions include who has decision authority, whether the property is occupied, what repairs are known, whether there are timing pressures, and what outcome would feel practical for the people involved."
  },
  {
    title: "Helpful Oklahoma Resources",
    body:
      "A local attorney, tax professional, title company, county records office, or other qualified advisor may help clarify details before a property owner chooses a path."
  }
];

export default function InheritedPropertyOklahomaPage() {
  return (
    <div className="bg-white">
      <JsonLdScript data={createBreadcrumbListJsonLd(breadcrumbs)} />
      <JsonLdScript
        data={createArticleJsonLd({
          path: "/resources/inherited-property-oklahoma",
          title: pageTitle,
          description: pageDescription
        })}
      />
      <section className="bg-[#02213D] py-16 text-white md:py-24">
        <div className="container-shell">
          <Breadcrumbs items={breadcrumbs} />
          <div className="max-w-4xl">
            <p className="font-heading text-xs font-bold uppercase tracking-[0.22em] text-[#D4A017]">
              Oklahoma Property Resources
            </p>
            <h1 className="mt-5 font-heading text-4xl font-bold leading-tight md:text-6xl">
              How To Handle An Inherited Property In Oklahoma
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/82 md:text-lg">
              A plain-language starting point for Oklahoma property owners thinking through inherited property,
              ownership questions, condition, timing, and next steps.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24" aria-labelledby="article-disclaimer-heading">
        <div className="container-shell">
          <div className="mx-auto max-w-4xl border-l-4 border-[#D4A017] bg-[#F2F4F7] p-6">
            <h2 id="article-disclaimer-heading" className="font-heading text-2xl font-bold text-[#02213D]">
              General educational guidance
            </h2>
            <p className="mt-3 text-base leading-7 text-[#4B5563]">
              This resource is general information only. It is not legal, tax, financial, title, or estate advice.
              Inherited property situations can be complex, so consider speaking with qualified professionals before
              making final decisions.
            </p>
          </div>
        </div>
      </section>

      <article className="bg-[#F2F4F7] py-16 md:py-24" aria-labelledby="article-sections-heading">
        <div className="container-shell">
          <div className="mx-auto max-w-4xl">
            <h2 id="article-sections-heading" className="font-heading text-3xl font-bold text-[#02213D] md:text-5xl">
              Key questions to think through
            </h2>
            <div className="mt-10 grid gap-4">
              {sections.map((section) => (
                <section key={section.title} className="bg-white p-5 shadow-sm">
                  <h3 className="font-heading text-xl font-bold text-[#02213D]">{section.title}</h3>
                  <p className="mt-3 text-base leading-7 text-[#4B5563]">{section.body}</p>
                </section>
              ))}
            </div>
          </div>
        </div>
      </article>

      <section className="bg-white py-16 md:py-24" aria-labelledby="related-resource-heading">
        <div className="container-shell">
          <div className="mx-auto max-w-4xl">
            <h2 id="related-resource-heading" className="font-heading text-3xl font-bold text-[#02213D] md:text-5xl">
              Related property resources
            </h2>
            <p className="mt-4 text-base leading-7 text-[#4B5563]">
              These guides can help compare inherited property questions with other common Oklahoma property
              situations.
            </p>
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

      <section className="bg-[#F2F4F7] py-16 md:py-24" aria-labelledby="article-links-heading">
        <div className="container-shell">
          <div className="mx-auto max-w-4xl">
            <h2 id="article-links-heading" className="font-heading text-3xl font-bold text-[#02213D] md:text-5xl">
              Helpful next steps
            </h2>
            <p className="mt-4 text-base leading-7 text-[#4B5563]">
              These public pages can help you keep learning or contact J Capital Property Group directly.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Link
                href="/faq"
                className="inline-flex min-h-12 items-center justify-center border border-slate-200 bg-white px-4 py-3 text-center font-heading text-sm font-bold text-[#02213D] transition hover:bg-[#F8FAFC]"
              >
                Read FAQ
              </Link>
              <Link
                href="/resources/education"
                className="inline-flex min-h-12 items-center justify-center border border-slate-200 bg-white px-4 py-3 text-center font-heading text-sm font-bold text-[#02213D] transition hover:bg-[#F8FAFC]"
              >
                Education Center
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center border border-slate-200 bg-white px-4 py-3 text-center font-heading text-sm font-bold text-[#02213D] transition hover:bg-[#F8FAFC]"
              >
                Contact J Capital
              </Link>
              <Link
                href="/sell-your-house"
                className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#D4A017] px-4 py-3 text-center font-heading text-sm font-bold text-[#02213D] transition hover:bg-[#B88712]"
              >
                Discuss Your Property
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F2F4F7] py-16 md:py-24" aria-labelledby="article-service-areas-heading">
        <div className="container-shell">
          <div className="mx-auto max-w-4xl">
            <h2 id="article-service-areas-heading" className="font-heading text-3xl font-bold text-[#02213D] md:text-5xl">
              Oklahoma service areas
            </h2>
            <p className="mt-4 text-base leading-7 text-[#4B5563]">
              Local pages are available for Oklahoma property owners who want guidance by area.
            </p>
            <div className="mt-8">
              <ServiceAreaLinks variant="white" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
