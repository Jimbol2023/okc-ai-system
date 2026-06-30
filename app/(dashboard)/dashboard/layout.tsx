import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { BarChart3, BookOpen, Briefcase, Building2, ClipboardCheck, DollarSign, HousePlus, LayoutGrid, Lock, Megaphone, MonitorSmartphone, Search, Shield, ShieldCheck, Upload, Users, Wrench } from "lucide-react";

import { CommandPaletteClient } from "@/components/dashboard/command-palette-client";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { brandConfig } from "@/lib/brand-config";
import { dashboardNavigationItems } from "@/lib/dashboard-navigation";

export const dynamic = "force-dynamic";

const navIconByHref = {
  "/dashboard": LayoutGrid,
  "/dashboard/acquisitions": Briefcase,
  "/dashboard/operations": Wrench,
  "/dashboard/finance": DollarSign,
  "/dashboard/knowledge": BookOpen,
  "/dashboard/leads": Users,
  "/dashboard/approvals": ClipboardCheck,
  "/dashboard/marketing": Megaphone,
  "/dashboard/tools": Wrench,
  "/dashboard/enterprise-ai": ShieldCheck,
  "/dashboard/mobile-command": MonitorSmartphone,
  "/dashboard/research": Search,
  "/dashboard/security-review": Shield,
  "/dashboard/safety": ShieldCheck,
  "/dashboard/production-readiness": Lock,
  "/dashboard/importer": Upload,
  "/dashboard/properties": Building2,
  "/dashboard/analyzer": BarChart3,
  "/dashboard/driving-for-dollars": HousePlus,
};

export default async function DashboardLayout({
  children,
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
              {dashboardNavigationItems.map(({ href, label }) => {
                const Icon = navIconByHref[href as keyof typeof navIconByHref] ?? LayoutGrid;

                return (
                  <Link
                    key={href}
                    href={href as Route}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-white/78 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                );
              })}
            </div>
          </aside>
          <div className="min-w-0 rounded-2xl border border-border bg-surface-strong p-4 md:p-6 xl:p-7">
            {children}
          </div>
        </div>
      </div>
      <CommandPaletteClient />
    </div>
  );
}
