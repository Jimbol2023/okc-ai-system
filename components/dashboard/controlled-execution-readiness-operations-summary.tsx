import { deriveControlledExecutionReadiness } from "@/lib/x9-controlled-execution-readiness-helper";
import { x9ReadonlyUiWording } from "@/lib/x9-controlled-execution-readiness-readonly-ui-scope-contract";

const demoItems = [
  { id: "x9-1", label: "Manual readiness boundary review", priority: 4, readinessScore: 61, governanceRiskScore: 6, humanReviewRequired: true, daysSinceReadinessReview: 8, source: "read-only dashboard signal" },
  { id: "x9-2", label: "Provider and runtime blocked readiness review", priority: 4, providerReadinessBlocked: true, runtimeReadinessBlocked: true, governanceRiskScore: 9, source: "read-only dashboard signal" },
  { id: "x9-3", label: "Approval execution boundary review", priority: 3, approvalExecutionRisk: true, routingReadinessBlocked: true, missingReadinessData: true, source: "read-only dashboard signal" },
  { id: "x9-4", label: "Outreach readiness blocked review", priority: 2, outreachReadinessBlocked: true, readinessScore: 55, operatorWorkloadWeight: 4, source: "read-only dashboard signal" },
];

function renderList(items: { id: string; label: string }[]) {
  return items.length > 0 ? items.map((item) => <li key={item.id} className="break-words">{item.label}</li>) : <li>No read-only signals available.</li>;
}

export function ControlledExecutionReadinessOperationsSummary() {
  const summary = deriveControlledExecutionReadiness({ items: demoItems, maxItemsPerSection: 3 });
  return (
    <section aria-labelledby="controlled-execution-readiness-operations-heading" aria-describedby="controlled-execution-readiness-operations-summary" className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6">
      <div className="space-y-2">
        <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">Controlled revenue operations</p>
        <h2 id="controlled-execution-readiness-operations-heading" className="break-words text-xl font-semibold text-primary">Controlled execution readiness</h2>
        <p id="controlled-execution-readiness-operations-summary" className="max-w-4xl break-words text-sm leading-6 text-muted">{x9ReadonlyUiWording.controlledReadiness} {x9ReadonlyUiWording.noActivation} {x9ReadonlyUiWording.noApprovalExecution} Human operator review is required before any real-world action. No execution, activation, provider use, outreach, routing, polling, persistence, audit writing, automation, runtime job, or approval execution is authorized.</p>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-border bg-white p-4"><h3 className="text-sm font-semibold text-primary">Readiness review</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">{renderList(summary.readinessReviewItems)}</ul></article>
        <article className="rounded-2xl border border-border bg-white p-4"><h3 className="text-sm font-semibold text-primary">Activation boundaries</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">{renderList(summary.activationBoundaryItems)}</ul></article>
        <article className="rounded-2xl border border-border bg-white p-4"><h3 className="text-sm font-semibold text-primary">Provider and runtime blocked</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">{renderList([...summary.providerBlockedItems, ...summary.runtimeBlockedItems].slice(0, 4))}</ul></article>
        <article className="rounded-2xl border border-border bg-white p-4"><h3 className="text-sm font-semibold text-primary">Routing, outreach, approval</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">{renderList([...summary.routingBlockedItems, ...summary.outreachBlockedItems, ...summary.approvalExecutionBoundaryItems].slice(0, 4))}</ul></article>
      </div>
      <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
        <h3 className="font-semibold text-emerald-950">Manual readiness recommendation labels</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">{summary.manualReadinessRecommendations.map((recommendation) => <li key={recommendation} className="break-words">{recommendation}</li>)}</ul>
      </div>
      <div className="mt-4 flex max-w-full flex-wrap gap-2 text-xs font-bold">
        <span className="rounded border border-emerald-200 bg-white px-2 py-1 text-emerald-950">readOnly:true</span><span className="rounded border border-emerald-200 bg-white px-2 py-1 text-emerald-950">advisoryOnly:true</span><span className="rounded border border-emerald-200 bg-white px-2 py-1 text-emerald-950">humanReviewOnly:true</span><span className="rounded border border-emerald-200 bg-white px-2 py-1 text-emerald-950">providerCalled:false</span><span className="rounded border border-emerald-200 bg-white px-2 py-1 text-emerald-950">sent:false</span><span className="rounded border border-emerald-200 bg-white px-2 py-1 text-emerald-950">persistenceWritten:false</span><span className="rounded border border-emerald-200 bg-white px-2 py-1 text-emerald-950">runtimeActivated:false</span><span className="rounded border border-emerald-200 bg-white px-2 py-1 text-emerald-950">approvalGrantsExecution:false</span>
      </div>
    </section>
  );
}
