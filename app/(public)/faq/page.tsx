import Link from "next/link";
import type { Route } from "next";

import { JsonLdScript } from "@/components/public/JsonLdScript";
import { brandConfig } from "@/lib/brand-config";
import { ServiceAreaLinks } from "@/components/public/ServiceAreaLinks";
import { createPublicPageMetadata } from "@/lib/public-seo";

export const metadata = createPublicPageMetadata({
  path: "/faq",
  title: "J Capital Property Group FAQ",
  description:
    "Common questions about J Capital Property Group, property conversations, accessibility, and contacting the team."
});

const faqs = [
  {
    question: "What does J Capital Property Group do?",
    answer:
      "J Capital Property Group helps Oklahoma property owners discuss real estate situations and understand practical options before making a decision."
  },
  {
    question: "Is there any obligation when I contact you?",
    answer:
      "No. Contacting J Capital Property Group starts a conversation. You can ask questions and decide what makes sense for your situation."
  },
  {
    question: "What types of property situations can I ask about?",
    answer:
      "You can ask about inherited property, vacant property, repairs, landlord concerns, relocation, timing questions, or private property decisions."
  },
  {
    question: "Do you work with inherited properties?",
    answer:
      "You may contact J Capital Property Group about inherited property questions, including timing, condition, ownership changes, and possible next steps."
  },
  {
    question: "Can I contact you about a vacant property?",
    answer:
      "Yes. Vacant property owners can contact the team to discuss upkeep concerns, timing, security, and practical property decisions."
  },
  {
    question: "What if the property needs repairs?",
    answer:
      "You can discuss properties with deferred maintenance or repair concerns. The conversation can include condition, timing, and possible paths forward."
  },
  {
    question: "Can landlords contact J Capital Property Group?",
    answer:
      "Yes. Landlords can contact J Capital Property Group about rental property questions, changing ownership goals, repairs, or management concerns."
  },
  {
    question: "What areas do you serve?",
    answer:
      "J Capital Property Group focuses on Oklahoma property conversations. Contact the team directly if you have a question about a specific location."
  },
  {
    question: "How quickly do you respond?",
    answer:
      "J Capital Property Group typically responds within one business day when messages include clear contact information."
  },
  {
    question: "How do I contact J Capital Property Group?",
    answer: `Call ${brandConfig.phone} or email ${brandConfig.primaryEmail}.`
  },
  {
    question: "Is the website accessible for older adults, low-vision users, and screen readers?",
    answer:
      "The public website is built with readable text, clear headings, keyboard access, visible focus states, and screen-reader-friendly structure."
  },
  {
    question: "Do you use automated outreach from this website?",
    answer:
      "No automated outreach is initiated from this public website. Contact is handled through direct phone and email links."
  }
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer
    }
  }))
};

const relatedResources = [
  {
    href: "/resources/inherited-property-oklahoma",
    label: "Inherited property guide",
    description: "Review ownership, timing, condition, and professional guidance questions."
  },
  {
    href: "/resources/shared-inherited-property-oklahoma",
    label: "Shared inherited property questions",
    description: "Helpful when multiple family members are involved in a property decision."
  },
  {
    href: "/resources/vacant-property-oklahoma",
    label: "Vacant property guide",
    description: "Think through access, upkeep, utilities, monitoring, and timing questions."
  },
  {
    href: "/resources/landlord-property-decisions-oklahoma",
    label: "Landlord property decisions",
    description: "Review rental goals, repairs, management needs, and changing priorities."
  },
  {
    href: "/resources/relocation-property-decisions-oklahoma",
    label: "Relocation property decisions",
    description: "Organize property questions around moving timelines, access, and upkeep."
  }
] as const;

export default function FaqPage() {
  return (
    <div className="bg-white">
      <JsonLdScript data={faqJsonLd} />
      <section className="bg-[#F2F4F7] py-16 md:py-20">
        <div className="container-shell">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-heading text-xs font-bold uppercase tracking-[0.22em] text-[#D4A017]">FAQ</p>
            <h1 className="mt-4 font-heading text-4xl font-bold leading-tight text-[#02213D] md:text-6xl">
              Common Questions
            </h1>
            <p className="mt-5 text-base leading-8 text-[#4B5563]">
              Clear answers for Oklahoma property owners who want a professional, no-pressure conversation.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20" aria-labelledby="faq-list-heading">
        <div className="container-shell">
          <h2 id="faq-list-heading" className="sr-only">
            Frequently Asked Questions
          </h2>
          <div className="mx-auto grid max-w-4xl gap-4">
            {faqs.map((faq) => (
              <article key={faq.question} className="border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-heading text-xl font-bold text-[#02213D]">{faq.question}</h3>
                <p className="mt-3 text-base leading-7 text-[#4B5563]">{faq.answer}</p>
              </article>
            ))}
          </div>
          <section className="mx-auto mt-10 max-w-4xl" aria-labelledby="faq-related-resources-heading">
            <h2 id="faq-related-resources-heading" className="font-heading text-2xl font-bold text-[#02213D]">
              Related property resources
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#4B5563]">
              These guides expand on inherited, vacant, landlord, relocation, and private property questions.
            </p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {relatedResources.map((resource) => (
                <Link
                  key={resource.href}
                  href={resource.href as Route}
                  className="border border-slate-200 bg-[#F2F4F7] p-4 transition hover:bg-[#e7ebf0]"
                >
                  <span className="block font-heading text-base font-bold text-[#02213D]">{resource.label}</span>
                  <span className="mt-1 block text-sm leading-6 text-[#4B5563]">{resource.description}</span>
                </Link>
              ))}
            </div>
          </section>
          <section className="mx-auto mt-10 max-w-4xl" aria-labelledby="faq-service-area-heading">
            <h2 id="faq-service-area-heading" className="font-heading text-2xl font-bold text-[#02213D]">
              Oklahoma service areas
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#4B5563]">
              These local pages can help property owners find guidance by area.
            </p>
            <div className="mt-5">
              <ServiceAreaLinks />
            </div>
          </section>
          <div className="mx-auto mt-10 max-w-4xl border-l-4 border-[#D4A017] bg-[#F2F4F7] p-5">
            <p className="text-sm leading-6 text-[#4B5563]">
              For direct contact, call{" "}
              <a href={brandConfig.phoneHref} className="font-semibold text-[#02213D] underline underline-offset-4">
                {brandConfig.phone}
              </a>{" "}
              or email{" "}
              <a
                href={`mailto:${brandConfig.primaryEmail}`}
                className="font-semibold text-[#02213D] underline underline-offset-4"
              >
                {brandConfig.primaryEmail}
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
