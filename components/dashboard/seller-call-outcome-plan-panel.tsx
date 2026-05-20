"use client";

import {
  getSellerCallOutcomePlan,
  type SellerCallCaptureFieldScope,
  type SellerCallOutcomeDefinition,
  type SellerCallPersistenceScope,
} from "@/lib/seller-call-outcome-plan";

type SellerCallOutcomePlanPanelProps = {
  compact?: boolean;
};

const fieldScopeStyles: Record<SellerCallCaptureFieldScope, string> = {
  structured_safe: "border-emerald-200 bg-emerald-50 text-emerald-800",
  bounded_free_text: "border-blue-200 bg-blue-50 text-blue-800",
  future_optional: "border-amber-200 bg-amber-50 text-amber-800",
  never_capture: "border-red-200 bg-red-50 text-red-800",
};

const persistenceScopeStyles: Record<SellerCallPersistenceScope, string> = {
  safe_to_persist: "border-emerald-200 bg-emerald-50 text-emerald-800",
  bounded_free_text: "border-blue-200 bg-blue-50 text-blue-800",
  derived_visibility_only: "border-amber-200 bg-amber-50 text-amber-800",
  never_persist: "border-red-200 bg-red-50 text-red-800",
};

function formatLabel(value?: string) {
  return value ? value.replaceAll("_", " ") : "Unknown";
}

function OutcomeCard({ outcome }: { outcome: SellerCallOutcomeDefinition }) {
  return (
    <article className="rounded-2xl border border-border bg-white p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-primary">{outcome.label}</h3>
          <p className="mt-1 text-xs font-semibold uppercase text-muted">{outcome.id}</p>
        </div>
        <span
          className={`w-fit rounded-md border px-2 py-1 text-xs font-bold ${
            outcome.reviewRequired ? "border-orange-200 bg-orange-50 text-orange-800" : "border-slate-200 bg-slate-50 text-slate-700"
          }`}
        >
          {outcome.reviewRequired ? "Review required" : "Operator review"}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted">{outcome.revenueMeaning}</p>
      <p className="mt-2 rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-950">
        <span className="font-semibold">Manual next step:</span> {outcome.manualNextStep}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {outcome.safetyFlags.map((flag) => (
          <span key={flag} className="rounded-full bg-[#f5dfdc] px-2.5 py-1 text-xs font-semibold text-[#9f3a22]">
            {formatLabel(flag)}
          </span>
        ))}
      </div>
    </article>
  );
}

