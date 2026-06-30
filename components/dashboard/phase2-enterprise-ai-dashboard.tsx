import { Activity, Brain, Network, Newspaper, ShieldCheck } from "lucide-react";

import { listEnterpriseConnectors } from "@/lib/connector-platform";
import { getFeatureFlagSnapshot } from "@/lib/feature-flags";
import { createExecutiveBriefing, createPhase2DashboardSummary } from "@/lib/phase2-intelligence";

function formatLabel(value: string) {
  return value.replaceAll("_", " ");
}

export function Phase2EnterpriseAiDashboard() {
  const summary = createPhase2DashboardSummary();
  const briefing = createExecutiveBriefing("daily");
  const featureFlags = getFeatureFlagSnapshot();
  const connectors = listEnterpriseConnectors();

  return (
    <div className="space-y-6">
      <section className="rounded-[1.5rem] border border-border bg-white p-5 shadow-[0_18px_40px_rgba(17,37,52,0.05)] sm:p-6">
        <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Phase 2 foundation</p>
            <h1 className="break-words text-3xl font-semibold text-primary md:text-4xl">
              Enterprise AI Operating System
            </h1>
            <p className="max-w-4xl text-sm leading-6 text-muted md:text-base">
              Connector-aware, market-aware, relationship-aware intelligence under Safe Auto Mode. This dashboard is
              advisory-only and cannot call providers, publish, send, scrape, spend, or activate connectors.
            </p>
          </div>
          <div className="grid gap-2 text-xs font-bold uppercase tracking-[0.1em] sm:grid-cols-2">
            <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-2 text-blue-950">providerCalled:false</span>
            <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-2 text-blue-950">liveExecutionAllowed:false</span>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-950">safeAutoInternal:true</span>
            <span className="rounded-full border border-red-200 bg-red-50 px-3 py-2 text-red-950">externalWritesBlocked:true</span>
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Connectors", summary.connectorCount],
          ["Market signals", summary.marketSignalCount],
          ["Demand opportunities", summary.demandOpportunityCount],
          ["Growth drafts", summary.growthDraftCount],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-border bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-primary">{value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 h-5 w-5 text-emerald-700" aria-hidden="true" />
          <div>
            <h2 className="text-xl font-semibold text-primary">Feature flags</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Only connector platform visibility and Safe Auto Internal are enabled by default. Live reads and all
              provider families remain disabled until administrator approval.
            </p>
          </div>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {featureFlags.flags.map((flag) => (
            <article key={flag.key} className="rounded-xl border border-border bg-white p-3">
              <div className="flex items-start justify-between gap-3">
                <p className="break-words text-sm font-semibold text-primary">{formatLabel(flag.key)}</p>
                <span className={`rounded-full border px-2 py-1 text-xs font-bold ${flag.enabled ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-slate-200 bg-slate-50 text-slate-700"}`}>
                  {flag.enabled ? "on" : "off"}
                </span>
              </div>
              <p className="mt-2 text-xs leading-5 text-muted">{flag.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <Activity className="mt-1 h-5 w-5 text-blue-800" aria-hidden="true" />
          <div>
            <h2 className="text-xl font-semibold text-primary">Connector platform</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Connector metadata includes lifecycle, health, risk, approval requirements, circuit breaker state, and
              credential references only. No raw secrets are stored or shown.
            </p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 xl:grid-cols-2">
          {connectors.map((connector) => (
            <article key={connector.connectorId} className="rounded-2xl border border-border bg-white p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">{connector.provider}</p>
                  <h3 className="mt-1 text-base font-semibold text-primary">{connector.displayName}</h3>
                </div>
                <span className="w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold uppercase text-slate-700">
                  {formatLabel(connector.healthStatus)}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted">{connector.auditConfiguration}</p>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                <p className="text-sm text-muted"><span className="font-semibold text-primary">Auth:</span> {formatLabel(connector.authenticationType)}</p>
                <p className="text-sm text-muted"><span className="font-semibold text-primary">Lifecycle:</span> {formatLabel(connector.lifecycleState)}</p>
                <p className="text-sm text-muted"><span className="font-semibold text-primary">Circuit:</span> {formatLabel(connector.circuitBreakerState)}</p>
                <p className="text-sm text-muted"><span className="font-semibold text-primary">Owner:</span> {connector.owner}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <Newspaper className="mt-1 h-5 w-5 text-blue-800" aria-hidden="true" />
            <div>
              <h2 className="text-xl font-semibold text-primary">Market and demand intelligence</h2>
              <p className="mt-2 text-sm leading-6 text-muted">Signals are manual/import-ready and attribution-first.</p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {briefing.marketSignals.map((signal) => (
              <article key={signal.id} className="rounded-2xl border border-border bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">{formatLabel(signal.category)}</p>
                <h3 className="mt-2 text-base font-semibold text-primary">{signal.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{signal.businessImplication}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <Network className="mt-1 h-5 w-5 text-blue-800" aria-hidden="true" />
            <div>
              <h2 className="text-xl font-semibold text-primary">Growth engines</h2>
              <p className="mt-2 text-sm leading-6 text-muted">Personal brand and relationship outputs stay draft-only.</p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {briefing.growthDrafts.map((draft) => (
              <article key={draft.id} className="rounded-2xl border border-border bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">{formatLabel(draft.engine)}</p>
                <h3 className="mt-2 text-base font-semibold text-primary">{draft.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{draft.safetyBoundary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <Brain className="mt-1 h-5 w-5 text-blue-800" aria-hidden="true" />
          <div>
            <h2 className="text-xl font-semibold text-primary">Executive briefing priorities</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Recommendations include reasons, confidence, required review posture, and Safe Auto status.
            </p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {briefing.priorities.map((priority) => (
            <article key={priority.title} className="rounded-2xl border border-border bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">{formatLabel(priority.safeAutoStatus)}</p>
              <h3 className="mt-2 text-base font-semibold text-primary">{priority.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{priority.reason}</p>
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.1em] text-muted">Confidence {priority.confidence}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

