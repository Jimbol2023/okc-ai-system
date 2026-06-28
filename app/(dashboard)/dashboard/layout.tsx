import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { BarChart3, Building2, ClipboardCheck, HousePlus, LayoutGrid, Lock, Megaphone, Search, Shield, Upload, Users } from "lucide-react";

import { getAuthenticatedAdmin } from "@/lib/auth";
import { brandConfig } from "@/lib/brand-config";
export const dynamic = "force-dynamic";

const navItems = [
  { href: "/dashboard" as Route, label: "Overview", icon: LayoutGrid },
  { href: "/dashboard/leads" as Route, label: "Leads", icon: Users },
  { href: "/dashboard/approvals" as Route, label: "Approvals", icon: ClipboardCheck },
  { href: "/dashboard/marketing" as Route, label: "Marketing Hub", icon: Megaphone },
  { href: "/dashboard/research" as Route, label: "Research", icon: Search },
  { href: "/dashboard/security-review" as Route, label: "Security", icon: Shield },
  { href: "/dashboard/production-readiness" as Route, label: "Hardening", icon: Lock },
  { href: "/dashboard/importer" as Route, label: "Importer", icon: Upload },
  { href: "/dashboard/properties" as Route, label: "Properties", icon: Building2 },
  { href: "/dashboard/analyzer" as Route, label: "Analyzer", icon: BarChart3 },
  { href: "/dashboard/driving-for-dollars" as Route, label: "D4D", icon: HousePlus }
];

export default async function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const admin = await getAuthenticatedAdmin();

  return (
    <div className="min-h-screen bg-[#eef2f3]">
      <div className="dashboard-container-shell py-3 md:py-5">
        <div className="grid gap-3 xl:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-border bg-primary p-4 text-white md:min-h-[calc(100vh-2.5rem)] md:p-5">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/15 bg-white">
                <Image
                  src={brandConfig.logoPath}
                  alt={brandConfig.logoAlt}
                  fill
                  sizes="44px"
                  className="object-contain p-1"
                  priority
                />
              </span>
              <span className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
                {brandConfig.companyDisplayName}
              </span>
            </Link>
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/72">
              <p className="font-semibold text-white">Signed in</p>
              <p className="mt-1 break-all text-xs">{admin?.email ?? "Admin"}</p>
              <form action="/api/auth/logout" method="post" className="mt-3">
                <button
                  type="submit"
                  className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/18 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-white/14"
                >
                  Log out
                </button>
              </form>
            </div>
            <div className="mt-8 space-y-1">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/78 transition hover:bg-white/10 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </div>
          </aside>
          <div className="min-w-0 rounded-2xl border border-border bg-surface-strong p-4 md:p-6 xl:p-7">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
