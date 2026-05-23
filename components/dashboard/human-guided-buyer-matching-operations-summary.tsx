import { deriveHumanGuidedBuyerMatchingOperations } from "@/lib/x4-human-guided-buyer-matching-operations-helper";
import { x4ReadonlyUiWording } from "@/lib/x4-human-guided-buyer-matching-operations-readonly-ui-scope-contract";

const demoItems = [
  { id: "x4-1", label: "Strong buyer-fit assignment review", priority: 4, buyerFitScore: 84, buyerDemandScore: 78, assignmentReadinessScore: 82, estimatedRevenue: 18000, buyerCapacityKnown: true, buyerCriteriaKnown: true, source: "read-only dashboard signal" },
  { id: "x4-2", label: "Blocked disposition data review", priority: 3, isBlockedDisposition: true, missingBuyerData: true, buyerCapacityKnown: false, buyerCriteriaKnown: false, source: "read-only dashboard signal" },
  { id: "x4-3", label: "Revenue-throughput buyer demand review", priority: 3, buyerDemandScore: 76, dispositionReadinessScore: 74, throughputRisk: 7, estimatedRevenue: 22000, source: "read-only dashboard signal" },
  { id: "x4-4", label: "Buyer capacity review", priority: 2, buyerDemandScore: 71, buyerCapacityKnown: false, buyerCriteriaKnown: true, source: "read-only dashboard signal" },
];

function renderList(items: { id: string; label: string }[]) {
  return items.length > 0 ? items.map((item) => <li key={item.id} className="break-words">{item.label}</li>) : <li>No read-only signals available.</li>;
}

export function HumanGuidedBuyerMatchingOperationsSummary() {
  const summary = deriveHumanGuidedBuyerMatchingOperations({ items: demoItems, maxItemsPerSection: 3 });
  return (
    <section aria-labelledby="human-guided-buyer-matching-operations-heading" aria-describedby="human-guided-buyer-matching-operations-summary" className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6">
      <div className="space-y-2">
        <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">Controlled revenue operations</p>
        <h2 id="human-guided-buyer-matching-operations-heading" className="break-words text-xl font-semibold text-primary">Human-guided buyer matching operations</h2>
        <p id="human-guided-buyer-matching-operations-summary" className="max-w-4xl break-words text-sm leading-6 text-muted">{x4ReadonlyUiWording.buyerFit} {x4ReadonlyUiWording.assignmentReadiness} Human operator review is required before any real-world action. No execution, buyer outreach, provider activation, autonomous assignment, routing, polling, persistence, audit writing, scraping, skip tracing, or workflow automation is authorized.</p>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-border bg-white p-4"><h3 className="text-sm font-semibold text-primary">Buyer-fit review</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">{renderList(summary.buyerFitItems)}</ul></article>
        <article className="rounded-2xl border border-border bg-white p-4"><h3 className="text-sm font-semibold text-primary">Assignment and demand</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">{renderList([...summary.assignmentReadinessItems, ...summary.buyerDemandItems].slice(0, 4))}</ul></article>
        <article className="rounded-2xl border border-border bg-white p-4"><h3 className="text-sm font-semibold text-primary">Disposition blockers</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">{renderList([...summary.blockedDispositionItems, ...summary.missingBuyerDataItems].slice(0, 4))}</ul></article>
        <article className="rounded-2xl border border-border bg-white p-4"><h3 className="text-sm font-semibold text-primary">Throughput and capacity</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">{renderList([...summary.revenueThroughputItems, ...summary.buyerCapacityItems].slice(0, 4))}</ul></article>
      </div>
      <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-sm leading-6 text-indigo-950">
        <h3 className="font-semibold text-indigo-950">Manual buyer recommendation labels</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">{summary.manualBuyerRecommendations.map((recommendation) => <li key={recommendation} className="break-words">{recommendation}</li>)}</ul>
      </div>
      <div className="mt-4 flex max-w-full flex-wrap gap-2 text-xs font-bold">
        <span className="rounded border border-indigo-200 bg-white px-2 py-1 text-indigo-950">readOnly:true</span><span className="rounded border border-indigo-200 bg-white px-2 py-1 text-indigo-950">advisoryOnly:true</span><span className="rounded border border-indigo-200 bg-white px-2 py-1 text-indigo-950">humanReviewOnly:true</span><span className="rounded border border-indigo-200 bg-white px-2 py-1 text-indigo-950">providerCalled:false</span><span className="rounded border border-indigo-200 bg-white px-2 py-1 text-indigo-950">sent:false</span><span className="rounded border border-indigo-200 bg-white px-2 py-1 text-indigo-950">persistenceWritten:false</span><span className="rounded border border-indigo-200 bg-white px-2 py-1 text-indigo-950">runtimeActivated:false</span><span className="rounded border border-indigo-200 bg-white px-2 py-1 text-indigo-950">approvalGrantsExecution:false</span>
      </div>
    </section>
  );
}
