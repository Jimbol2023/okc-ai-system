import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";

import { brandConfig } from "@/lib/brand-config";

const navLinks = [
  { href: "/" as Route, label: "Home" },
  { href: "/sell-your-house" as Route, label: "Sell Your Property" },
  { href: "/about" as Route, label: "About" },
  { href: "/contact" as Route, label: "Contact" }
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#02213D] text-white shadow-[0_12px_30px_rgba(2,33,61,0.2)]">
      <div className="container-shell flex min-h-20 items-center gap-4 py-3">
        <Link href="/" className="mr-auto flex min-w-0 items-center gap-3">
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
            <span className="hidden text-xs font-medium uppercase tracking-[0.18em] text-white/60 sm:block">
              Oklahoma Real Estate Solutions
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 font-heading text-sm font-semibold text-white/78 lg:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/contact"
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-md bg-[#D4A017] px-4 py-2.5 font-heading text-sm font-bold text-[#02213D] shadow-[0_10px_24px_rgba(212,160,23,0.25)] transition hover:bg-[#e0af2e] sm:px-5"
        >
          Discuss Your Property
        </Link>
      </div>
    </header>
  );
}
