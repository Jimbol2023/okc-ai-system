import { deriveHumanApprovedCommunicationWorkspace } from "@/lib/x8-human-approved-communication-workspace-helper";
import { x8ReadonlyUiWording } from "@/lib/x8-human-approved-communication-workspace-readonly-ui-scope-contract";

const demoItems = [
  { id: "x8-1", label: "Human approval communication readiness review", priority: 4, communicationReadinessScore: 61, communicationRiskScore: 5, humanApprovalReady: true, daysSinceLastHumanReview: 8, source: "read-only dashboard signal" },
  { id: "x8-2", label: "DNC and opt-out awareness review", priority: 4, hasDncFlag: true, hasOptOutFlag: true, communicationRiskScore: 9, source: "read-only dashboard signal" },
  { id: "x8-3", label: "Provider-blocked communication governance review", priority: 3, providerBlocked: true, governanceBlocked: true, missingCommunicationContext: true, source: "read-only dashboard signal" },
  { id: "x8-4", label: "Communication context review", priority: 2, communicationReadinessScore: 55, missingCommunicationContext: true, operatorWorkloadWeight: 4, source: "read-only dashboard signal" },
];

function renderList(items: { id: string; label: string }[]) {
  return items.length > 0 ? items.map((item) => <li key={item.id} className="break-words">{item.label}</li>) : <li>No read-only signals available.</li>;
}

export function HumanApprovedCommunicationWorkspaceSummary() {
  const summary = deriveHumanApprovedCommunicationWorkspace({ items: demoItems, maxItemsPerSection: 3 });
  return (
    <section aria-labelledby="human-approved-communication-workspace-heading" aria-describedby="human-approved-communication-workspace-summary" className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6">
      <div className="space-y-2">
        <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">Controlled revenue operations</p>
        <h2 id="human-approved-communication-workspace-heading" className="break-words text-xl font-semibold text-primary">Human-approved communication workspace</h2>
        <p id="human-approved-communication-workspace-summary" className="max-w-4xl break-words text-sm leading-6 text-muted">{x8ReadonlyUiWording.communicationReadiness} {x8ReadonlyUiWording.humanApproval} Human operator review is required before any real-world action. No execution, message sending, outreach, provider activation, polling, persistence, audit writing, routing, automation, or autonomous approval is authorized.</p>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-border bg-white p-4"><h3 className="text-sm font-semibold text-primary">Communication readiness</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">{renderList([...summary.communicationReviewItems, ...summary.communicationReadinessItems].slice(0, 4))}</ul></article>
        <article className="rounded-2xl border border-border bg-white p-4"><h3 className="text-sm font-semibold text-primary">Risk and consent awareness</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">{renderList([...summary.communicationRiskItems, ...summary.dncAwarenessItems, ...summary.optOutAwarenessItems].slice(0, 4))}</ul></article>
        <article className="rounded-2xl border border-border bg-white p-4"><h3 className="text-sm font-semibold text-primary">Human approval</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">{renderList(summary.humanApprovalItems)}</ul></article>
        <article className="rounded-2xl border border-border bg-white p-4"><h3 className="text-sm font-semibold text-primary">Provider and governance</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">{renderList([...summary.providerBlockedItems, ...summary.communicationGovernanceItems, ...summary.communicationContextItems].slice(0, 4))}</ul></article>
      </div>
      <div className="mt-4 rounded-2xl border border-sky-100 bg-sky-50 p-4 text-sm leading-6 text-sky-950">
        <h3 className="font-semibold text-sky-950">Manual communication recommendation labels</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">{summary.manualCommunicationRecommendations.map((recommendation) => <li key={recommendation} className="break-words">{recommendation}</li>)}</ul>
      </div>
      <div className="mt-4 flex max-w-full flex-wrap gap-2 text-xs font-bold">
        <span className="rounded border border-sky-200 bg-white px-2 py-1 text-sky-950">readOnly:true</span><span className="rounded border border-sky-200 bg-white px-2 py-1 text-sky-950">advisoryOnly:true</span><span className="rounded border border-sky-200 bg-white px-2 py-1 text-sky-950">humanReviewOnly:true</span><span className="rounded border border-sky-200 bg-white px-2 py-1 text-sky-950">providerCalled:false</span><span className="rounded border border-sky-200 bg-white px-2 py-1 text-sky-950">sent:false</span><span className="rounded border border-sky-200 bg-white px-2 py-1 text-sky-950">persistenceWritten:false</span><span className="rounded border border-sky-200 bg-white px-2 py-1 text-sky-950">runtimeActivated:false</span><span className="rounded border border-sky-200 bg-white px-2 py-1 text-sky-950">approvalGrantsExecution:false</span>
      </div>
    </section>
  );
}
