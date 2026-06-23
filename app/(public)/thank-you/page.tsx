import Link from "next/link";

import { brandConfig } from "@/lib/brand-config";
import { createPublicPageMetadata } from "@/lib/public-seo";

export const metadata = createPublicPageMetadata({
  path: "/thank-you",
  title: "Thank You",
  description:
    "Thank you page for J Capital Property Group property discussion form submissions and next-step contact details."
});

export default function ThankYouPage() {
  return (
    <div className="bg-white">
      <section className="bg-[#02213D] py-18 text-white md:py-24">
        <div className="container-shell">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-heading text-xs font-bold uppercase tracking-[0.22em] text-[#D4A017]">
              Submission Received
            </p>
            <h1 className="mt-5 font-heading text-4xl font-bold leading-tight md:text-6xl">
              Thank you for contacting J Capital Property Group
            </h1>
            <p className="mt-6 text-base leading-8 text-white/82">
              Your property conversation request has been received. A team member will review the information and follow
              up with a clear, no-pressure next step.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-18 md:py-24">
        <div className="container-shell">
          <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
            <article className="border border-slate-200 bg-[#F2F4F7] p-6">
              <h2 className="font-heading text-2xl font-bold text-[#02213D]">Prefer to talk now?</h2>
              <p className="mt-3 text-sm leading-7 text-[#4B5563]">
                Call{" "}
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
            </article>

            <article className="border border-slate-200 bg-[#F2F4F7] p-6">
              <h2 className="font-heading text-2xl font-bold text-[#02213D]">Keep learning</h2>
              <p className="mt-3 text-sm leading-7 text-[#4B5563]">
                Review property owner resources while your request is being reviewed.
              </p>
              <Link
                href="/resources/education"
                className="mt-5 inline-flex min-h-12 items-center justify-center rounded-md bg-[#D4A017] px-5 py-3 font-heading text-sm font-bold text-[#02213D] transition hover:bg-[#B88712]"
              >
                Open Education Center
              </Link>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
