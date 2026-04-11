import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { href: "/" as Route, label: "Home" },
  { href: "/sell-your-house" as Route, label: "Sell Your House" },
  { href: "/contact" as Route, label: "Contact" },
  { href: "/dashboard" as Route, label: "Dashboard" }
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-[1000] border-b border-border/70 bg-white/80 backdrop-blur">
      <div className="container-shell flex min-h-20 items-center gap-3 py-3 md:min-h-24 md:gap-5 md:py-4">
        <Link href="/" className="mr-auto flex shrink-0 items-center">
          <Image
            src="/images/okc-logo-final.png"
            alt="OKC Wholesale logo"
            width={320}
            height={120}
            className="h-[55px] w-auto object-contain"
            sizes="55px"
            priority
          />
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-muted lg:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="tel:5807455374"
            className="hidden rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-primary transition hover:border-primary/40 hover:text-primary-strong xl:inline-flex"
          >
            Call or Text: (580) 745-5374
          </Link>
          <Link
            href="/sell-your-house"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#d89a42] px-4 py-2.5 text-sm font-bold text-[#102437] shadow-[0_10px_25px_rgba(216,154,66,0.22)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#e5a64f] sm:px-5"
          >
            See My Options
          </Link>
        </div>
      </div>
    </header>
  );
}
