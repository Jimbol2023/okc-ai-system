import { Mail, Phone } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";

import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { JsonLdScript } from "@/components/public/JsonLdScript";
import { brandConfig } from "@/lib/brand-config";
import { commonPropertySituations, serviceAreaSteps, type PublicServiceArea } from "@/lib/public-service-areas";
import { createBreadcrumbListJsonLd, type BreadcrumbItem } from "@/lib/public-seo";

type ServiceAreaPageProps = {
  area: PublicServiceArea;
};

const helpfulLinks = [
  { href: "/faq" as Route, label: "Read FAQ" },
  { href: "/resources/education" as Route, label: "Education Center" },
  { href: "/contact" as Route, label: "Contact J Capital" },
  { href: "/sell-your-house?source=service_area_helpful_link" as Route, label: "Discuss Your Property" }
] as const;

export function ServiceAreaPage({ area }: ServiceAreaPageProps) {
  const areaSource = area.slug.replace("/", "").replace("-", "_");
  const localResourceLinks = [
    {
      href:
        area.slug === "/oklahoma-city"
          ? "/resources/sell-inherited-house-oklahoma-city"
          : "/resources/inherited-property-oklahoma",
      label: area.slug === "/oklahoma-city" ? "Sell an inherited house in Oklahoma City" : "Inherited property guidance",
      description: "Organize documents, family communication, condition, timing, and next-step questions."
    },
    {
      href: area.slug === "/oklahoma-city" ? "/resources/sell-vacant-house-okc" : "/resources/vacant-property-oklahoma",
      label: area.slug === "/oklahoma-city" ? "Sell a vacant house in OKC" : "Vacant property guidance",
      description: "Review access, monitoring, utilities, repairs, carrying responsibilities, and timing."
    },
    {
      href: "/resources/out-of-state-owner-selling-oklahoma-property",
      label: "Out-of-state owner guidance",
      description: "Useful for owners managing Oklahoma property questions from another location."
    },
    {
      href: "/resources/selling-house-during-probate-oklahoma",
      label: "Probate-related property questions",
      description: "Separate practical property questions from legal, title, and authority questions."
    }
  ] as const;

  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", path: "/" },
    { name: area.city, path: area.slug }
  ];

  return (
    <div className="bg-white">
      <JsonLdScript data={createBreadcrumbListJsonLd(breadcrumbs)} />
      <section className="bg-[#02213D] py-16 text-white md:py-24">
        <div className="container-shell">
          <Breadcrumbs items={breadcrumbs} />
          <div className="max-w-4xl">
            <p className="font-heading text-xs font-bold uppercase tracking-[0.22em] text-[#D4A017]">
              {area.city} Property Guidance
            </p>
            <h1 className="mt-5 font-heading text-4xl font-bold leading-tight md:text-6xl">{area.headline}</h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/82 md:text-lg">{area.localIntro}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/sell-your-house?source=${areaSource}_service_area_hero_cta`}
                className="inline-flex min-h-13 items-center justify-center rounded-md bg-[#D4A017] px-6 py-3.5 font-heading text-sm font-bold text-[#02213D] shadow-[0_18px_36px_rgba(212,160,23,0.24)] transition hover:bg-[#e0af2e]"
              >
                Discuss Your Property
              </Link>
              <a
                href={brandConfig.phoneHref}
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-md border border-white/25 bg-white/8 px-6 py-3.5 font-heading text-sm font-bold text-white transition hover:bg-white/14"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Call J Capital Property Group
              </a>
              <a
                href={`mailto:${brandConfig.primaryEmail}`}
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-md border border-white/25 bg-white/8 px-6 py-3.5 font-heading text-sm font-bold text-white transition hover:bg-white/14"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                Email J Capital Property Group
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24" aria-labelledby="local-introduction-heading">
        <div className="container-shell">
          <div className="grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-start">
            <div>
              <p className="font-heading text-xs font-bold uppercase tracking-[0.22em] text-[#D4A017]">
                Local Introduction
              </p>
              <h2 id="local-introduction-heading" className="mt-4 font-heading text-3xl font-bold leading-tight text-[#02213D] md:text-5xl">
                A calm place to think through property questions in {area.city}
              </h2>
            </div>
            <div className="border-l-4 border-[#D4A017] bg-[#F2F4F7] p-6 md:p-8">
              <p className="text-base leading-8 text-[#1F2937]">{area.description}</p>
              <p className="mt-4 text-sm leading-6 text-[#4B5563]">
                This page is educational and local in focus. It does not replace direct review of your specific
                property details.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F2F4F7] py-16 md:py-24" aria-labelledby="common-situations-heading">
        <div className="container-shell">
          <div className="mx-auto max-w-3xl text-center">
            <h2 id="common-situations-heading" className="font-heading text-3xl font-bold text-[#02213D] md:text-5xl">
              Common property situations
            </h2>
            <p className="mt-4 text-base leading-7 text-[#4B5563]">
              Property owners contact J Capital Property Group for different reasons. These are common topics that can
              be discussed without pressure.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {commonPropertySituations.map((situation) => (
              <article key={situation.title} className="border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-heading text-lg font-bold text-[#02213D]">{situation.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#4B5563]">{situation.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24" aria-labelledby="conversation-heading">
        <div className="container-shell">
          <div className="mx-auto max-w-3xl text-center">
            <h2 id="conversation-heading" className="font-heading text-3xl font-bold text-[#02213D] md:text-5xl">
              How the conversation works
            </h2>
            <p className="mt-4 text-base leading-7 text-[#4B5563]">
              The process is a decision path, not a sales funnel.
            </p>
          </div>
          <ol className="mt-10 grid gap-4 md:grid-cols-4" aria-label={`${area.city} property conversation path`}>
            {serviceAreaSteps.map((step, index) => (
              <li key={step.title} className="border border-slate-200 bg-[#F2F4F7] p-5">
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

      <section className="bg-white py-16 md:py-24" aria-labelledby="local-resource-links-heading">
        <div className="container-shell">
          <div className="mx-auto max-w-3xl text-center">
            <h2 id="local-resource-links-heading" className="font-heading text-3xl font-bold text-[#02213D] md:text-5xl">
              Property guides for {area.city} owners
            </h2>
            <p className="mt-4 text-base leading-7 text-[#4B5563]">
              These guides help organize common questions before a private property conversation.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {localResourceLinks.map((resource) => (
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
      </section>

      <section className="bg-[#F2F4F7] py-16 md:py-24" aria-labelledby="local-trust-heading">
        <div className="container-shell">
          <div className="grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-start">
            <div>
              <p className="font-heading text-xs font-bold uppercase tracking-[0.22em] text-[#D4A017]">
                Local Trust
              </p>
              <h2 id="local-trust-heading" className="mt-4 font-heading text-3xl font-bold leading-tight text-[#02213D] md:text-5xl">
                Professional Oklahoma property guidance
              </h2>
            </div>
            <div className="bg-white p-6 shadow-sm md:p-8">
              <p className="text-base leading-8 text-[#1F2937]">{area.localTrust}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24" aria-labelledby="helpful-links-heading">
        <div className="container-shell">
          <div className="mx-auto max-w-3xl text-center">
            <h2 id="helpful-links-heading" className="font-heading text-3xl font-bold text-[#02213D] md:text-5xl">
              Helpful links
            </h2>
            <p className="mt-4 text-base leading-7 text-[#4B5563]">
              Use these public resources to learn more or contact J Capital Property Group directly.
            </p>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {helpfulLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex min-h-12 items-center justify-center border border-slate-200 bg-[#F2F4F7] px-4 py-3 text-center font-heading text-sm font-bold text-[#02213D] transition hover:bg-[#e7ebf0]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#02213D] py-16 text-white md:py-20" aria-labelledby="service-area-cta-heading">
        <div className="container-shell">
          <div className="mx-auto max-w-4xl text-center">
            <h2 id="service-area-cta-heading" className="font-heading text-3xl font-bold leading-tight md:text-5xl">
              Discuss a property in {area.city}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/80">
              Start with a professional, no-pressure conversation about the property situation you are considering.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href={`/sell-your-house?source=${areaSource}_service_area_footer_cta`}
                className="inline-flex min-h-13 items-center justify-center rounded-md bg-[#D4A017] px-6 py-3.5 font-heading text-sm font-bold text-[#02213D] transition hover:bg-[#e0af2e]"
              >
                Discuss Your Property
              </Link>
              <a
                href={brandConfig.phoneHref}
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-md border border-white/25 bg-white/8 px-6 py-3.5 font-heading text-sm font-bold text-white transition hover:bg-white/14"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Call J Capital Property Group
              </a>
              <a
                href={`mailto:${brandConfig.primaryEmail}`}
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-md border border-white/25 bg-white/8 px-6 py-3.5 font-heading text-sm font-bold text-white transition hover:bg-white/14"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                Email J Capital Property Group
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
