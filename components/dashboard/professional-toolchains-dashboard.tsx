import type { createProfessionalToolchainsReport } from "@/lib/professional-toolchains";

type Report = ReturnType<typeof createProfessionalToolchainsReport>;

function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "good" | "warn" | "urgent" }) {
  const classes = tone === "good" ? "border-emerald-200 bg-emerald-50 text-emerald-950" : tone === "warn" ? "border-amber-200 bg-amber-50 text-amber-950" : tone === "urgent" ? "border-red-200 bg-red-50 text-red-950" : "border-slate-200 bg-white text-slate-700";
  return <span className={`inline-flex min-h-7 items-center rounded-full border px-2.5 text-[11px] font-bold uppercase tracking-[0.08em] ${classes}`}>{children}</span>;
}

function intakeTone(status: Report["intakeDecisions"][number]["status"]) {
  if (status === "ready_for_governed_enablement") return "good" as const;
  if (status === "calibration_only" || status === "security_review_required") return "warn" as const;
  return "urgent" as const;
}

export function ProfessionalToolchainsDashboard({ report, evidenceAvailable }: { report: Report; evidenceAvailable: boolean }) {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-surface p-5 md:p-6">
        <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">Professional Toolchains</p>
            <h1 className="break-words text-3xl font-semibold text-primary">J Capital AI Operating Company</h1>
            <p className="max-w-5xl break-words text-sm leading-6 text-muted">{report.operatingChain}</p>
          </div>
          <div className="flex max-w-full flex-wrap gap-2">
            <Badge tone={evidenceAvailable ? "good" : "warn"}>tenant evidence:{evidenceAvailable ? "loaded" : "unavailable"}</Badge>
            <Badge>advisory:{String(report.safety.advisoryOnly)}</Badge>
            <Badge tone="urgent">activation:{String(report.safety.connectorActivationAllowed)}</Badge>
            <Badge tone="urgent">external writes:{String(report.safety.externalWritesAllowed)}</Badge>
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {[
            ["Active waves", report.summary.activeWaves],
            ["Professionals", report.summary.professionals],
            ["Toolchains", report.summary.toolchains],
            ["Deliverables", report.summary.governedDeliverables],
            ["Enablement ready", report.summary.enablementReady],
          ].map(([label, value]) => <div key={label} className="rounded-lg border border-border bg-white p-4"><p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">{label}</p><p className="mt-2 text-3xl font-semibold text-primary">{value}</p></div>)}
        </div>
      </section>

      <section aria-labelledby="control-units-heading" className="rounded-lg border border-border bg-surface p-5">
        <h2 id="control-units-heading" className="text-xl font-semibold text-primary">Independent control system</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-muted">Control units govern quality, evidence, integration, safety, and learning. Operational professionals cannot override a failed independent review.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {report.controlUnits.map((unit) => (
            <article key={unit.unit} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-2"><h3 className="font-semibold text-primary">{unit.unit}</h3><Badge tone={unit.independent ? "good" : "neutral"}>{unit.independent ? "independent" : "command"}</Badge></div>
              <p className="mt-2 text-sm leading-6 text-muted">{unit.professionals.join(" · ")}</p>
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.08em] text-muted">Output</p><p className="mt-1 text-sm text-primary">{unit.accountableOutput}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="waves-heading" className="rounded-lg border border-border bg-surface p-5">
        <h2 id="waves-heading" className="text-xl font-semibold text-primary">Certification waves</h2>
        <div className="mt-4 grid gap-3 xl:grid-cols-2">
          {report.certificationWaves.map((wave) => (
            <article key={wave.id} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-2"><div><p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">Wave {wave.wave}</p><h3 className="mt-1 font-semibold text-primary">{wave.title}</h3></div><Badge tone={wave.lifecycle === "active" ? "good" : "neutral"}>{wave.lifecycle}</Badge></div>
              <p className="mt-2 text-sm leading-6 text-muted">{wave.objective}</p>
              <p className="mt-3 text-xs text-muted">Proof: {wave.calibrationMinimum} calibration · {wave.blindValidationMinimum} blind validation · human promotion required</p>
              {wave.blockers.length > 0 ? <p className="mt-2 text-xs leading-5 text-amber-900">Blockers: {wave.blockers.join("; ")}</p> : null}
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="toolchains-heading" className="space-y-4">
        <div><h2 id="toolchains-heading" className="text-xl font-semibold text-primary">Wave 1 professional toolchains</h2><p className="mt-1 text-sm leading-6 text-muted">Exact capabilities improve named deliverables. Qualification, readiness, and activation remain separate decisions.</p></div>
        {report.toolchains.map((toolchain) => {
          const decisions = report.intakeDecisions.filter((decision) => decision.toolchainId === toolchain.id);
          return (
            <article key={toolchain.id} className="rounded-lg border border-border bg-surface p-5">
              <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-start lg:justify-between"><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">{toolchain.department}</p><h3 className="mt-1 break-words text-lg font-semibold text-primary">{toolchain.title}</h3><p className="mt-2 text-sm leading-6 text-muted">Owner: {toolchain.accountableProfessionalId} · Reviewer: {toolchain.independentReviewerId}</p></div><Badge tone={toolchain.readiness === "calibration" ? "warn" : "neutral"}>{toolchain.readiness}</Badge></div>
              <div className="mt-4 grid gap-4 lg:grid-cols-3">
                <div><p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">Capabilities</p><div className="mt-2 flex flex-wrap gap-2">{toolchain.capabilities.map((capability) => <Badge key={`${capability.connectorId}:${capability.capabilityKey}`} tone={capability.runtimeState === "registered" ? "good" : "warn"}>{capability.connectorId}:{capability.capabilityKey}:{capability.runtimeState}</Badge>)}</div></div>
                <div><p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">Deliverables</p><p className="mt-2 text-sm leading-6 text-muted">{toolchain.deliverableIds.join(" · ")}</p></div>
                <div><p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">Fallback</p><p className="mt-2 text-sm leading-6 text-muted">{toolchain.safeFallback}</p></div>
              </div>
              <div className="mt-4 grid gap-3">
                {decisions.map((decision) => <div key={decision.connectorId} className="rounded-lg border border-slate-200 bg-white p-3"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-semibold text-primary">{decision.connectorId} intake</p><Badge tone={intakeTone(decision.status)}>{decision.status.replaceAll("_", " ")}</Badge></div><p className="mt-2 text-xs leading-5 text-muted">{decision.reasons.join(" ")}</p><p className="mt-1 text-xs leading-5 text-primary">Next: {decision.nextSafeAction}</p></div>)}
              </div>
            </article>
          );
        })}
      </section>

      <section aria-labelledby="expertise-heading" className="rounded-lg border border-border bg-surface p-5">
        <h2 id="expertise-heading" className="text-xl font-semibold text-primary">Expertise packs</h2>
        <div className="mt-4 grid gap-3 xl:grid-cols-3">
          {report.expertisePacks.map((pack) => <article key={pack.id} className="rounded-lg border border-slate-200 bg-white p-4"><div className="flex flex-wrap items-start justify-between gap-2"><h3 className="font-semibold text-primary">{pack.title}</h3><Badge>{pack.scope}</Badge></div><p className="mt-2 text-sm leading-6 text-muted">{pack.knowledgeDomains.join(" · ")}</p><p className="mt-3 text-xs leading-5 text-red-900">Prohibited: {pack.prohibitedConclusions.join("; ")}</p>{pack.regionalSpecialization ? <p className="mt-2 text-xs font-semibold text-primary">Regional scope: {pack.regionalSpecialization}</p> : null}</article>)}
        </div>
      </section>
    </div>
  );
}
