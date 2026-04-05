import type { Route } from "next";
import Link from "next/link";
import { BarChart3, Building2, HousePlus, LayoutGrid, Lock, Search, Shield, Upload, Users } from "lucide-react";

import { getAuthenticatedAdmin } from "@/lib/auth";

const navItems = [
  { href: "/dashboard" as Route, label: "Overview", icon: LayoutGrid },
  { href: "/dashboard/leads" as Route, label: "Leads", icon: Users },
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
      <div className="container-shell py-4 md:py-6">
        <div className="grid gap-4 md:grid-cols-[260px_1fr]">
          <aside className="rounded-[1.75rem] border border-border bg-primary p-5 text-white md:min-h-[calc(100vh-3rem)]">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold tracking-[0.18em] text-white/70 uppercase">
              OKC Wholesale
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
          <div className="rounded-[1.75rem] border border-border bg-surface-strong p-5 md:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
