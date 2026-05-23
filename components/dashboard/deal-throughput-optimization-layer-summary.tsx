import { deriveDealThroughputOptimizationLayer } from "@/lib/x5-deal-throughput-optimization-layer-helper";
import { x5ReadonlyUiWording } from "@/lib/x5-deal-throughput-optimization-layer-readonly-ui-scope-contract";

const demoItems = [
  { id: "x5-1", label: "High-impact assignment readiness review", priority: 4, estimatedRevenue: 18000, assignmentReadinessScore: 82, closingReadinessScore: 75, source: "read-only dashboard signal" },
  { id: "x5-2", label: "Blocked throughput missing data review", priority: 3, isBlockedThroughput: true, missingThroughputData: true, source: "read-only dashboard signal" },
  { id: "x5-3", label: "Stage friction revenue delay review", priority: 3, stageFrictionScore: 12, daysInStage: 9, revenueDelayRisk: 7, estimatedRevenue: 22000, source: "read-only dashboard signal" },
  { id: "x5-4", label: "Closing readiness manual review", priority: 2, closingReadinessScore: 78, operatorWorkloadWeight: 4, source: "read-only dashboard signal" },
];

function renderList(items: { id: string; label: string }[]) {
  return items.length > 0 ? items.map((item) => <li key={item.id} className="break-words">{item.label}</li>) : <li>No read-only signals available.</li>;
}

export function DealThroughputOptimizationLayerSummary() {
  const summary = deriveDealThroughputOptimizationLayer({ items: demoItems, maxItemsPerSection: 3 });
  return (
    <section aria-labelledby="deal-throughput-optimization-layer-heading" aria-describedby="deal-throughput-optimization-layer-summary" className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6">
      <div className="space-y-2">
        <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">Controlled revenue operations</p>
        <h2 id="deal-throughput-optimization-layer-heading" className="break-words text-xl font-semibold text-primary">Deal throughput optimization layer</h2>
        <p id="deal-throughput-optimization-layer-summary" className="max-w-4xl break-words text-sm leading-6 text-muted">{x5ReadonlyUiWording.throughput} {x5ReadonlyUiWording.stageFriction} Human operator review is required before any real-world action. No execution, routing, automation, outreach, provider activation, polling, persistence, audit writing, scraping, skip tracing, or runtime job is authorized.</p>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-border bg-white p-4"><h3 className="text-sm font-semibold text-primary">Throughput review</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">{renderList(summary.throughputReviewItems)}</ul></article>
        <article className="rounded-2xl border border-border bg-white p-4"><h3 className="text-sm font-semibold text-primary">Stage friction and delay</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">{renderList([...summary.stageFrictionItems, ...summary.revenueDelayItems].slice(0, 4))}</ul></article>
        <article className="rounded-2xl border border-border bg-white p-4"><h3 className="text-sm font-semibold text-primary">Assignment and closing</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">{renderList([...summary.assignmentReadinessItems, ...summary.closingReadinessItems].slice(0, 4))}</ul></article>
        <article className="rounded-2xl border border-border bg-white p-4"><h3 className="text-sm font-semibold text-primary">Blocked or missing data</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">{renderList([...summary.blockedThroughputItems, ...summary.missingThroughputDataItems].slice(0, 4))}</ul></article>
      </div>
      <div className="mt-4 rounded-2xl border border-sky-100 bg-sky-50 p-4 text-sm leading-6 text-sky-950">
        <h3 className="font-semibold text-sky-950">Manual optimization recommendation labels</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">{summary.manualOptimizationRecommendations.map((recommendation) => <li key={recommendation} className="break-words">{recommendation}</li>)}</ul>
      </div>
      <div className="mt-4 flex max-w-full flex-wrap gap-2 text-xs font-bold">
        <span className="rounded border border-sky-200 bg-white px-2 py-1 text-sky-950">readOnly:true</span><span className="rounded border border-sky-200 bg-white px-2 py-1 text-sky-950">advisoryOnly:true</span><span className="rounded border border-sky-200 bg-white px-2 py-1 text-sky-950">humanReviewOnly:true</span><span className="rounded border border-sky-200 bg-white px-2 py-1 text-sky-950">providerCalled:false</span><span className="rounded border border-sky-200 bg-white px-2 py-1 text-sky-950">sent:false</span><span className="rounded border border-sky-200 bg-white px-2 py-1 text-sky-950">persistenceWritten:false</span><span className="rounded border border-sky-200 bg-white px-2 py-1 text-sky-950">runtimeActivated:false</span><span className="rounded border border-sky-200 bg-white px-2 py-1 text-sky-950">approvalGrantsExecution:false</span>
      </div>
    </section>
  );
}
