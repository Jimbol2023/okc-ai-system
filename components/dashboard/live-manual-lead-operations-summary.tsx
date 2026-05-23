import { deriveLiveManualLeadOperations } from "@/lib/x2-live-manual-lead-operations-helper";
import { x2ReadonlyUiWording } from "@/lib/x2-live-manual-lead-operations-readonly-ui-scope-contract";

const demoItems = [
  { id: "x2-1", label: "High-priority seller lead review", priority: 4, daysSinceFollowUp: 4, needsSellerStatusReview: true, estimatedRevenue: 18000, source: "read-only dashboard signal", workloadWeight: 3 },
  { id: "x2-2", label: "Aging lead workflow review", priority: 2, leadAgeDays: 21, estimatedRevenue: 9000, source: "read-only dashboard signal", workloadWeight: 2 },
  { id: "x2-3", label: "Blocked workflow data review", priority: 3, isBlockedWorkflow: true, missingCriticalData: true, source: "read-only dashboard signal", workloadWeight: 4 },
  { id: "x2-4", label: "Revenue-priority lead review", priority: 3, estimatedRevenue: 24000, source: "read-only dashboard signal", workloadWeight: 1 },
];

function renderList(items: { id: string; label: string }[]) {
  return items.length > 0 ? items.map((item) => <li key={item.id} className="break-words">{item.label}</li>) : <li>No read-only signals available.</li>;
}

export function LiveManualLeadOperationsSummary() {
  const summary = deriveLiveManualLeadOperations({ items: demoItems, maxItemsPerSection: 3 });
  return (
    <section aria-labelledby="live-manual-lead-operations-heading" aria-describedby="live-manual-lead-operations-summary" className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6">
      <div className="space-y-2">
        <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">Controlled revenue operations</p>
        <h2 id="live-manual-lead-operations-heading" className="break-words text-xl font-semibold text-primary">Live manual lead operations</h2>
        <p id="live-manual-lead-operations-summary" className="max-w-4xl break-words text-sm leading-6 text-muted">{x2ReadonlyUiWording.manualLeadReview} {x2ReadonlyUiWording.workloadVisibility} Human operator review is required before any real-world action. No execution, provider activation, outreach, routing, polling, persistence, audit writing, scraping, skip tracing, lead creation, or workflow automation is authorized.</p>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-border bg-white p-4"><h3 className="text-sm font-semibold text-primary">High-priority leads</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">{renderList(summary.highPriorityLeads)}</ul></article>
        <article className="rounded-2xl border border-border bg-white p-4"><h3 className="text-sm font-semibold text-primary">Overdue and aging</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">{renderList([...summary.overdueFollowUps, ...summary.agingLeads].slice(0, 4))}</ul></article>
        <article className="rounded-2xl border border-border bg-white p-4"><h3 className="text-sm font-semibold text-primary">Blocked or missing data</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">{renderList([...summary.blockedWorkflowItems, ...summary.missingDataItems].slice(0, 4))}</ul></article>
        <article className="rounded-2xl border border-border bg-white p-4"><h3 className="text-sm font-semibold text-primary">Workload and revenue priority</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">{renderList([...summary.operatorWorkloadItems, ...summary.manualRevenuePriorityItems].slice(0, 4))}</ul></article>
      </div>
      <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
        <h3 className="font-semibold text-emerald-950">Manual workflow recommendation labels</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">{summary.manualWorkflowRecommendations.map((recommendation) => <li key={recommendation} className="break-words">{recommendation}</li>)}</ul>
      </div>
      <div className="mt-4 flex max-w-full flex-wrap gap-2 text-xs font-bold">
        <span className="rounded border border-emerald-200 bg-white px-2 py-1 text-emerald-950">readOnly:true</span><span className="rounded border border-emerald-200 bg-white px-2 py-1 text-emerald-950">advisoryOnly:true</span><span className="rounded border border-emerald-200 bg-white px-2 py-1 text-emerald-950">humanReviewOnly:true</span><span className="rounded border border-emerald-200 bg-white px-2 py-1 text-emerald-950">providerCalled:false</span><span className="rounded border border-emerald-200 bg-white px-2 py-1 text-emerald-950">sent:false</span><span className="rounded border border-emerald-200 bg-white px-2 py-1 text-emerald-950">persistenceWritten:false</span><span className="rounded border border-emerald-200 bg-white px-2 py-1 text-emerald-950">runtimeActivated:false</span><span className="rounded border border-emerald-200 bg-white px-2 py-1 text-emerald-950">approvalGrantsExecution:false</span>
      </div>
    </section>
  );
}
