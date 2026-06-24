import { redirect } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";

import { LoginForm } from "@/components/auth/login-form";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { brandConfig } from "@/lib/brand-config";

export default async function LoginPage() {
  const admin = await getAuthenticatedAdmin();

  if (admin) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#f5f2eb]">
      <div className="container-shell flex min-h-screen items-center justify-center py-12">
        <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[1.75rem] border border-border bg-primary px-6 py-8 text-white md:px-8 md:py-10">
            <div className="flex items-center gap-3">
              <span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/15 bg-white">
                <Image
                  src={brandConfig.logoPath}
                  alt={brandConfig.logoAlt}
                  fill
                  sizes="56px"
                  className="object-contain p-1.5"
                  priority
                />
              </span>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">{brandConfig.companyDisplayName}</p>
            </div>
            <h2 className="mt-4 text-4xl font-semibold">Secure dashboard access for internal operations.</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/75 md:text-base">
              This sign-in protects lead data, imports, scoring workflows, and admin-only automation tools while the platform
              moves from prototype mode toward production-safe operation.
            </p>
          </section>

          <Suspense
            fallback={
              <div className="rounded-[1.75rem] border border-border bg-surface p-6 shadow-[0_18px_50px_rgba(18,32,42,0.08)]">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">Admin Access</p>
                <h1 className="mt-2 text-3xl font-semibold text-primary">Sign in</h1>
                <p className="mt-3 text-sm leading-6 text-muted">Loading secure access form...</p>
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
