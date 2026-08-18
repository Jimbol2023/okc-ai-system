import { EmptyState } from "@/components/dashboard/dashboard-ui";

export default function AutonomyPage() {
  return (
    <main className="space-y-6 p-4 sm:p-6">
      <header>
        <p className="text-sm font-medium text-slate-500">Governed internal operations</p>
        <h1 className="text-2xl font-semibold text-slate-950">Level-2 autonomy</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          CEO exception-only visibility for tenant policy, internal review tasks, and safety evidence. Provider calls and outreach remain disabled.
        </p>
      </header>
      <EmptyState title="No autonomy status loaded" detail="Use the authenticated status endpoint to review tenant-scoped readiness and exceptions." />
    </main>
  );
}
