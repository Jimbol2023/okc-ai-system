"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { brandConfig } from "@/lib/brand-config";

const navLinks = [
  { href: "/" as Route, label: "Home" },
  { href: "/about" as Route, label: "About" },
  { href: "/resources" as Route, label: "Resources" },
  { href: "/resources/education" as Route, label: "Education Center" },
  { href: "/faq" as Route, label: "FAQ" },
  { href: "/contact" as Route, label: "Contact" }
];

const serviceAreaLinks = [
  { href: "/oklahoma-city" as Route, label: "Oklahoma City" },
  { href: "/yukon" as Route, label: "Yukon" },
  { href: "/moore" as Route, label: "Moore" },
  { href: "/norman" as Route, label: "Norman" },
  { href: "/edmond" as Route, label: "Edmond" },
  { href: "/midwest-city" as Route, label: "Midwest City" }
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="relative z-40 border-b border-white/10 bg-[#02213D] text-white shadow-[0_12px_30px_rgba(2,33,61,0.2)]">
      <div className="container-shell flex min-h-20 flex-wrap items-center gap-4 py-3">
        <Link href="/" onClick={closeMenu} className="mr-auto flex min-w-0 items-center gap-3">
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

        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls="public-mobile-menu"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setIsOpen((current) => !current)}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-white/20 bg-white/8 text-white transition hover:bg-white/14 lg:hidden"
        >
          {isOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>

        <nav className="hidden items-center gap-5 font-heading text-sm font-semibold text-white/78 lg:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/sell-your-house?source=navbar_cta"
          onClick={closeMenu}
          className="hidden min-h-11 shrink-0 items-center justify-center rounded-md bg-[#D4A017] px-4 py-2.5 font-heading text-sm font-bold text-[#02213D] shadow-[0_10px_24px_rgba(212,160,23,0.25)] transition hover:bg-[#e0af2e] sm:px-5 lg:inline-flex"
        >
          Discuss Your Property
        </Link>

        {isOpen ? (
          <div id="public-mobile-menu" className="w-full border-t border-white/10 pt-4 lg:hidden">
            <nav aria-label="Mobile navigation" className="grid gap-2 font-heading text-sm font-semibold text-white/86">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="rounded-md px-3 py-2 transition hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-4 border-t border-white/10 pt-4">
              <p className="px-3 font-heading text-xs font-bold uppercase tracking-[0.18em] text-[#D4A017]">
                Service Areas
              </p>
              <nav aria-label="Mobile service area navigation" className="mt-2 grid grid-cols-2 gap-2 text-sm font-semibold text-white/82">
                {serviceAreaLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className="rounded-md px-3 py-2 transition hover:bg-white/10 hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <Link
              href="/sell-your-house?source=mobile_nav_cta"
              onClick={closeMenu}
              className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-[#D4A017] px-5 py-3 font-heading text-sm font-bold text-[#02213D] shadow-[0_10px_24px_rgba(212,160,23,0.25)] transition hover:bg-[#e0af2e]"
            >
              Discuss Your Property
            </Link>
          </div>
        ) : null}
      </div>
    </header>
  );
}
