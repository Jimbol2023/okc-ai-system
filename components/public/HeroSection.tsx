import Image from "next/image";

export function HeroSection() {
  return (
    <section id="home" className="relative isolate overflow-hidden bg-[#02213D] text-white">
      <div className="absolute inset-0 -z-20">
        <Image
          src="/images/hero-house.jpg"
          alt="Professional residential real estate exterior"
          fill
          sizes="100vw"
          className="object-cover opacity-25"
          priority
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(110deg,rgba(2,33,61,0.98)_0%,rgba(2,33,61,0.9)_45%,rgba(2,33,61,0.68)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-[#F2F4F7] to-transparent" />

      <div className="container-shell grid min-h-[calc(100svh-5rem)] items-center gap-10 py-20 md:min-h-[680px] md:grid-cols-[1.04fr_0.96fr] md:py-24">
        <div className="max-w-3xl">
          <p className="font-heading text-xs font-bold uppercase tracking-[0.22em] text-[#D4A017]">
            J Capital Property Group LLC
          </p>
          <h1 className="mt-5 font-heading text-4xl font-bold leading-[1.04] text-white sm:text-5xl lg:text-6xl">
            Professional Real Estate Solutions for Oklahoma Property Owners
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/82 sm:text-lg">
            Helping property owners explore real estate opportunities with professionalism, transparency, and local
            expertise.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#contact"
              className="inline-flex min-h-13 items-center justify-center rounded-md bg-[#D4A017] px-6 py-3.5 font-heading text-sm font-bold text-[#02213D] shadow-[0_18px_36px_rgba(212,160,23,0.26)] transition hover:bg-[#e0af2e]"
            >
              Schedule a Consultation
            </a>
            <a
              href="#why-us"
              className="inline-flex min-h-13 items-center justify-center rounded-md border border-white/25 bg-white/8 px-6 py-3.5 font-heading text-sm font-bold text-white transition hover:bg-white/14"
            >
              Learn More
            </a>
          </div>
        </div>

        <div className="hidden md:block">
          <div className="ml-auto max-w-md border-l-4 border-[#D4A017] bg-white/10 p-7 shadow-[0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur">
            <p className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-white/70">
              Oklahoma Property Owners
            </p>
            <p className="mt-4 text-2xl font-semibold leading-snug text-white">
              Clear guidance for property decisions that deserve thoughtful attention.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
