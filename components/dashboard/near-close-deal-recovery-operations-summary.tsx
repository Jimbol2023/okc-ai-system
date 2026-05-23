import { deriveNearCloseDealRecoveryOperations } from "@/lib/x7-near-close-deal-recovery-operations-helper";
import { x7ReadonlyUiWording } from "@/lib/x7-near-close-deal-recovery-operations-readonly-ui-scope-contract";

const demoItems = [
  { id: "x7-1", label: "Near-close closing risk review", priority: 4, estimatedRevenue: 21000, daysToClose: 4, closingReadinessScore: 58, recoveryRiskScore: 8, nearCloseRisk: true, source: "read-only dashboard signal" },
  { id: "x7-2", label: "Blocked closing data review", priority: 3, isBlockedClosing: true, missingClosingData: true, source: "read-only dashboard signal" },
  { id: "x7-3", label: "Stalled assignment readiness review", priority: 3, daysStalled: 9, assignmentReadinessScore: 46, buyerReadinessScore: 54, estimatedRevenue: 24000, source: "read-only dashboard signal" },
  { id: "x7-4", label: "Seller readiness near-close review", priority: 2, daysToClose: 7, sellerReadinessScore: 61, recoveryRiskScore: 5, source: "read-only dashboard signal" },
];

function renderList(items: { id: string; label: string }[]) {
  return items.length > 0 ? items.map((item) => <li key={item.id} className="break-words">{item.label}</li>) : <li>No read-only signals available.</li>;
}

export function NearCloseDealRecoveryOperationsSummary() {
  const summary = deriveNearCloseDealRecoveryOperations({ items: demoItems, maxItemsPerSection: 3 });
  return (
    <section aria-labelledby="near-close-deal-recovery-operations-heading" aria-describedby="near-close-deal-recovery-operations-summary" className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6">
      <div className="space-y-2">
        <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">Controlled revenue operations</p>
        <h2 id="near-close-deal-recovery-operations-heading" className="break-words text-xl font-semibold text-primary">Near-close deal recovery operations</h2>
        <p id="near-close-deal-recovery-operations-summary" className="max-w-4xl break-words text-sm leading-6 text-muted">{x7ReadonlyUiWording.nearCloseRecovery} {x7ReadonlyUiWording.stalledNearClose} Human operator review is required before any real-world action. No execution, outreach, routing, autonomous escalation, provider activation, polling, persistence, audit writing, scraping, skip tracing, or runtime job is authorized.</p>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-border bg-white p-4"><h3 className="text-sm font-semibold text-primary">Near-close recovery</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">{renderList(summary.nearCloseRecoveryItems)}</ul></article>
        <article className="rounded-2xl border border-border bg-white p-4"><h3 className="text-sm font-semibold text-primary">Closing and assignment risk</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">{renderList([...summary.closingRiskItems, ...summary.assignmentRiskItems].slice(0, 4))}</ul></article>
        <article className="rounded-2xl border border-border bg-white p-4"><h3 className="text-sm font-semibold text-primary">Stalled or blocked</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">{renderList([...summary.stalledNearCloseItems, ...summary.blockedClosingItems, ...summary.missingClosingDataItems].slice(0, 4))}</ul></article>
        <article className="rounded-2xl border border-border bg-white p-4"><h3 className="text-sm font-semibold text-primary">Buyer and seller readiness</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">{renderList([...summary.buyerReadinessItems, ...summary.sellerReadinessItems].slice(0, 4))}</ul></article>
      </div>
      <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
        <h3 className="font-semibold text-amber-950">Manual recovery recommendation labels</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">{summary.manualRecoveryRecommendations.map((recommendation) => <li key={recommendation} className="break-words">{recommendation}</li>)}</ul>
      </div>
      <div className="mt-4 flex max-w-full flex-wrap gap-2 text-xs font-bold">
        <span className="rounded border border-amber-200 bg-white px-2 py-1 text-amber-950">readOnly:true</span><span className="rounded border border-amber-200 bg-white px-2 py-1 text-amber-950">advisoryOnly:true</span><span className="rounded border border-amber-200 bg-white px-2 py-1 text-amber-950">humanReviewOnly:true</span><span className="rounded border border-amber-200 bg-white px-2 py-1 text-amber-950">providerCalled:false</span><span className="rounded border border-amber-200 bg-white px-2 py-1 text-amber-950">sent:false</span><span className="rounded border border-amber-200 bg-white px-2 py-1 text-amber-950">persistenceWritten:false</span><span className="rounded border border-amber-200 bg-white px-2 py-1 text-amber-950">runtimeActivated:false</span><span className="rounded border border-amber-200 bg-white px-2 py-1 text-amber-950">approvalGrantsExecution:false</span>
      </div>
    </section>
  );
}
