import Link from "next/link";
import type { Route } from "next";

import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { JsonLdScript } from "@/components/public/JsonLdScript";
import { ServiceAreaLinks } from "@/components/public/ServiceAreaLinks";
import type { PublicResourcePage } from "@/lib/public-resource-pages";
import { createArticleJsonLd, createBreadcrumbListJsonLd, createFaqJsonLd, type BreadcrumbItem } from "@/lib/public-seo";

type PropertyResourceArticlePageProps = {
  page: PublicResourcePage;
};

const commonLinks = [
  { href: "/faq", label: "Read FAQ", highlight: false },
  { href: "/resources/education", label: "Education Center", highlight: false },
  { href: "/contact", label: "Contact J Capital", highlight: false },
  { href: "/sell-your-house?source=resource_article_cta", label: "Discuss Your Property", highlight: true }
] as const;

export function PropertyResourceArticlePage({ page }: PropertyResourceArticlePageProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", path: "/" },
    { name: "Education Center", path: "/resources/education" },
    { name: page.title }
  ];

  return (
    <div className="bg-white">
      <JsonLdScript data={createBreadcrumbListJsonLd(breadcrumbs)} />
      <JsonLdScript data={createArticleJsonLd({ path: page.path, title: page.title, description: page.description })} />
      <JsonLdScript
        data={createFaqJsonLd(page.relatedQuestions.map((item) => ({ question: item.question, answer: item.prompt })))}
      />
      <section className="bg-[#02213D] py-16 text-white md:py-24">
        <div className="container-shell">
          <Breadcrumbs items={breadcrumbs} />
          <div className="max-w-4xl">
            <p className="font-heading text-xs font-bold uppercase tracking-[0.22em] text-[#D4A017]">
              {page.eyebrow}
            </p>
            <h1 className="mt-5 font-heading text-4xl font-bold leading-tight md:text-6xl">{page.title}</h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/82 md:text-lg">{page.intro}</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24" aria-labelledby="resource-disclaimer-heading">
        <div className="container-shell">
          <div className="mx-auto max-w-4xl border-l-4 border-[#D4A017] bg-[#F2F4F7] p-6">
            <h2 id="resource-disclaimer-heading" className="font-heading text-2xl font-bold text-[#02213D]">
              General educational guidance
            </h2>
            <p className="mt-3 text-base leading-7 text-[#4B5563]">
              This resource is general information only. It is not legal, tax, financial, title, property valuation,
              or professional advice. Oklahoma property situations can vary, so consider speaking with qualified
              professionals before making final decisions.
            </p>
          </div>
        </div>
      </section>

      <article className="bg-[#F2F4F7] py-16 md:py-24" aria-labelledby="resource-article-heading">
        <div className="container-shell">
          <div className="mx-auto max-w-4xl">
            <h2 id="resource-article-heading" className="font-heading text-3xl font-bold text-[#02213D] md:text-5xl">
              {page.sectionsHeading}
            </h2>
            <div className="mt-10 grid gap-4">
              {page.sections.map((section) => (
                <section key={section.title} className="bg-white p-5 shadow-sm">
                  <h3 className="font-heading text-xl font-bold text-[#02213D]">{section.title}</h3>
                  <p className="mt-3 text-base leading-7 text-[#4B5563]">{section.body}</p>
                </section>
              ))}
            </div>
          </div>
        </div>
      </article>

      <section className="bg-white py-16 md:py-24" aria-labelledby="related-questions-heading">
        <div className="container-shell">
          <div className="mx-auto max-w-4xl">
            <h2 id="related-questions-heading" className="font-heading text-3xl font-bold text-[#02213D] md:text-5xl">
              Related questions
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {page.relatedQuestions.map((item) => (
                <article key={item.question} className="border border-slate-200 bg-[#F2F4F7] p-5">
                  <h3 className="font-heading text-lg font-bold text-[#02213D]">{item.question}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#4B5563]">{item.prompt}</p>
                  <Link
                    href="/faq"
                    className="mt-4 inline-flex min-h-11 items-center font-heading text-sm font-bold text-[#02213D] underline underline-offset-4"
                  >
                    View FAQ
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F2F4F7] py-16 md:py-24" aria-labelledby="related-resources-heading">
        <div className="container-shell">
          <div className="mx-auto max-w-4xl">
            <h2 id="related-resources-heading" className="font-heading text-3xl font-bold text-[#02213D] md:text-5xl">
              Related property resources
            </h2>
            <p className="mt-4 text-base leading-7 text-[#4B5563]">
              These resources can help compare similar Oklahoma property questions.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {page.relatedResources.map((resource) => (
                <Link
                  key={resource.href}
                  href={resource.href as Route}
                  className="border border-slate-200 bg-white p-5 shadow-sm transition hover:bg-[#F8FAFC]"
                >
                  <span className="block font-heading text-lg font-bold text-[#02213D]">{resource.label}</span>
                  <span className="mt-2 block text-sm leading-6 text-[#4B5563]">{resource.description}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24" aria-labelledby="contact-guidance-heading">
        <div className="container-shell">
          <div className="mx-auto max-w-4xl">
            <h2 id="contact-guidance-heading" className="font-heading text-3xl font-bold text-[#02213D] md:text-5xl">
              When to contact J Capital
            </h2>
            <p className="mt-4 text-base leading-7 text-[#4B5563]">
              If you want to talk through timing, condition, access, ownership, or next-step questions, you can contact
              J Capital Property Group directly or use the property discussion page for a private conversation.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {commonLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    link.highlight
                      ? "inline-flex min-h-12 items-center justify-center rounded-md bg-[#D4A017] px-4 py-3 text-center font-heading text-sm font-bold text-[#02213D] transition hover:bg-[#B88712]"
                      : "inline-flex min-h-12 items-center justify-center border border-slate-200 bg-[#F2F4F7] px-4 py-3 text-center font-heading text-sm font-bold text-[#02213D] transition hover:bg-[#e7ebf0]"
                  }
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F2F4F7] py-16 md:py-24" aria-labelledby="resource-service-areas-heading">
        <div className="container-shell">
          <div className="mx-auto max-w-4xl">
            <h2 id="resource-service-areas-heading" className="font-heading text-3xl font-bold text-[#02213D] md:text-5xl">
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
