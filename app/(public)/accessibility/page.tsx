import { Mail, Phone } from "lucide-react";

import { brandConfig } from "@/lib/brand-config";
import { createPublicPageMetadata } from "@/lib/public-seo";

export const metadata = createPublicPageMetadata({
  path: "/accessibility",
  title: "Website Accessibility",
  description:
    "Accessibility information for the J Capital Property Group public website, including phone and email support for users who need help accessing information."
});

export default function AccessibilityPage() {
  return (
    <div className="bg-white">
      <section className="bg-[#02213D] py-18 text-white md:py-24">
        <div className="container-shell">
          <div className="max-w-3xl">
            <p className="font-heading text-xs font-bold uppercase tracking-[0.22em] text-[#D4A017]">
              Accessibility
            </p>
            <h1 className="mt-5 font-heading text-4xl font-bold leading-tight md:text-6xl">
              Accessibility at J Capital Property Group
            </h1>
            <p className="mt-6 text-base leading-8 text-white/84">
              J Capital Property Group works to make public website information clear, readable, and accessible for
              Oklahoma property owners.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-18 md:py-24">
        <div className="container-shell">
          <div className="mx-auto max-w-3xl space-y-6">
            <article className="border border-slate-200 bg-[#F2F4F7] p-6 md:p-8">
              <h2 className="font-heading text-2xl font-bold text-[#02213D]">Our Commitment</h2>
              <p className="mt-4 text-base leading-8 text-[#1F2937]">
                We want this website to be usable for visitors who use screen readers, keyboard navigation, mobile
                devices, zoom tools, or other assistive technology.
              </p>
            </article>

            <article className="border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <h2 className="font-heading text-2xl font-bold text-[#02213D]">Need Help Accessing Information?</h2>
              <p className="mt-4 text-base leading-8 text-[#1F2937]">
                If you have trouble reading or using any part of this website, contact us directly. We can help provide
                the public information on this site through phone or email.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <a
                  href={brandConfig.phoneHref}
                  aria-label={`Call J Capital Property Group at ${brandConfig.phone}`}
                  className="inline-flex min-h-13 items-center justify-center gap-2 rounded-md bg-[#D4A017] px-5 py-3.5 font-heading text-sm font-bold text-[#02213D] transition hover:bg-[#B88712] hover:text-[#02213D]"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Call {brandConfig.phone}
                </a>
                <a
                  href={`mailto:${brandConfig.primaryEmail}`}
                  aria-label={`Email J Capital Property Group at ${brandConfig.primaryEmail}`}
                  className="inline-flex min-h-13 items-center justify-center gap-2 rounded-md border border-[#02213D]/20 bg-white px-5 py-3.5 font-heading text-sm font-bold text-[#02213D] transition hover:border-[#02213D]/40 hover:bg-[#F2F4F7]"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  Email J Capital Property Group
                </a>
              </div>
            </article>

            <article className="border border-slate-200 bg-[#F2F4F7] p-6 md:p-8">
              <h2 className="font-heading text-2xl font-bold text-[#02213D]">Ongoing Improvements</h2>
              <p className="mt-4 text-base leading-8 text-[#1F2937]">
                We review public pages for readable text, clear navigation, keyboard access, visible focus states, and
                useful image descriptions. This website does not require a form submission to contact us.
              </p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
