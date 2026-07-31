import type { readSearchMarketIntelligence } from "@/lib/search-market-intelligence-runtime";
import { getSearchConsoleReadinessPacket } from "@/lib/search-console-readiness";

type Report = Awaited<ReturnType<typeof readSearchMarketIntelligence>>;

function SafetyBadge({ children, warning = false }: { children: React.ReactNode; warning?: boolean }) {
  return <span className={`inline-flex min-h-7 items-center rounded-full border px-2.5 text-[11px] font-bold uppercase tracking-[0.08em] ${warning ? "border-amber-300 bg-amber-50 text-amber-950" : "border-emerald-200 bg-emerald-50 text-emerald-950"}`}>{children}</span>;
}

export function SearchMarketIntelligenceDashboard({ report }: { report: Report }) {
  const readiness = getSearchConsoleReadinessPacket();
  const latestPacket = report.latestMonday?.evidenceSnapshot && typeof report.latestMonday.evidenceSnapshot === "object" && !Array.isArray(report.latestMonday.evidenceSnapshot) ? (report.latestMonday.evidenceSnapshot as Record<string, unknown>).packet as Record<string, unknown> | undefined : undefined;
  const decisions = Array.isArray(latestPacket?.topCeoDecisions) ? latestPacket.topCeoDecisions as Array<Record<string, unknown>> : [];
  const dataGaps = Array.isArray(latestPacket?.dataGaps) ? latestPacket.dataGaps.filter((item): item is string => typeof item === "string") : [];
  return <div className="space-y-6">
    <section className="rounded-2xl border border-border bg-surface p-5 md:p-6">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Search and Market Intelligence</p>
      <h1 className="mt-2 text-3xl font-semibold text-primary">Professional search decision workspace</h1>
      <p className="mt-2 max-w-4xl text-sm leading-6 text-muted">Stored, source-qualified evidence moves through professional contributions, independent QA, and CEO review. Connector health never creates certification or execution authority.</p>
      <div className="mt-4 flex flex-wrap gap-2"><SafetyBadge>providerCalled:{String(report.providerCalled)}</SafetyBadge><SafetyBadge>externalWrites:{String(report.externalWritesAllowed)}</SafetyBadge><SafetyBadge>liveExecution:{String(report.liveExecutionAllowed)}</SafetyBadge><SafetyBadge warning>state:{report.promotionState}</SafetyBadge></div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3"><Metric label="Active cases" value={report.summary.active}/><Metric label="QA required" value={report.summary.qaRequired}/><Metric label="Executive review" value={report.summary.executiveReview}/></div>
    </section>
    <section aria-labelledby="indexing-readiness" className="rounded-2xl border border-border bg-surface p-5 md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Search Console Readiness</p>
          <h2 id="indexing-readiness" className="mt-2 text-2xl font-semibold text-primary">Indexing activation packet</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
            Manual account actions remain outside this dashboard. This packet lists the approved URLs and baseline
            evidence to capture without calling Google, Bing, or any external provider.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <SafetyBadge>providerCalled:{String(readiness.safety.providerCalled)}</SafetyBadge>
          <SafetyBadge>externalWrites:{String(readiness.safety.externalWritesAllowed)}</SafetyBadge>
          <SafetyBadge warning>manual submission only</SafetyBadge>
        </div>
      </div>
      <div className="mt-5 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="font-semibold text-primary">Priority URLs for indexing review</h3>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-muted md:grid-cols-2">
            {readiness.targetUrls.map((url) => <li key={url} className="break-all rounded-lg bg-slate-50 px-3 py-2">{url}</li>)}
          </ul>
        </div>
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="font-semibold text-primary">Manual submission checklist</h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-muted">
              {readiness.manualActivationSteps.map((step) => <li key={step}>{step}</li>)}
            </ol>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="font-semibold text-primary">Baseline evidence to record</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {readiness.baselineEvidenceFields.map((field) => <li key={field} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-muted">{field}</li>)}
            </ul>
            <p className="mt-3 break-all text-xs leading-5 text-muted">Sitemap: {readiness.sitemapUrl}</p>
            <p className="mt-1 break-all text-xs leading-5 text-muted">Robots: {readiness.robotsUrl}</p>
          </div>
        </div>
      </div>
    </section>
    <section aria-labelledby="ceo-decisions" className="rounded-2xl border border-border bg-surface p-5"><h2 id="ceo-decisions" className="text-xl font-semibold text-primary">Monday CEO decisions</h2><div className="mt-4 grid gap-3">{decisions.length ? decisions.slice(0,5).map((decision,index)=><article key={index} className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">Priority {String(decision.priority ?? index+1)}</p><h3 className="mt-1 font-semibold text-primary">{String(decision.title ?? "Manual review required")}</h3><p className="mt-2 text-sm leading-6 text-muted">{String(decision.rationale ?? "Review source-qualified evidence.")}</p></article>):<p className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm text-muted">No QA-passed Monday packet is available. No decision has been invented.</p>}</div></section>
    <div className="grid gap-6 xl:grid-cols-2"><section aria-labelledby="cases" className="rounded-2xl border border-border bg-surface p-5"><h2 id="cases" className="text-xl font-semibold text-primary">Professional cases and handoffs</h2><div className="mt-4 space-y-3">{report.cases.slice(0,15).map((record)=><article key={record.id} className="rounded-xl border border-slate-200 bg-white p-4"><div className="flex flex-wrap items-start justify-between gap-2"><div><h3 className="font-semibold text-primary">{record.title}</h3><p className="mt-1 text-xs text-muted">{record.leadProfessionalId} → {record.independentReviewerId}</p></div><SafetyBadge warning={record.status === "working" || record.status === "qa_required"}>{record.status}</SafetyBadge></div></article>)}</div></section><section aria-labelledby="gaps" className="rounded-2xl border border-border bg-surface p-5"><h2 id="gaps" className="text-xl font-semibold text-primary">Measurement and local visibility gaps</h2><ul className="mt-4 space-y-3">{dataGaps.length ? dataGaps.map((gap)=><li key={gap} className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">{gap}</li>):<li className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm text-muted">No packet evidence is available yet.</li>}</ul></section></div>
  </div>;
}

function Metric({ label, value }: { label: string; value: number }) { return <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">{label}</p><p className="mt-2 text-3xl font-semibold text-primary">{value}</p></div>; }
