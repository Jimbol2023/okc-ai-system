import type { Route } from "next";
import Link from "next/link";

const footerLinks = [
  { href: "/" as Route, label: "Home" },
  { href: "/sell-your-house" as Route, label: "Sell Your House" },
  { href: "/contact" as Route, label: "Contact" },
  { href: "/dashboard" as Route, label: "Dashboard" }
];

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-white/60">
      <div className="container-shell flex flex-col gap-4 py-8 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-primary">OKC Wholesale AI System</p>
          <p className="mt-1">Wholesale real estate operations platform for Oklahoma City.</p>
        </div>
        <nav className="flex flex-wrap gap-4">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
