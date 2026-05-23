import { r90AdvisoryRecoveryCategories } from "@/lib/r90-controlled-revenue-recovery-scope-contract";
import { r90BlockedDriftTransitions } from "@/lib/r90-controlled-revenue-recovery-drift-risk-audit";
import { r90ReadonlyUiWording } from "@/lib/r90-controlled-revenue-recovery-readonly-ui-scope-contract";

type RecoverySignal = { title: string; status: string; detail: string };
const safetyBadges = ["Read-only", "Advisory only", "Manual review", "No provider"];
const recoverySignals: RecoverySignal[] = [
  { title: "Manual recovery review", status: r90ReadonlyUiWording.manualReview, detail: "Recovery labels help humans inspect delayed opportunities, blocked recovery paths, and low-confidence recovery signals without changing records." },
  { title: "Delayed-opportunity recovery", status: r90ReadonlyUiWording.delayedOpportunity, detail: "Delayed opportunities may need operator review, but they do not authorize outreach, contact, or provider behavior." },
  { title: "Stalled but recoverable", status: r90ReadonlyUiWording.stalledRecoverable, detail: "Stalled-but-recoverable signals remain manual-review-only and cannot trigger workflow recovery." },
  { title: "Throughput stabilization", status: r90ReadonlyUiWording.throughputStabilization, detail: "Stabilization visibility can support human review while runtime jobs, polling, and automation remain blocked." },
  { title: "Manual recovery coordination", status: r90ReadonlyUiWording.manualRecoveryCoordination, detail: "Human coordination is required before any operational action." },
  { title: "Governance boundary", status: r90ReadonlyUiWording.governance, detail: `${r90ReadonlyUiWording.noExecution} ${r90ReadonlyUiWording.noProvider} ${r90ReadonlyUiWording.noContact}` },
];
function formatCategory(value: string) { return value.replaceAll("-", " "); }
export function ControlledRevenueRecoverySummary() {
  return (
    <section aria-labelledby="controlled-revenue-recovery-heading" aria-describedby="controlled-revenue-recovery-summary" className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6">
      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">Manual controlled revenue recovery</p>
          <h2 id="controlled-revenue-recovery-heading" className="break-words text-xl font-semibold text-primary">Read-only controlled revenue recovery intelligence</h2>
          <p id="controlled-revenue-recovery-summary" className="max-w-3xl break-words text-sm leading-6 text-muted">
            {r90ReadonlyUiWording.revenueRecovery} It helps operators review delayed opportunities, stalled-but-recoverable paths,
            throughput stabilization needs, manual recovery coordination, operational resilience, blocked recovery paths,
            low-confidence recovery signals, escalation review, and governance review needs. No execution, provider activation,
            outreach, automation, lead generation, scraping, skip tracing, MLS/public-record behavior, fetch/network behavior,
            runtime job, polling, persistence, audit writing, or contact is authorized.
          </p>
        </div>
        <div className="flex max-w-full flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.1em]">
          {safetyBadges.map((badge) => <span key={badge} className="max-w-full break-words rounded-full border border-border bg-white px-3 py-1 text-center leading-5 text-primary">{badge}</span>)}
        </div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
        {recoverySignals.map((item) => <article key={item.title} className="min-w-0 rounded-2xl border border-border bg-white p-4"><h3 className="break-words text-sm font-semibold text-primary">{item.title}</h3><p className="mt-2 break-words text-sm font-medium text-primary">{item.status}</p><p className="mt-1 break-words text-sm leading-6 text-muted">{item.detail}</p></article>)}
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="min-w-0 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950"><h3 className="break-words font-semibold text-blue-950">Advisory controlled recovery categories</h3><div className="mt-3 flex max-w-full flex-wrap gap-2">{r90AdvisoryRecoveryCategories.map((category) => <span key={category} className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 text-xs font-bold leading-5 text-blue-950">{formatCategory(category)}</span>)}</div></div>
        <div className="min-w-0 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950"><h3 className="break-words font-semibold text-blue-950">Recovery drift boundary</h3><ul className="mt-2 list-disc space-y-1 pl-5">{r90BlockedDriftTransitions.slice(0, 7).map((transition) => <li key={transition} className="break-words">{transition}</li>)}</ul></div>
      </div>
      <div className="mt-4 flex max-w-full flex-wrap gap-2 text-xs font-bold">
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">readOnly:true</span><span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">advisoryOnly:true</span><span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">simulationOnly:true</span><span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">providerCalled:false</span><span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">sent:false</span><span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">persistenceAllowedNow:false</span><span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">pollingAllowed:false</span><span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">runtimeActivationAllowed:false</span><span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">providerActivationAllowed:false</span><span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">approvalGrantsExecution:false</span>
      </div>
    </section>
  );
}
