import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";

import { brandConfig } from "@/lib/brand-config";

const navLinks = [
  { href: "/" as Route, label: "Home" },
  { href: "/about" as Route, label: "About" },
  { href: "/resources" as Route, label: "Resources" },
  { href: "/resources/education" as Route, label: "Education Center" },
  { href: "/faq" as Route, label: "FAQ" },
  { href: "/contact" as Route, label: "Contact" }
];

export function Navbar() {
  return (
    <header className="relative z-40 border-b border-white/10 bg-[#02213D] text-white shadow-[0_12px_30px_rgba(2,33,61,0.2)]">
      <div className="container-shell flex min-h-20 flex-wrap items-center gap-4 py-3">
        <Link href="/" className="mr-auto flex min-w-0 items-center gap-3 max-[520px]:w-full">
          <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/15 bg-white">
            <Image
              src={brandConfig.logoPath}
              alt={brandConfig.logoAlt}
              fill
              sizes="48px"
              className="object-contain p-1.5"
              priority
            />
          </span>
          <span className="min-w-0">
            <span className="block font-brand text-base font-semibold leading-tight text-white sm:text-lg">
              {brandConfig.companyDisplayName}
            </span>
            <span className="hidden text-xs font-medium uppercase tracking-[0.18em] text-white/60 md:block">
              Oklahoma Real Estate Solutions
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 font-heading text-sm font-semibold text-white/78 lg:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/sell-your-house"
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-md bg-[#D4A017] px-4 py-2.5 font-heading text-sm font-bold text-[#02213D] shadow-[0_10px_24px_rgba(212,160,23,0.25)] transition hover:bg-[#e0af2e] max-[520px]:w-full sm:px-5"
        >
          Discuss Your Property
        </Link>

        <nav className="flex w-full items-center gap-4 overflow-x-auto border-t border-white/10 pt-3 font-heading text-sm font-semibold text-white/78 lg:hidden">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="shrink-0 transition hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
