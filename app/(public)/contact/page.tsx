import type { Metadata } from "next";

import { ContactSection } from "@/components/public/ContactSection";
import { brandConfig } from "@/lib/brand-config";

export const metadata: Metadata = {
  title: "Contact J Capital Property Group",
  description:
    "Contact J Capital Property Group by phone or email to discuss Oklahoma property questions with a professional, no-pressure process."
};

export default function ContactPage() {
  return (
    <div className="bg-white">
      <section className="bg-white py-16 md:py-20">
        <div className="container-shell text-center">
          <p className="font-heading text-xs font-bold uppercase tracking-[0.22em] text-[#D4A017]">
            Contact
          </p>
          <h1 className="mx-auto mt-4 max-w-3xl font-heading text-4xl font-bold leading-tight text-[#02213D] md:text-6xl">
            Contact J Capital Property Group
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#4B5563]">
            We are available to discuss your property questions and explore potential real estate solutions.
          </p>
          <div className="mx-auto mt-7 grid max-w-2xl gap-3 text-sm text-[#1F2937] sm:grid-cols-2">
            <a href={brandConfig.phoneHref} className="border border-slate-200 bg-[#F2F4F7] px-4 py-3 font-semibold">
              Phone: {brandConfig.phone}
            </a>
            <a
              href={`mailto:${brandConfig.primaryEmail}`}
              className="border border-slate-200 bg-[#F2F4F7] px-4 py-3 font-semibold"
            >
              Email: {brandConfig.primaryEmail}
            </a>
          </div>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-[#4B5563]">
            We typically respond within one business day. Conversations are no-pressure and handled directly by contact
            through phone or email.
          </p>
        </div>
      </section>
      <ContactSection />
    </div>
  );
}
