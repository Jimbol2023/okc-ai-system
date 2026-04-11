import Image from "next/image";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";

import { LeadCaptureForm } from "@/components/forms/lead-capture-form";

const trustItems = [
  "Local Oklahoma City Buyer",
  "No-Pressure Conversations",
  "Sell As-Is",
  "No Agent Fees"
];

const testimonials = [
  {
    quote: "They made everything feel simple and calm. We had clear next steps, and there was never any pressure.",
    name: "Sarah M.",
    detail: "South Oklahoma City seller"
  },
  {
    quote:
      "We needed to move quickly and did not have time or money for repairs. They were kind, clear, and easy to work with.",
    name: "James and Tasha R.",
    detail: "Moore homeowners"
  },
  {
    quote:
      "Everything was explained clearly from the start. It felt like talking to a local team that genuinely wanted to help.",
    name: "David L.",
    detail: "Midwest City property owner"
  }
];

const sellerSituations = [
  "Inherited a house you do not want to repair or manage",
  "Feeling behind on payments or under foreclosure pressure",
  "Tired landlord dealing with problem tenants or vacancies",
  "House needs major repairs, cleanup, or updating",
  "Going through divorce, probate, or another stressful life change",
  "Need to relocate quickly and want a simple, local sale"
];

export default function HomePage() {
  return (
    <div className="space-y-24 pb-24 md:space-y-28">
      <section className="relative overflow-hidden bg-[#0e222f] text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/house-front.jpg"
            alt="A relatable suburban house in an Oklahoma City neighborhood"
            fill
            className="object-cover"
            priority
          />
        </div>
<div className="absolute inset-0 bg-black/85" />        <div className="container-shell relative z-20 py-24 md:py-28 lg:py-32">
  <div className="max-w-3xl">
    <div className="max-w-2xl rounded-[1.75rem] bg-[rgba(7,18,28,0.72)] px-6 py-8 shadow-[0_24px_70px_rgba(4,12,20,0.38)] backdrop-blur-[3px] md:px-10 md:py-12">
      <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/90">
        Oklahoma City Home Buyer
      </p>

      <h1 className="mt-5 max-w-xl text-4xl font-bold leading-[1.05] text-white md:text-6xl">
        Sell Your House Without Pressure or Guesswork
      </h1>

      <p className="mt-5 max-w-xl text-base leading-7 text-white/90 md:text-lg">
        If the house needs repairs, life feels uncertain, or you simply want clear next steps,
        we help Oklahoma City homeowners explore their options in a calm, local, no-pressure way.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/sell-your-house"
          className="inline-flex min-h-14 items-center justify-center rounded-xl bg-[#d89a42] px-7 py-4 text-base font-bold text-[#102437] shadow-[0_18px_45px_rgba(216,154,66,0.35)] transition duration-200 hover:bg-[#e7a852]"
        >
          Start My No-Pressure Offer
        </Link>

        <Link
          href="tel:5807455374"
          className="inline-flex min-h-14 items-center justify-center rounded-xl border border-white/25 bg-white/10 px-6 py-4 text-base font-semibold text-white transition duration-200 hover:bg-white/15"
        >
          Call or Text (580) 745-5374
        </Link>
      </div>

      <div className="mt-6 grid gap-3 text-sm text-white/80 sm:grid-cols-2">
        <p>Local Oklahoma City buyer</p>
        <p>No-pressure conversations</p>
        <p>Fair offers for homes as-is</p>
        <p>No agent fees or commissions</p>
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
            <span aria-hidden="true" className="text-base leading-none">&darr;</span>
          </Link>
        </div>
      </section>

<section className="container-shell relative z-20 -mt-8 md:-mt-10">
          <div className="mx-auto max-w-5xl rounded-[1.75rem] border border-[#d9e4eb] bg-white/96 p-5 shadow-[0_18px_50px_rgba(17,37,52,0.08)] backdrop-blur md:p-6">
          <div className="flex flex-col gap-3 border-b border-[#e7edf2] pb-5 text-center md:flex-row md:items-center md:justify-between md:text-left">
  <p className="text-sm font-semibold text-[#173447]">Trusted by Oklahoma City homeowners</p>
  <div className="flex items-center justify-center gap-1 text-[#d89a42] md:justify-start" aria-label="5 star rating">
    <span aria-hidden="true">★</span>
    <span aria-hidden="true">★</span>
    <span aria-hidden="true">★</span>
    <span aria-hidden="true">★</span>
    <span aria-hidden="true">★</span>
  </div>
</div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {trustItems.map((item) => (
              <div key={item} className="rounded-2xl bg-[#f6f1e6] px-4 py-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
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
                A simple option when selling feels overwhelming
              </h2>
              <p className="mt-3 text-base leading-7 text-[#4f6376]">
                If the house needs work, life feels uncertain, or you just want to understand your options, we are here
                to make the process feel clear. You can sell as-is, skip the prep work, and move at a pace that works
                for you.
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
            Simple next steps for Oklahoma City homeowners
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-7 text-[#4b5866]">
            We keep everything clear and direct so you can make the best decision for your home. No pressure, no
            confusing process, and no need to commit before you are ready.
          </p>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-xl border border-[#dbe6ef] bg-white p-7 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#2f5168]">Step 1</p>
              <h3 className="mt-2 text-xl font-bold text-[#102437]">Tell Us About the Property</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#4f6376]">
                Share a few details about the house and your situation. If you are not sure what you want to do yet,
                that is completely okay.
              </p>
            </div>
            <div className="rounded-xl border border-[#dbe6ef] bg-[#f9fbfd] p-7 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#2f5168]">Step 2</p>
              <h3 className="mt-2 text-xl font-bold text-[#102437]">Review Your Options</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#4f6376]">
                We will talk through your timeline, answer questions, and present a fair offer if it is a fit. There
                is no obligation to move forward.
              </p>
            </div>
            <div className="rounded-xl border border-[#dbe6ef] bg-white p-7 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#2f5168]">Step 3</p>
              <h3 className="mt-2 text-xl font-bold text-[#102437]">Close on Your Timeline</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#4f6376]">
                If you choose to sell, we will make the closing simple, predictable, and built around your schedule.
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
              <h2 className="mt-2 text-3xl font-bold text-[#102437] md:text-4xl">
                A local team homeowners feel comfortable calling
              </h2>
              <p className="mt-3 text-base leading-7 text-[#4f6376]">
                Sellers reach out to us when they want clarity, respect, and a simple process. We work with Oklahoma
                City homeowners and nearby areas in a way that feels straightforward and human from the first
                conversation.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-[#40576b]">
                <li className="flex items-start gap-3">
                  <BadgeCheck className="mt-1 h-4 w-4 text-[#f18c00]" />
                  No-pressure conversations with clear next steps
                </li>
                <li className="flex items-start gap-3">
                  <BadgeCheck className="mt-1 h-4 w-4 text-[#f18c00]" />
                  Fair offers for homes in as-is condition
                </li>
                <li className="flex items-start gap-3">
                  <BadgeCheck className="mt-1 h-4 w-4 text-[#f18c00]" />
                  Local Oklahoma City knowledge and nearby market experience
                </li>
                <li className="flex items-start gap-3">
                  <BadgeCheck className="mt-1 h-4 w-4 text-[#f18c00]" />
                  No hidden fees, no agent commissions, and a simple process
                </li>
              </ul>
              <p className="mt-5 text-sm leading-6 text-[#4f6376]">
                We regularly work with homeowners in Oklahoma City, Moore, Norman, Edmond, Midwest City, and nearby
                communities.
              </p>
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
                A smooth sale matters, but so does feeling safe, informed, and respected while you make a decision. We
                aim for both.
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
              <h2 className="mt-2 text-3xl font-bold text-[#102437] md:text-4xl">
                Explore your options with a local Oklahoma City buyer
              </h2>
              <p className="mt-3 text-base leading-7 text-[#4f6376]">
                Fill out the short form to start a simple, no-obligation conversation. Whether you are ready to sell or
                just comparing options, we will help you understand what comes next.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-[#40576b]">
                <li className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#d89a42]" />
                  No obligation to accept an offer or make a decision today
                </li>
                <li className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#d89a42]" />
                  Short form, clear next steps, and friendly follow-up
                </li>
                <li className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#d89a42]" />
                  Fair offer review for homes in any condition
                </li>
                <li className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#d89a42]" />
                  Local support across Oklahoma City and nearby areas
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
