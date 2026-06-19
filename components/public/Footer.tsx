import Link from "next/link";
import Image from "next/image";

import { brandConfig } from "@/lib/brand-config";

export function Footer() {
  return (
    <footer className="bg-[#02213D] text-white">
      <div className="container-shell flex flex-col gap-5 border-t border-white/10 py-6 text-sm text-white/70 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col items-center gap-3 text-center md:flex-row md:text-left">
          <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/15 bg-white">
            <Image
              src={brandConfig.logoPath}
              alt={brandConfig.logoAlt}
              fill
              sizes="44px"
              className="object-contain p-1"
            />
          </span>
          <div>
            <p className="font-heading font-bold text-white">{brandConfig.companyDisplayName}</p>
            <p className="mt-1">{brandConfig.copyrightText}</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 text-center md:items-end md:text-right">
          <p>Professional, transparent real estate guidance for Oklahoma property owners.</p>
          <nav aria-label="Footer navigation" className="flex flex-wrap justify-center gap-4 md:justify-end">
            <Link href="/privacy" className="font-heading font-semibold text-white/85 transition hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/accessibility" className="font-heading font-semibold text-white/85 transition hover:text-white">
              Accessibility
            </Link>
            <Link href="/faq" className="font-heading font-semibold text-white/85 transition hover:text-white">
              FAQ
            </Link>
            <Link href="/resources" className="font-heading font-semibold text-white/85 transition hover:text-white">
              Resources
            </Link>
            <Link href="/contact" className="font-heading font-semibold text-white/85 transition hover:text-white">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
