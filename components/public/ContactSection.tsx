import { Globe2, Mail, Phone, ShieldCheck } from "lucide-react";

import { brandConfig } from "@/lib/brand-config";

export function ContactSection() {
  return (
    <section id="contact" className="bg-[#F2F4F7] py-18 md:py-24">
      <div className="container-shell">
        <div className="grid gap-8 bg-[#02213D] p-6 text-white shadow-[0_24px_80px_rgba(2,33,61,0.22)] md:grid-cols-[1.05fr_0.95fr] md:p-10 lg:p-12">
          <div>
            <p className="font-heading text-xs font-bold uppercase tracking-[0.22em] text-[#D4A017]">
              Contact
            </p>
            <h2 className="mt-4 font-heading text-3xl font-bold leading-tight md:text-5xl">
              Contact J Capital Property Group
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/80">
              We are available to discuss your property questions and explore potential real estate solutions.
            </p>
            <a
              href={brandConfig.phoneHref}
              className="mt-8 inline-flex min-h-13 items-center justify-center rounded-md bg-[#D4A017] px-6 py-3.5 font-heading text-sm font-bold text-[#02213D] transition hover:bg-[#e0af2e]"
            >
              Schedule a Consultation
            </a>
          </div>

          <div className="grid gap-4">
            <a
              href={brandConfig.phoneHref}
              className="flex items-center gap-4 border border-white/12 bg-white/8 p-4 transition hover:bg-white/12"
            >
              <Phone className="h-5 w-5 shrink-0 text-[#D4A017]" aria-hidden="true" />
              <span>
                <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-white/55">Phone</span>
                <span className="mt-1 block font-heading text-lg font-bold">{brandConfig.phone}</span>
              </span>
            </a>

            <a
              href={`mailto:${brandConfig.primaryEmail}`}
              className="flex items-center gap-4 border border-white/12 bg-white/8 p-4 transition hover:bg-white/12"
            >
              <Mail className="h-5 w-5 shrink-0 text-[#D4A017]" aria-hidden="true" />
              <span>
                <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-white/55">Email</span>
                <span className="mt-1 block break-all font-heading text-lg font-bold">{brandConfig.primaryEmail}</span>
              </span>
            </a>

            <div className="flex items-center gap-4 border border-white/12 bg-white/8 p-4">
              <Globe2 className="h-5 w-5 shrink-0 text-[#D4A017]" aria-hidden="true" />
              <span>
                <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-white/55">Website</span>
                <span className="mt-1 block font-heading text-lg font-bold">{brandConfig.domain}</span>
              </span>
            </div>

            <div className="flex items-start gap-4 border border-[#D4A017]/35 bg-[#D4A017]/10 p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#D4A017]" aria-hidden="true" />
              <p className="text-sm leading-6 text-white/84">We typically respond within one business day.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
