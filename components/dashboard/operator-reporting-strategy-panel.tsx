"use client";

import {
  getReportingPersistencePlan,
  type PersistenceScope,
} from "@/lib/operator-reporting-persistence-plan";

const scopeStyles: Record<PersistenceScope, string> = {
  safe_to_persist: "border-emerald-200 bg-emerald-50 text-emerald-800",
  advisory_ephemeral: "border-blue-200 bg-blue-50 text-blue-800",
  future_optional: "border-amber-200 bg-amber-50 text-amber-800",
  do_not_persist: "border-red-200 bg-red-50 text-red-800",
};

function formatLabel(value?: string) {
  return value ? value.replaceAll("_", " ") : "Unknown";
}

export function OperatorReportingStrategyPanel() {
  const plan = getReportingPersistencePlan();
  const safeToPersist = plan.persistenceClassifications.filter((item) => item.scope === "safe_to_persist");
  const doNotPersist = plan.persistenceClassifications.filter((item) => item.scope === "do_not_persist");

  return (
    <section className="rounded-[1.5rem] border border-border bg-surface p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-primary">Reporting persistence strategy</h2>
          <p className="max-w-3xl text-sm leading-6 text-muted">
            Future-safe reporting persistence plan. Planning only. No scheduled reports, no persistence worker, no provider payloads, and no outreach or document execution.
          </p>
        </div>
        <span className="inline-flex w-fit rounded-full bg-[#e7eef5] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#355066]">
          Aggregate reporting strategy only
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {plan.safetyLabels.map((label) => (
          <span key={label} className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-[#355066]">
            {label}
          </span>
        ))}
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <div>
          <h3 className="mb-3 text-lg font-semibold text-primary">Snapshot strategy</h3>
          <div className="space-y-3">
            {plan.snapshotStrategies.map((strategy) => (
              <article key={strategy.label} className="rounded-2xl border border-border bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-primary">{strategy.label}</p>
                    <p className="mt-1 text-xs font-semibold uppercase text-muted">{formatLabel(strategy.cadence)}</p>
                  </div>
                  <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-700">
                    Future only
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">{strategy.purpose}</p>
                <p className="mt-2 text-xs leading-5 text-muted">{strategy.persistenceBoundary}</p>
              </article>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-semibold text-primary">Persistence scope</h3>
          <div className="space-y-3">
            {plan.persistenceClassifications.map((item) => (
              <article key={item.label} className="rounded-2xl border border-border bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-primary">{item.label}</p>
                  <span className={`rounded-md border px-2 py-1 text-xs font-bold ${scopeStyles[item.scope]}`}>
                    {formatLabel(item.scope)}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">{item.reason}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.examples.slice(0, 4).map((example) => (
                    <span key={example} className="rounded-full bg-[#eef2f3] px-2.5 py-1 text-xs font-semibold text-primary">
                      {example}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-4">
          <h3 className="text-lg font-semibold text-primary">{plan.trendBaselineStrategy.title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{plan.trendBaselineStrategy.summary}</p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
            {plan.trendBaselineStrategy.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-white p-4">
          <h3 className="text-lg font-semibold text-primary">{plan.reportingSafetyPrivacyBoundaries.title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{plan.reportingSafetyPrivacyBoundaries.summary}</p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
            {plan.reportingSafetyPrivacyBoundaries.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-4">
          <h3 className="text-lg font-semibold text-primary">Future snapshot concepts</h3>
          <div className="mt-3 space-y-3">
            {plan.futureSnapshotShapes.map((shape) => (
              <div key={shape.concept} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm font-semibold text-primary">{shape.concept}</p>
                <p className="mt-1 text-xs leading-5 text-muted">{shape.purpose}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-4">
          <h3 className="text-lg font-semibold text-primary">Do not persist</h3>
          <div className="mt-3 space-y-3">
            {doNotPersist.map((item) => (
              <div key={item.label} className="rounded-xl border border-red-100 bg-red-50 p-3">
                <p className="text-sm font-semibold text-red-800">{item.label}</p>
                <p className="mt-1 text-xs leading-5 text-red-700">{item.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-4">
          <h3 className="text-lg font-semibold text-primary">Safe to persist later</h3>
          <div className="mt-3 space-y-3">
            {safeToPersist.map((item) => (
              <div key={item.label} className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                <p className="text-sm font-semibold text-emerald-800">{item.label}</p>
                <p className="mt-1 text-xs leading-5 text-emerald-700">{item.reason}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-4">
          <h3 className="text-lg font-semibold text-primary">{plan.r13IntegrationStrategy.title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{plan.r13IntegrationStrategy.summary}</p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
            {plan.r13IntegrationStrategy.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-white p-4">
        <h3 className="text-lg font-semibold text-primary">Non-goals</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {plan.nonGoals.map((item) => (
            <span key={item} className="rounded-full bg-[#f5dfdc] px-2.5 py-1 text-xs font-semibold text-[#9f3a22]">
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
