import { deriveHumanOperationalCommandCenter } from "@/lib/x1-human-operational-command-center-helper";
import { x1ReadonlyUiWording } from "@/lib/x1-human-operational-command-center-readonly-ui-scope-contract";

const demoItems = [
  { id: "x1-1", label: "Hot seller opportunity review", priority: 4, isHotSeller: true, daysSinceFollowUp: 4, estimatedRevenue: 18000, source: "read-only dashboard signal" },
  { id: "x1-2", label: "Buyer-ready disposition review", priority: 3, isBuyerReady: true, estimatedRevenue: 15000, source: "read-only dashboard signal" },
  { id: "x1-3", label: "Near-close revenue review", priority: 3, isNearClose: true, estimatedRevenue: 22000, source: "read-only dashboard signal" },
  { id: "x1-4", label: "Blocked missing data review", priority: 2, isBlocked: true, missingCriticalData: true, source: "read-only dashboard signal" },
];

function renderList(items: { id: string; label: string }[]) {
  return items.length > 0 ? items.map((item) => <li key={item.id} className="break-words">{item.label}</li>) : <li>No read-only signals available.</li>;
}

export function HumanOperationalCommandCenterSummary() {
  const summary = deriveHumanOperationalCommandCenter({ items: demoItems, maxItemsPerSection: 3 });
  return (
    <section aria-labelledby="human-operational-command-center-heading" aria-describedby="human-operational-command-center-summary" className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6">
      <div className="space-y-2">
        <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">Controlled revenue operations</p>
        <h2 id="human-operational-command-center-heading" className="break-words text-xl font-semibold text-primary">Human operational command center</h2>
        <p id="human-operational-command-center-summary" className="max-w-4xl break-words text-sm leading-6 text-muted">{x1ReadonlyUiWording.dailyFocus} {x1ReadonlyUiWording.manualNextBestAction} Human operator review is required before any real-world action. No execution, provider activation, outreach, routing, polling, persistence, audit writing, scraping, skip tracing, or lead creation is authorized.</p>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-border bg-white p-4"><h3 className="text-sm font-semibold text-primary">Daily focus</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">{renderList(summary.topFocusItems)}</ul></article>
        <article className="rounded-2xl border border-border bg-white p-4"><h3 className="text-sm font-semibold text-primary">Overdue and hot</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">{renderList([...summary.overdueFollowUpItems, ...summary.hotSellerItems].slice(0, 4))}</ul></article>
        <article className="rounded-2xl border border-border bg-white p-4"><h3 className="text-sm font-semibold text-primary">Buyer-ready and near-close</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">{renderList([...summary.buyerReadyItems, ...summary.nearCloseItems].slice(0, 4))}</ul></article>
        <article className="rounded-2xl border border-border bg-white p-4"><h3 className="text-sm font-semibold text-primary">Blocked or missing data</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">{renderList([...summary.blockedItems, ...summary.missingDataItems].slice(0, 4))}</ul></article>
      </div>
      <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
        <h3 className="font-semibold text-blue-950">Manual next-best-action labels</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">{summary.manualNextBestActions.map((action) => <li key={action} className="break-words">{action}</li>)}</ul>
      </div>
      <div className="mt-4 flex max-w-full flex-wrap gap-2 text-xs font-bold">
        <span className="rounded border border-blue-200 bg-white px-2 py-1 text-blue-950">readOnly:true</span><span className="rounded border border-blue-200 bg-white px-2 py-1 text-blue-950">advisoryOnly:true</span><span className="rounded border border-blue-200 bg-white px-2 py-1 text-blue-950">humanReviewOnly:true</span><span className="rounded border border-blue-200 bg-white px-2 py-1 text-blue-950">providerCalled:false</span><span className="rounded border border-blue-200 bg-white px-2 py-1 text-blue-950">sent:false</span><span className="rounded border border-blue-200 bg-white px-2 py-1 text-blue-950">persistenceWritten:false</span><span className="rounded border border-blue-200 bg-white px-2 py-1 text-blue-950">runtimeActivated:false</span><span className="rounded border border-blue-200 bg-white px-2 py-1 text-blue-950">approvalGrantsExecution:false</span>
      </div>
    </section>
  );
}
