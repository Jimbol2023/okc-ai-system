import Link from "next/link";
import type { Route } from "next";

import { listDbLeads } from "@/lib/leads-db";
import { getRevenuePipelineSummary } from "@/lib/revenue-pipeline";
import { requireAuthenticatedServerTenant } from "@/lib/server-tenant-context";

export const dynamic = "force-dynamic";

function Stat({ label, value, detail }: { label: string; value: string | number; detail: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="break-words text-xs font-bold uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className="mt-2 break-words text-2xl font-semibold text-primary">{value}</p>
      <p className="mt-2 break-words text-sm leading-6 text-muted">{detail}</p>
    </div>
  );
}

export default async function AcquisitionsPage() {
  const actor = await requireAuthenticatedServerTenant();
  const leads = await listDbLeads(actor);
  const pipeline = getRevenuePipelineSummary(leads);
  const workFirst = pipeline.workFirstLeads.slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">Acquisitions Department</p>
        <h1 className="break-words text-3xl font-semibold text-primary">Deal evaluation workspace</h1>
        <p className="max-w-3xl break-words text-sm leading-6 text-muted">
          Evaluate property facts, repair assumptions, comparable-sales notes, risk, offer readiness, and acquisition decisions. All property and seller facts must come from stored lead records or be labeled as manual assumptions.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Stat label="Offer-ready" value={pipeline.buyerReadyLeads + pipeline.nearContractLeads} detail="Buyer-ready and near-contract review signals." />
        <Stat label="Work-first" value={pipeline.workFirstLeads.length} detail="Highest manual acquisition review priority." />
        <Stat label="Missing value data" value={pipeline.missingValueReasons.length} detail="ARV, repairs, or profit assumptions missing." />
        <Stat label="Pipeline value" value={pipeline.estimatedPipelineValueLabel} detail="Assumption-based only when analyzer values exist." />
      </div>

      <section className="rounded-lg border border-border bg-surface p-4">
        <h2 className="break-words text-xl font-semibold text-primary">Manual acquisition queue</h2>
        {workFirst.length === 0 ? (
          <p className="mt-3 text-sm leading-6 text-muted">No acquisition records are ready for high-priority review yet.</p>
        ) : (
          <div className="mt-4 grid gap-3">
            {workFirst.map((item) => (
              <article key={item.lead.id} className="rounded-lg border border-border bg-white p-4">
                <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <p className="break-words text-sm font-semibold text-primary">{item.lead.propertyAddress}</p>
                    <p className="mt-1 break-words text-sm leading-6 text-muted">{item.reason}</p>
                    <p className="mt-2 break-words text-xs font-bold uppercase tracking-[0.08em] text-muted">
                      Missing: {item.missingValueReasons.length > 0 ? item.missingValueReasons.join(", ") : "none"}
                    </p>
                  </div>
                  <Link href={`/dashboard/leads/${item.lead.id}` as Route} className="inline-flex min-h-10 items-center justify-center rounded-full border border-border bg-white px-4 text-sm font-semibold text-primary">
                    Open lead
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <Link href="/dashboard/analyzer" className="rounded-lg border border-border bg-surface p-4 font-semibold text-primary">
          Deal Analyzer
          <span className="mt-2 block text-sm font-normal leading-6 text-muted">Repair estimates, MAO assumptions, and assignment-fee analysis.</span>
        </Link>
        <Link href="/dashboard/properties" className="rounded-lg border border-border bg-surface p-4 font-semibold text-primary">
          Property Records
          <span className="mt-2 block text-sm font-normal leading-6 text-muted">Property facts, source signals, ownership context, and cleanup needs.</span>
        </Link>
        <Link href="/dashboard/research" className="rounded-lg border border-border bg-surface p-4 font-semibold text-primary">
          Research
          <span className="mt-2 block text-sm font-normal leading-6 text-muted">County, city, ZIP, and opportunity summaries.</span>
        </Link>
      </section>
    </div>
  );
}