export function SellerCallOutcomePlanPanel({ compact = false }: SellerCallOutcomePlanPanelProps) {
  const plan = getSellerCallOutcomePlan();

  return (
    <section className={compact ? "rounded-xl border bg-white p-5" : "rounded-[1.5rem] border border-border bg-surface p-6"}>
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <h2 className={compact ? "text-xl font-bold" : "text-xl font-semibold text-primary"}>Seller call outcome capture strategy</h2>
          <p className="max-w-3xl text-sm leading-6 text-muted">
            Planning-safe human-reviewed capture loop for calls manually completed outside the system. No persistence, no write API, no outreach sent, no automation triggered, and no provider called.
          </p>
        </div>
        <span className="inline-flex w-fit rounded-full bg-[#e7eef5] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#355066]">
          Capture strategy only
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
        {[plan.manualOnlyCaptureRules, plan.freeTextSafetyBoundaries, plan.dncEscalationVisibility, plan.approvalGatePreservation].map((section) => (
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
        {[plan.controlledPersistenceDesign, plan.validationAndSanitizationVisibility, plan.dncPersistenceSafety, plan.appendOnlyPersistenceDirection].map((section) => (
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

      <div className="mt-5">
        <h3 className="mb-3 text-lg font-semibold text-primary">Structured outcome taxonomy</h3>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {plan.outcomeDefinitions.map((outcome) => (
            <OutcomeCard key={outcome.id} outcome={outcome} />
          ))}
        </div>
      </div>

      <div className="mt-5">
        <h3 className="mb-3 text-lg font-semibold text-primary">Future-safe capture fields</h3>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {plan.captureFields.map((field) => (
            <article key={field.field} className="rounded-2xl border border-border bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-primary">{field.field}</p>
                <span className={`rounded-md border px-2 py-1 text-xs font-bold ${fieldScopeStyles[field.scope]}`}>
                  {formatLabel(field.scope)}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted">{field.intendedUse}</p>
              <p className="mt-2 text-xs leading-5 text-muted">{field.validationConcept}</p>
              <p className="mt-2 text-xs font-semibold leading-5 text-[#9f3a22]">{field.executionBoundary}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <h3 className="mb-3 text-lg font-semibold text-primary">R19 persistence classifications</h3>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {plan.persistenceClassifications.map((field) => (
            <article key={field.field} className="rounded-2xl border border-border bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-primary">{field.field}</p>
                <span className={`rounded-md border px-2 py-1 text-xs font-bold ${persistenceScopeStyles[field.scope]}`}>
                  {formatLabel(field.scope)}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted">{field.futureStorageDirection}</p>
              <p className="mt-2 text-xs leading-5 text-muted">{field.validationRequirement}</p>
              <p className="mt-2 text-xs font-semibold leading-5 text-[#9f3a22]">{field.executionBoundary}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <article className="rounded-2xl border border-border bg-white p-4">
          <h3 className="text-lg font-semibold text-primary">Validation rules</h3>
          <div className="mt-3 space-y-3">
            {plan.validationRules.map((rule) => (
              <div key={rule.label} className="rounded-xl border border-border bg-surface p-3">
                <p className="text-sm font-semibold text-primary">{rule.label}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted">{rule.appliesTo}</p>
                <p className="mt-2 text-sm leading-6 text-muted">{rule.plannedRule}</p>
                <p className="mt-2 text-xs font-semibold leading-5 text-[#9f3a22]">{rule.failureBehavior}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-border bg-white p-4">
          <h3 className="text-lg font-semibold text-primary">Append-only model direction</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{plan.appendOnlyModelGuidance.direction}</p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Preferred future shape</p>
          <ul className="mt-2 space-y-2 text-sm leading-6 text-muted">
            {plan.appendOnlyModelGuidance.preferredShape.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Forbidden shape</p>
          <ul className="mt-2 space-y-2 text-sm leading-6 text-muted">
            {plan.appendOnlyModelGuidance.forbiddenShape.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-3 rounded-md border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold leading-5 text-red-800">
            {plan.appendOnlyModelGuidance.executionReaderRule}
          </p>
        </article>
      </div>

      {!compact ? (
        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          <article className="rounded-2xl border border-border bg-white p-4">
            <h3 className="text-lg font-semibold text-primary">{plan.revenueWorkflowContext.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{plan.revenueWorkflowContext.summary}</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
              {plan.revenueWorkflowContext.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-border bg-white p-4">
            <h3 className="text-lg font-semibold text-primary">{plan.futureLearningReadiness.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{plan.futureLearningReadiness.summary}</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
              {plan.futureLearningReadiness.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-border bg-white p-4 xl:col-span-2">
            <h3 className="text-lg font-semibold text-primary">{plan.rollbackAndSafetyVisibility.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{plan.rollbackAndSafetyVisibility.summary}</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
              {plan.rollbackAndSafetyVisibility.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      ) : null}

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <article className="rounded-2xl border border-border bg-white p-4">
          <h3 className="text-lg font-semibold text-primary">{plan.noAutomationTriggerGuarantee.title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{plan.noAutomationTriggerGuarantee.summary}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {plan.neverTrigger.map((item) => (
              <span key={item} className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-800">
                {item}
              </span>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-border bg-white p-4">
          <h3 className="text-lg font-semibold text-primary">Never capture</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {plan.neverCapture.map((item) => (
              <span key={item} className="rounded-full bg-[#f5dfdc] px-2.5 py-1 text-xs font-semibold text-[#9f3a22]">
                {item}
              </span>
            ))}
          </div>
        </article>
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-white p-4">
        <h3 className="text-lg font-semibold text-primary">Future API boundary concept</h3>
        <p className="mt-2 text-sm leading-6 text-muted">{plan.futureApiBoundary.routeConcept}</p>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Allowed later</p>
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
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Isolation required</p>
            <ul className="mt-2 space-y-2 text-xs leading-5 text-muted">
              {plan.futureApiBoundary.requiredIsolation.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
