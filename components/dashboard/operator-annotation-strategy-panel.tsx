"use client";

import {
  getOperatorAnnotationStrategy,
  type AnnotationPersistenceScope,
} from "@/lib/operator-annotation-strategy";

const scopeStyles: Record<AnnotationPersistenceScope, string> = {
  safe_to_persist_later: "border-emerald-200 bg-emerald-50 text-emerald-800",
  future_optional: "border-amber-200 bg-amber-50 text-amber-800",
  do_not_persist: "border-red-200 bg-red-50 text-red-800",
};

function formatLabel(value?: string) {
  return value ? value.replaceAll("_", " ") : "Unknown";
}

export function OperatorAnnotationStrategyPanel() {
  const strategy = getOperatorAnnotationStrategy();
  const safeToPersist = strategy.futurePersistenceBoundaries.filter((item) => item.scope === "safe_to_persist_later");
  const doNotPersist = strategy.futurePersistenceBoundaries.filter((item) => item.scope === "do_not_persist");

  return (
    <section className="rounded-[1.5rem] border border-border bg-surface p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-primary">Operator annotation strategy</h2>
          <p className="max-w-3xl text-sm leading-6 text-muted">
            Planning-safe note and workflow annotation strategy. No note persistence, no write API, no automation triggers, and no outreach or document execution.
          </p>
        </div>
        <span className="inline-flex w-fit rounded-full bg-[#e7eef5] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#355066]">
          Context only
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {strategy.safetyLabels.map((label) => (
          <span key={label} className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-[#355066]">
            {label}
          </span>
        ))}
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h3 className="mb-3 text-lg font-semibold text-primary">Safe note categories</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {strategy.categories.map((category) => (
              <article key={category.id} className="rounded-2xl border border-border bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-primary">{category.label}</p>
                    <p className="mt-1 text-xs font-semibold uppercase text-muted">{formatLabel(category.workflowArea)}</p>
                  </div>
                  <span className={`rounded-md border px-2 py-1 text-xs font-bold ${scopeStyles[category.persistenceClassification]}`}>
                    {formatLabel(category.persistenceClassification)}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">{category.intendedUse}</p>
                <p className="mt-3 rounded-xl bg-[#eef2f3] px-3 py-2 text-xs font-semibold text-primary">{category.safetyLabel}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-white p-4">
            <h3 className="text-lg font-semibold text-primary">{strategy.safetyBoundaries.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{strategy.safetyBoundaries.summary}</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
              {strategy.safetyBoundaries.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-white p-4">
            <h3 className="text-lg font-semibold text-primary">{strategy.structuredFreeTextStrategy.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{strategy.structuredFreeTextStrategy.summary}</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
              {strategy.structuredFreeTextStrategy.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-4">
          <h3 className="text-lg font-semibold text-primary">Notes may influence</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {strategy.noteInfluenceRules.mayInfluence.map((item) => (
              <span key={item} className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-4">
          <h3 className="text-lg font-semibold text-primary">Notes must not influence</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {strategy.noteInfluenceRules.mustNotInfluence.map((item) => (
              <span key={item} className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-800">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-4">
          <h3 className="text-lg font-semibold text-primary">Future persistence boundaries</h3>
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

      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-border bg-white p-4">
          <h3 className="text-lg font-semibold text-primary">{strategy.annotationUxPlan.title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{strategy.annotationUxPlan.summary}</p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
            {strategy.annotationUxPlan.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-white p-4">
          <h3 className="text-lg font-semibold text-primary">{strategy.commandCenterReportingIntegration.title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{strategy.commandCenterReportingIntegration.summary}</p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
            {strategy.commandCenterReportingIntegration.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-white p-4">
          <h3 className="text-lg font-semibold text-primary">{strategy.governanceAuditReadability.title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{strategy.governanceAuditReadability.summary}</p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
            {strategy.governanceAuditReadability.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-4">
          <h3 className="text-lg font-semibold text-primary">Future annotation concepts</h3>
          <div className="mt-3 space-y-3">
            {strategy.futureModelConcepts.map((concept) => (
              <div key={concept.concept} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm font-semibold text-primary">{concept.concept}</p>
                <p className="mt-1 text-xs leading-5 text-muted">{concept.purpose}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-4">
          <h3 className="text-lg font-semibold text-primary">Non-goals</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {strategy.nonGoals.map((item) => (
              <span key={item} className="rounded-full bg-[#f5dfdc] px-2.5 py-1 text-xs font-semibold text-[#9f3a22]">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
