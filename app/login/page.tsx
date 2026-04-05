import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { getAuthenticatedAdmin } from "@/lib/auth";

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
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">OKC Wholesale</p>
            <h2 className="mt-4 text-4xl font-semibold">Secure dashboard access for internal operations.</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/75 md:text-base">
              This sign-in protects lead data, imports, scoring workflows, and admin-only automation tools while the platform
              moves from prototype mode toward production-safe operation.
            </p>
          </section>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
