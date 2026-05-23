import { deriveInternalOperationalPilot } from "@/lib/x10-internal-operational-pilot-helper";
import { x10ReadonlyUiWording } from "@/lib/x10-internal-operational-pilot-readonly-ui-scope-contract";

const demoItems = [
  { id: "x10-1", label: "Internal pilot workflow readiness review", priority: 4, pilotReadinessScore: 62, workflowReadinessScore: 58, humanReviewRequired: true, daysSincePilotReview: 8, source: "read-only dashboard signal" },
  { id: "x10-2", label: "Governance and execution-blocked review", priority: 4, governanceReadinessScore: 55, executionBlocked: true, operationalRiskScore: 8, source: "read-only dashboard signal" },
  { id: "x10-3", label: "Provider-blocked pilot readiness review", priority: 3, providerBlocked: true, readinessGap: true, missingPilotData: true, source: "read-only dashboard signal" },
  { id: "x10-4", label: "Communication readiness risk review", priority: 2, communicationReadinessScore: 57, operationalRiskScore: 6, operatorWorkloadWeight: 4, source: "read-only dashboard signal" },
];

function renderList(items: { id: string; label: string }[]) {
  return items.length > 0 ? items.map((item) => <li key={item.id} className="break-words">{item.label}</li>) : <li>No read-only signals available.</li>;
}

export function InternalOperationalPilotSummary() {
  const summary = deriveInternalOperationalPilot({ items: demoItems, maxItemsPerSection: 3 });
  return (
    <section aria-labelledby="internal-operational-pilot-heading" aria-describedby="internal-operational-pilot-summary" className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6">
      <div className="space-y-2">
        <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">Controlled revenue operations</p>
        <h2 id="internal-operational-pilot-heading" className="break-words text-xl font-semibold text-primary">Internal operational pilot</h2>
        <p id="internal-operational-pilot-summary" className="max-w-4xl break-words text-sm leading-6 text-muted">{x10ReadonlyUiWording.pilotReadiness} {x10ReadonlyUiWording.executionBlocked} Human operator review is required before any real-world action. No execution, live activation, provider use, outreach, routing, polling, persistence, audit writing, automation, runtime job, or production deployment activation is authorized.</p>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-border bg-white p-4"><h3 className="text-sm font-semibold text-primary">Pilot readiness</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">{renderList(summary.internalPilotItems)}</ul></article>
        <article className="rounded-2xl border border-border bg-white p-4"><h3 className="text-sm font-semibold text-primary">Workflow and communication</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">{renderList([...summary.workflowReadinessItems, ...summary.communicationReadinessItems].slice(0, 4))}</ul></article>
        <article className="rounded-2xl border border-border bg-white p-4"><h3 className="text-sm font-semibold text-primary">Governance and blocked execution</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">{renderList([...summary.governanceReadinessItems, ...summary.executionBlockedItems, ...summary.providerBlockedItems].slice(0, 4))}</ul></article>
        <article className="rounded-2xl border border-border bg-white p-4"><h3 className="text-sm font-semibold text-primary">Risk and readiness gaps</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">{renderList([...summary.operationalRiskItems, ...summary.readinessGapItems].slice(0, 4))}</ul></article>
      </div>
      <div className="mt-4 rounded-2xl border border-violet-100 bg-violet-50 p-4 text-sm leading-6 text-violet-950">
        <h3 className="font-semibold text-violet-950">Manual pilot recommendation labels</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">{summary.manualPilotRecommendations.map((recommendation) => <li key={recommendation} className="break-words">{recommendation}</li>)}</ul>
      </div>
      <div className="mt-4 flex max-w-full flex-wrap gap-2 text-xs font-bold">
        <span className="rounded border border-violet-200 bg-white px-2 py-1 text-violet-950">readOnly:true</span><span className="rounded border border-violet-200 bg-white px-2 py-1 text-violet-950">advisoryOnly:true</span><span className="rounded border border-violet-200 bg-white px-2 py-1 text-violet-950">humanReviewOnly:true</span><span className="rounded border border-violet-200 bg-white px-2 py-1 text-violet-950">providerCalled:false</span><span className="rounded border border-violet-200 bg-white px-2 py-1 text-violet-950">sent:false</span><span className="rounded border border-violet-200 bg-white px-2 py-1 text-violet-950">persistenceWritten:false</span><span className="rounded border border-violet-200 bg-white px-2 py-1 text-violet-950">runtimeActivated:false</span><span className="rounded border border-violet-200 bg-white px-2 py-1 text-violet-950">approvalGrantsExecution:false</span>
      </div>
    </section>
  );
}
