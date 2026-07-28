import type { AcquisitionDecisionBriefV1 } from "@/lib/enterprise-professional-workforce";

export function AcquisitionDecisionBriefView({ brief }: { brief: AcquisitionDecisionBriefV1 }) {
  return (
    <article className="space-y-5" aria-labelledby="acquisition-brief-heading">
      <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Internal advisory only</p>
        <h1 id="acquisition-brief-heading" className="mt-2 text-2xl font-bold text-slate-950">Acquisition Decision Brief</h1>
        <p className="mt-2 text-sm text-slate-600">{brief.executiveSummary}</p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Disposition" value={brief.disposition.replaceAll("_", " ")} />
          <Metric label="Identity confidence" value={`${brief.propertyIdentity.confidence}/100`} />
          <Metric label="QA" value={brief.qa.status.replaceAll("_", " ")} />
          <Metric label="Visible data gaps" value={brief.missingInformation.length} />
        </dl>
      </header>

      <section className="grid gap-4 lg:grid-cols-2" aria-label="Brief sections">
        {brief.sections.map((section) => (
          <div key={section.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h2 className="font-semibold text-slate-950">{section.title}</h2>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{section.status.replaceAll("_", " ")}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-700">{section.summary}</p>
            {section.missingData.length > 0 && <p className="mt-3 text-xs text-amber-800">Missing: {section.missingData.join(", ")}</p>}
            {section.conflicts.length > 0 && <p className="mt-2 text-xs text-red-800">Conflicts: {section.conflicts.join(" ")}</p>}
            <p className="mt-3 text-xs text-slate-500">Owner: {section.responsibleProfessionalId}. Human review required.</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" aria-labelledby="readiness-factors-heading">
        <h2 id="readiness-factors-heading" className="text-lg font-bold text-slate-950">Explainable readiness factors</h2>
        <div className="mt-4 space-y-4">
          {brief.readinessFactors.map((factor) => (
            <div key={factor.id}>
              <div className="flex justify-between gap-4 text-sm"><span className="font-medium text-slate-800">{factor.label}</span><span>{factor.score}/100</span></div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-700" style={{ width: `${factor.score}%` }} /></div>
              <p className="mt-1 text-xs text-slate-500">{factor.explanation}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
        <h2 className="font-bold text-blue-950">Recommended manual research action</h2>
        <p className="mt-2 text-sm text-blue-900">{brief.recommendedManualResearchAction.action}</p>
        <p className="mt-2 text-xs text-blue-800">{brief.recommendedManualResearchAction.reason}</p>
      </section>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-xl bg-slate-50 p-3"><dt className="text-xs text-slate-500">{label}</dt><dd className="mt-1 font-semibold capitalize text-slate-900">{value}</dd></div>;
}
