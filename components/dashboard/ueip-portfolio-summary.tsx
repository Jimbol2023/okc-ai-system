import type { createUeipPortfolioReport } from "@/lib/universal-enterprise-integration-platform";

type UeipPortfolioReport = ReturnType<typeof createUeipPortfolioReport>;

export function UeipPortfolioSummary({ report }: { report: UeipPortfolioReport }) {
  return (
    <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" aria-labelledby="ueip-heading">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">AI Core Platform</p>
          <h1 id="ueip-heading" className="mt-1 text-2xl font-bold text-slate-950">{report.initiative}</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Governed registry, semantic capabilities, tenant boundaries, credential references, policy decisions, health, and certification for every external-system boundary.
          </p>
        </div>
        <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
          {report.certifiedCount}/{report.connectorCount} manifests certified
        </span>
      </div>
      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Registered connectors" value={report.connectorCount} />
        <Metric label="Read-only lifecycle" value={report.lifecycleCounts.read_only} />
        <Metric label="Controlled writes" value={report.lifecycleCounts.controlled_write} />
        <Metric label="Provider calls from control plane" value={report.safety.providerCalled ? "Yes" : "No"} />
      </dl>
      <p className="mt-4 text-xs text-slate-500">
        Platform owner: {report.platformOwner}. Writes require exact-action approval and an authorized controlled-write lifecycle; all gateway decisions remain non-executing.
      </p>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <dt className="text-xs font-medium text-slate-500">{label}</dt>
      <dd className="mt-1 text-xl font-bold text-slate-900">{value}</dd>
    </div>
  );
}
