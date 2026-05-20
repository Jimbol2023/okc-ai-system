"use client";

import {
  getOperatorNotePersistencePlan,
  type NotePersistenceScope,
} from "@/lib/operator-note-persistence-plan";

const scopeStyles: Record<NotePersistenceScope, string> = {
  safe_to_persist: "border-emerald-200 bg-emerald-50 text-emerald-800",
  future_optional: "border-amber-200 bg-amber-50 text-amber-800",
  advisory_ephemeral: "border-blue-200 bg-blue-50 text-blue-800",
  never_persist: "border-red-200 bg-red-50 text-red-800",
};

function formatLabel(value?: string) {
  return value ? value.replaceAll("_", " ") : "Unknown";
}

export function OperatorNotePersistencePlanPanel() {
  const plan = getOperatorNotePersistencePlan();
  const safeFields = plan.persistenceClassifications.filter((item) => item.scope === "safe_to_persist");
  const neverPersist = plan.persistenceClassifications.filter((item) => item.scope === "never_persist");

  return (
    <section className="rounded-[1.5rem] border border-border bg-surface p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-primary">Note persistence planning</h2>
          <p className="max-w-3xl text-sm leading-6 text-muted">
            Controlled future note persistence plan. Notes are context only. No note persistence, no write API, no database writes, no automation triggers, and no provider calls.
          </p>
        </div>
        <span className="inline-flex w-fit rounded-full bg-[#e7eef5] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#355066]">
          Read-only plan
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {plan.safetyLabels.map((label) => (
          <span key={label} className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-[#355066]">
            {label}
          </span>
        ))}
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-border bg-white p-4">
          <h3 className="text-lg font-semibold text-primary">Planned categories</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {plan.plannedCategories.map((category) => (
              <span key={category} className="rounded-full bg-[#eef2f3] px-2.5 py-1 text-xs font-semibold text-primary">
                {formatLabel(category)}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-4">
          <h3 className="text-lg font-semibold text-primary">Workflow areas</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {plan.plannedWorkflowAreas.map((area) => (
              <span key={area} className="rounded-full bg-[#eef2f3] px-2.5 py-1 text-xs font-semibold text-primary">
                {formatLabel(area)}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-4">
          <h3 className="text-lg font-semibold text-primary">Visibility levels</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {plan.plannedVisibilityLevels.map((level) => (
              <span key={level} className="rounded-full bg-[#eef2f3] px-2.5 py-1 text-xs font-semibold text-primary">
                {formatLabel(level)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        {[plan.safePersistenceModel, plan.freeTextSafetyControls, plan.executionIsolationRules, plan.auditReadabilityStandards].map((section) => (
          <article key={section.title} className="rounded-2xl border border-border bg-white p-4">
            <h3 className="text-lg font-semibold text-primary">{section.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{section.summary}</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-4">
          <h3 className="text-lg font-semibold text-primary">Future validation strategy</h3>
          <div className="mt-3 space-y-3">
            {plan.futureValidationRules.map((rule) => (
              <div key={rule.label} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-primary">{rule.label}</p>
                  <span className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-slate-700">
                    {rule.appliesTo}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-5 text-muted">{rule.plannedRule}</p>
                <p className="mt-1 text-xs leading-5 text-[#9f3a22]">{rule.failureBehavior}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-4">
          <h3 className="text-lg font-semibold text-primary">Restricted content rules</h3>
          <div className="mt-3 space-y-3">
            {plan.restrictedContentRules.map((rule) => (
              <div key={rule.category} className="rounded-xl border border-red-100 bg-red-50 p-3">
                <p className="text-sm font-semibold text-red-800">{rule.category}</p>
                <p className="mt-1 text-xs leading-5 text-red-700">{rule.plannedHandling}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {rule.examples.map((example) => (
                    <span key={example} className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-red-800">
                      {example}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-4">
          <h3 className="text-lg font-semibold text-primary">Safe to persist later</h3>
          <div className="mt-3 space-y-3">
            {safeFields.map((field) => (
              <div key={field.field} className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                <p className="text-sm font-semibold text-emerald-800">{field.field}</p>
                <p className="mt-1 text-xs leading-5 text-emerald-700">{field.purpose}</p>
                <p className="mt-1 text-xs leading-5 text-emerald-700">{field.safetyBoundary}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-4">
          <h3 className="text-lg font-semibold text-primary">Never persist</h3>
          <div className="mt-3 space-y-3">
            {neverPersist.map((field) => (
              <div key={field.field} className="rounded-xl border border-red-100 bg-red-50 p-3">
                <p className="text-sm font-semibold text-red-800">{field.field}</p>
                <p className="mt-1 text-xs leading-5 text-red-700">{field.safetyBoundary}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_1.1fr]">
        <div className="rounded-2xl border border-border bg-white p-4">
          <h3 className="text-lg font-semibold text-primary">{plan.commandCenterReportingIntegration.title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{plan.commandCenterReportingIntegration.summary}</p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
            {plan.commandCenterReportingIntegration.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-white p-4">
          <h3 className="text-lg font-semibold text-primary">Future API boundary</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{plan.futureApiBoundary.routeConcept}</p>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Allowed</p>
              <ul className="mt-2 space-y-2 text-xs leading-5 text-muted">
                {plan.futureApiBoundary.allowedResponsibilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Forbidden</p>
              <ul className="mt-2 space-y-2 text-xs leading-5 text-muted">
                {plan.futureApiBoundary.forbiddenResponsibilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Required</p>
              <ul className="mt-2 space-y-2 text-xs leading-5 text-muted">
                {plan.futureApiBoundary.safetyRequirements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-white p-4">
        <h3 className="text-lg font-semibold text-primary">All persistence classifications</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {plan.persistenceClassifications.map((field) => (
            <div key={field.field} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-primary">{field.field}</p>
                <span className={`rounded-md border px-2 py-1 text-xs font-bold ${scopeStyles[field.scope]}`}>
                  {formatLabel(field.scope)}
                </span>
              </div>
              <p className="mt-2 text-xs leading-5 text-muted">{field.purpose}</p>
            </div>
          ))}
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
