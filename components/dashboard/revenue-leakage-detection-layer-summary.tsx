import { deriveRevenueLeakageDetection } from "@/lib/x6-revenue-leakage-detection-helper";
import { x6ReadonlyUiWording } from "@/lib/x6-revenue-leakage-detection-readonly-ui-scope-contract";

const demoItems = [
  { id: "x6-1", label: "Near-close revenue risk review", priority: 4, estimatedRevenue: 18000, daysToClose: 5, revenueRiskScore: 7, nearCloseRisk: true, source: "read-only dashboard signal" },
  { id: "x6-2", label: "Blocked revenue missing data review", priority: 3, isBlockedRevenue: true, missingCriticalData: true, source: "read-only dashboard signal" },
  { id: "x6-3", label: "Stale opportunity momentum-loss review", priority: 3, daysStale: 12, workflowFrictionScore: 9, momentumLossScore: 8, assignmentDelayDays: 4, estimatedRevenue: 22000, source: "read-only dashboard signal" },
  { id: "x6-4", label: "Delayed close workflow friction review", priority: 2, daysToClose: 8, revenueRiskScore: 5, workflowFrictionScore: 7, source: "read-only dashboard signal" },
];

function renderList(items: { id: string; label: string }[]) {
  return items.length > 0 ? items.map((item) => <li key={item.id} className="break-words">{item.label}</li>) : <li>No read-only signals available.</li>;
}

export function RevenueLeakageDetectionLayerSummary() {
  const summary = deriveRevenueLeakageDetection({ items: demoItems, maxItemsPerSection: 3 });
  return (
    <section aria-labelledby="revenue-leakage-detection-layer-heading" aria-describedby="revenue-leakage-detection-layer-summary" className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6">
      <div className="space-y-2">
        <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">Controlled revenue operations</p>
        <h2 id="revenue-leakage-detection-layer-heading" className="break-words text-xl font-semibold text-primary">Revenue leakage detection layer</h2>
        <p id="revenue-leakage-detection-layer-summary" className="max-w-4xl break-words text-sm leading-6 text-muted">{x6ReadonlyUiWording.staleOpportunity} {x6ReadonlyUiWording.blockedRevenue} Human operator review is required before any real-world action. No execution, outreach, routing, autonomous escalation, provider activation, polling, persistence, audit writing, scraping, skip tracing, or runtime job is authorized.</p>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-border bg-white p-4"><h3 className="text-sm font-semibold text-primary">Revenue risk</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">{renderList(summary.revenueRiskItems)}</ul></article>
        <article className="rounded-2xl border border-border bg-white p-4"><h3 className="text-sm font-semibold text-primary">Stale and momentum loss</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">{renderList([...summary.staleOpportunityItems, ...summary.momentumLossItems].slice(0, 4))}</ul></article>
        <article className="rounded-2xl border border-border bg-white p-4"><h3 className="text-sm font-semibold text-primary">Blocked or missing data</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">{renderList([...summary.blockedRevenueItems, ...summary.missingCriticalDataItems].slice(0, 4))}</ul></article>
        <article className="rounded-2xl border border-border bg-white p-4"><h3 className="text-sm font-semibold text-primary">Near-close and assignment delay</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">{renderList([...summary.nearCloseRiskItems, ...summary.assignmentDelayItems].slice(0, 4))}</ul></article>
      </div>
      <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm leading-6 text-rose-950">
        <h3 className="font-semibold text-rose-950">Manual revenue recommendation labels</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">{summary.manualRevenueRecommendations.map((recommendation) => <li key={recommendation} className="break-words">{recommendation}</li>)}</ul>
      </div>
      <div className="mt-4 flex max-w-full flex-wrap gap-2 text-xs font-bold">
        <span className="rounded border border-rose-200 bg-white px-2 py-1 text-rose-950">readOnly:true</span><span className="rounded border border-rose-200 bg-white px-2 py-1 text-rose-950">advisoryOnly:true</span><span className="rounded border border-rose-200 bg-white px-2 py-1 text-rose-950">humanReviewOnly:true</span><span className="rounded border border-rose-200 bg-white px-2 py-1 text-rose-950">providerCalled:false</span><span className="rounded border border-rose-200 bg-white px-2 py-1 text-rose-950">sent:false</span><span className="rounded border border-rose-200 bg-white px-2 py-1 text-rose-950">persistenceWritten:false</span><span className="rounded border border-rose-200 bg-white px-2 py-1 text-rose-950">runtimeActivated:false</span><span className="rounded border border-rose-200 bg-white px-2 py-1 text-rose-950">approvalGrantsExecution:false</span>
      </div>
    </section>
  );
}
