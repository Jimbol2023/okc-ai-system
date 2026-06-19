import Link from "next/link";

import { brandConfig } from "@/lib/brand-config";

export function Footer() {
  return (
    <footer className="bg-[#02213D] text-white">
      <div className="container-shell flex flex-col gap-3 border-t border-white/10 py-6 text-center text-sm text-white/70 md:flex-row md:items-center md:justify-between md:text-left">
        <p>{brandConfig.copyrightText}</p>
        <Link href="/privacy" className="font-heading font-semibold text-white/78 transition hover:text-white">
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}
