import Image from "next/image";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";

import { LeadCaptureForm } from "@/components/forms/lead-capture-form";

const trustItems = [
  "Local Oklahoma City Buyer",
  "Fast Closings Available",
  "No Repairs Needed",
  "No Agent Fees"
];

const testimonials = [
  {
    quote: "They made the process simple and closed in 10 days. We never felt pressured.",
    name: "Sarah M.",
    detail: "South Oklahoma City seller"
  },
  {
    quote: "No repairs, no stress, exactly what we needed when we had to move quickly.",
    name: "James and Tasha R.",
    detail: "Moore homeowners"
  },
  {
    quote: "Everything was clear from the start, and the offer matched what they explained.",
    name: "David L.",
    detail: "Midwest City property owner"
  }
];

const sellerSituations = [
  "Inherited a house you do not want to repair or manage",
  "Behind on payments or facing foreclosure pressure",
  "Tired landlord dealing with problem tenants or vacancies",
  "House needs major repairs, cleanup, or updating",
  "Going through divorce, probate, or another major life change",
  "Need to relocate quickly and want a simple sale"
];

export default function HomePage() {
  return (
    <div className="space-y-24 pb-24 md:space-y-28">
      <section className="relative overflow-hidden bg-[#0e222f] text-white">
        <div className="absolute inset-0">
          <Image
            src="/images/house-front.jpg"
            alt="A relatable suburban house in an Oklahoma City neighborhood"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(8,19,28,0.78),rgba(8,19,28,0.5)_45%,rgba(8,19,28,0.66))]" />
        </div>

        <div className="container-shell relative z-10 grid gap-10 py-16 md:py-20 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <p className="inline-flex rounded-full border border-white/30 px-4 py-1.5 text-sm font-semibold uppercase tracking-wider text-white/90">
              Oklahoma City Home Buyer
            </p>
            <h1 className="max-w-3xl text-[2.5rem] font-bold leading-[1.08] md:text-[3.75rem] lg:text-[4.25rem]">
              Sell Your Oklahoma City House Fast — No Repairs, No Fees, No Stress
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl">
              We help local homeowners move forward with a fair cash offer, a clear process, and a closing timeline
              that fits real life.
            </p>
            <p className="text-sm font-medium uppercase tracking-[0.12em] text-white/75">
              Serving Oklahoma City and surrounding areas
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/sell-your-house"
                className="inline-flex min-h-14 items-center justify-center rounded-xl bg-[#d89a42] px-7 py-4 text-base font-bold text-[#102437] shadow-[0_18px_45px_rgba(216,154,66,0.35)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#e7a852] hover:shadow-[0_24px_55px_rgba(216,154,66,0.45)]"
              >
                Get My Cash Offer
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex min-h-14 items-center justify-center rounded-xl border border-white/40 bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur-sm transition duration-200 hover:border-white hover:bg-white/15"
              >
                How It Works
              </Link>
            </div>
            <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:gap-4">
              <p className="font-semibold text-[#f2d6a7]">Get Your Cash Offer in 24 Hours</p>
              <Link
                href="tel:5807455374"
                className="font-semibold text-white underline decoration-white/40 underline-offset-4 transition hover:decoration-white"
              >
                Call or Text: (580) 745-5374
              </Link>
            </div>
            <p className="text-sm text-white/80">
              Serving Oklahoma City, Edmond, Moore, Norman &amp; surrounding areas
            </p>

            <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
              {trustItems.map((item) => (
                <span
                  key={item}
                  className="rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-center text-sm font-semibold text-white/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative h-[320px] overflow-hidden rounded-2xl border border-white/15 shadow-2xl md:h-[420px]">
            <Image
              src="/images/hero-house.jpg"
              alt="Older residential home representing a motivated seller property in the Oklahoma City area"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
              <div className="rounded-2xl border border-white/12 bg-[linear-gradient(180deg,rgba(9,23,34,0.18),rgba(9,23,34,0.88))] p-5 shadow-[0_18px_40px_rgba(9,23,34,0.22)] backdrop-blur-[2px]">
                <p className="text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-white/85">
                  Local and straightforward
                </p>
                <p className="mt-2 max-w-xs text-[1.0625rem] font-semibold leading-7 text-white">
                  Real solutions for inherited homes, unwanted repairs, rental headaches, and urgent timelines.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex justify-center pb-6 md:pb-8">
          <Link
            href="#how-it-works"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/75 transition hover:text-white"
          >
            <span>See how it works</span>
            <span aria-hidden="true" className="text-base leading-none">
              ↓
            </span>
          </Link>
        </div>
      </section>

      <section className="container-shell relative z-20 -mt-10">
        <div className="mx-auto max-w-5xl rounded-[1.75rem] border border-[#d9e4eb] bg-white/95 p-5 shadow-[0_18px_50px_rgba(17,37,52,0.08)] backdrop-blur md:p-6">
          <div className="flex flex-col gap-4 border-b border-[#e7edf2] pb-5 text-center md:flex-row md:items-center md:justify-between md:text-left">
            <div className="flex items-center justify-center gap-1 text-[#d89a42] md:justify-start" aria-label="5 star rating">
              <span aria-hidden="true">★</span>
              <span aria-hidden="true">★</span>
              <span aria-hidden="true">★</span>
              <span aria-hidden="true">★</span>
              <span aria-hidden="true">★</span>
            </div>
            <p className="text-sm font-semibold text-[#173447]">★★★★★ Trusted by Oklahoma City homeowners</p>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-4">
            {trustItems.map((item) => (
              <div key={item} className="rounded-2xl bg-[#f6f1e6] px-4 py-4 text-center">
                <p className="text-sm font-semibold text-[#173447]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell">
        <div className="mx-auto max-w-5xl rounded-2xl border border-[#dbe6ef] bg-[#f7f3ea] p-8 shadow-sm md:p-10">
          <div className="grid gap-8 md:grid-cols-[0.95fr_1.05fr] md:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#2f5168]">
                We Buy Houses As-Is in Oklahoma City
              </p>
              <h2 className="mt-2 text-3xl font-bold text-[#102437] md:text-4xl">
                We Buy Houses in Any Condition — No Matter the Situation
              </h2>
              <p className="mt-3 text-base leading-7 text-[#4f6376]">
                If your property needs work or your timeline is tight, we can still make a fair offer. You do not need
                to clean, repair, or list the house before reaching out.
              </p>
            </div>

            <ul className="grid gap-3 text-sm text-[#40576b] sm:grid-cols-2">
              {sellerSituations.map((situation) => (
                <li
                  key={situation}
                  className="flex items-start gap-3 rounded-2xl border border-[#e3d8c5] bg-white px-4 py-4 shadow-[0_8px_24px_rgba(17,37,52,0.05)]"
                >
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#d89a42]" />
                  <span className="leading-6">{situation}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="container-shell">
        <div className="mx-auto max-w-5xl space-y-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#0c2736]">How It Works</p>
          <h2 className="text-3xl font-bold leading-tight text-[#112534] md:text-5xl">
            Simple 3-step process to sell your house with confidence
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-7 text-[#4b5866]">
            We keep everything clear and direct. No tricks, no pressure, no jargon, just a fast local solution for
            your home.
          </p>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-xl border border-[#dbe6ef] bg-white p-7 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#2f5168]">Step 1</p>
              <h3 className="mt-2 text-xl font-bold text-[#102437]">Request Your Offer</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#4f6376]">
                Submit your property details with our secure form and we&apos;ll contact you same-day to confirm.
              </p>
            </div>
            <div className="rounded-xl border border-[#dbe6ef] bg-[#f9fbfd] p-7 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#2f5168]">Step 2</p>
              <h3 className="mt-2 text-xl font-bold text-[#102437]">Review Cash Offer</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#4f6376]">
                You&apos;ll get a straightforward written cash offer with no obligations and no agent fees.
              </p>
            </div>
            <div className="rounded-xl border border-[#dbe6ef] bg-white p-7 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#2f5168]">Step 3</p>
              <h3 className="mt-2 text-xl font-bold text-[#102437]">Close on Your Timeline</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#4f6376]">
                Choose a closing date that works for you and keep the proceeds you deserve.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell">
        <div className="mx-auto max-w-5xl rounded-2xl border border-[#dbe6ef] bg-white p-8 shadow-sm md:p-10">
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#2f5168]">Why Homeowners Choose Us</p>
              <h2 className="mt-2 text-3xl font-bold text-[#102437] md:text-4xl">Trusted Oklahoma City home buyer</h2>
              <p className="mt-3 text-base leading-7 text-[#4f6376]">
                Built for sellers who need certainty and fairness. We&apos;re local, transparent, and ready to close
                quickly when life changes fast.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-[#40576b]">
                <li className="flex items-start gap-3">
                  <BadgeCheck className="mt-1 h-4 w-4 text-[#f18c00]" />
                  Fast closings that work with your schedule
                </li>
                <li className="flex items-start gap-3">
                  <BadgeCheck className="mt-1 h-4 w-4 text-[#f18c00]" />
                  No hidden fees, no agent commissions
                </li>
                <li className="flex items-start gap-3">
                  <BadgeCheck className="mt-1 h-4 w-4 text-[#f18c00]" />
                  Local Oklahoma City expertise and full transparency
                </li>
                <li className="flex items-start gap-3">
                  <BadgeCheck className="mt-1 h-4 w-4 text-[#f18c00]" />
                  Simple process from offer to close
                </li>
              </ul>
            </div>

            <div className="relative h-72 overflow-hidden rounded-xl border border-[#e7eef5]">
              <Image
                src="/images/house-front.jpg"
                alt="Front view of a local home representing dependable Oklahoma City service"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell">
        <div className="mx-auto max-w-5xl rounded-2xl border border-[#dbe6ef] bg-[#173447] p-8 text-white shadow-[0_24px_60px_rgba(17,37,52,0.16)] md:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-[#d7e1e8]">Seller Stories</p>
              <h2 className="mt-2 text-3xl font-bold md:text-4xl">Homeowners choose us when trust matters most</h2>
              <p className="mt-3 text-base leading-7 text-white/80">
                A clean process matters, but so does feeling comfortable with who you&apos;re working with. We aim for
                both.
              </p>
            </div>
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-[#f0d19d]">
              Serving Oklahoma City and surrounding areas
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.name}
                className="rounded-2xl border border-white/10 bg-white/8 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm"
              >
                <p className="text-base leading-7 text-white/92">&ldquo;{testimonial.quote}&rdquo;</p>
                <p className="mt-5 text-sm font-semibold text-white">{testimonial.name}</p>
                <p className="text-sm text-white/65">{testimonial.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell">
        <div className="mx-auto max-w-5xl rounded-2xl border border-[#dbe6ef] bg-white p-8 shadow-lg md:p-10">
          <div className="grid gap-8 md:grid-cols-[1.05fr_0.95fr] md:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#2f5168]">Get Started</p>
              <h2 className="mt-2 text-3xl font-bold text-[#102437] md:text-4xl">Request a free cash offer today</h2>
              <p className="mt-3 text-base leading-7 text-[#4f6376]">
                Fill out our short form and we&apos;ll reach out quickly. No obligation, no commitment, and always
                local.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-[#40576b]">
                <li className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#d89a42]" />
                  No obligation to accept our offer
                </li>
                <li className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#d89a42]" />
                  No agent fees or hidden costs
                </li>
                <li className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#d89a42]" />
                  Fast closings available on your timeline
                </li>
                <li className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#d89a42]" />
                  Simple, local process from first call to close
                </li>
              </ul>
            </div>
            <div className="rounded-xl border border-[#dbe6ef] bg-[#f9fbff] p-6">
              <LeadCaptureForm source="homepage" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
