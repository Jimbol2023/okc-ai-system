import Link from "next/link";
import type { Route } from "next";

import { analyzeClosingReadiness } from "@/lib/closing-readiness";
import { listDbLeads } from "@/lib/leads-db";
import { requireAuthenticatedServerTenant } from "@/lib/server-tenant-context";

export const dynamic = "force-dynamic";

export default async function OperationsPage() {
  const actor = await requireAuthenticatedServerTenant();
  const leads = await listDbLeads(actor);
  const closingLeads = leads
    .filter((lead) => lead.status === "under_contract" || lead.status === "closed")
    .map((lead) => ({ lead, closing: analyzeClosingReadiness(lead) }));

  const blockedCount = closingLeads.filter((item) => item.closing.readinessState === "closing_blocked").length;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">Operations Department</p>
        <h1 className="break-words text-3xl font-semibold text-primary">Contract-to-close workspace</h1>
        <p className="max-w-3xl break-words text-sm leading-6 text-muted">
          Track under-contract and closing-related work manually. Title coordination, contractor tasks, important dates, and document tracking are checklist visibility only.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Closing records</p>
          <p className="mt-2 text-2xl font-semibold text-primary">{closingLeads.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Blocked closings</p>
          <p className="mt-2 text-2xl font-semibold text-primary">{blockedCount}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Automation</p>
          <p className="mt-2 text-2xl font-semibold text-primary">Off</p>
        </div>
      </div>

      <section className="rounded-lg border border-border bg-surface p-4">
        <h2 className="break-words text-xl font-semibold text-primary">Closing checklist</h2>
        <div className="mt-4 grid gap-3">
          {closingLeads.length === 0 ? (
            <p className="text-sm leading-6 text-muted">No under-contract records are currently visible.</p>
          ) : (
            closingLeads.map(({ lead, closing }) => (
              <article key={lead.id} className="rounded-lg border border-border bg-white p-4">
                <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <p className="break-words text-sm font-semibold text-primary">{lead.propertyAddress}</p>
                    <p className="mt-1 break-words text-sm leading-6 text-muted">
                      {closing.nextClosingAction.label}: {closing.nextClosingAction.reason}
                    </p>
                    <p className="mt-2 break-words text-xs font-bold uppercase tracking-[0.08em] text-muted">
                      titleCoordination:false contractorAutomation:false documentAutomation:false providerCalled:false
                    </p>
                  </div>
                  <Link href={`/dashboard/leads/${lead.id}` as Route} className="inline-flex min-h-10 items-center justify-center rounded-full border border-border bg-white px-4 text-sm font-semibold text-primary">
                    Open lead
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
