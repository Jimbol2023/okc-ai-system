import { SafetyBadge, StatusBadge } from "@/components/dashboard/dashboard-ui";
import type { DfdOperatingReport } from "@/lib/dfd-operating-conductor";

export function DfdOperatingConductorPanel({ report }: { report: DfdOperatingReport }) {
  return (
    <section aria-labelledby="dfd-operating-heading" className="rounded-lg border border-border bg-surface p-5 md:p-6">
      <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">DFD AI Operating Conductor</p>
          <h2 id="dfd-operating-heading" className="mt-2 break-words text-2xl font-semibold text-primary">
            Property Review Work Ranked By ROI
          </h2>
          <p className="mt-3 max-w-5xl break-words text-sm leading-6 text-muted">{report.summary}</p>
        </div>
        <div className="flex max-w-full flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.1em]">
          <SafetyBadge>readOnly:{String(report.safetyFlags.readOnly)}</SafetyBadge>
          <SafetyBadge>providerCalled:{String(report.safetyFlags.providerCalled)}</SafetyBadge>
          <SafetyBadge tone="urgent">liveExecution:{String(report.safetyFlags.liveExecutionAllowed)}</SafetyBadge>
          <SafetyBadge>scrapingBlocked:{String(report.safetyFlags.scrapingBlocked)}</SafetyBadge>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-lg border border-border bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Stored leads</p>
          <p className="mt-2 text-3xl font-semibold text-primary">{report.totals.storedLeads}</p>
        </div>
        <div className="rounded-lg border border-border bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Review priorities</p>
          <p className="mt-2 text-3xl font-semibold text-primary">{report.totals.propertyReviewPriorities}</p>
        </div>
        <div className="rounded-lg border border-border bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Governance stops</p>
          <p className="mt-2 text-3xl font-semibold text-primary">{report.totals.governanceStops}</p>
        </div>
        <div className="rounded-lg border border-border bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Distress signals</p>
          <p className="mt-2 text-3xl font-semibold text-primary">{report.totals.distressSignals}</p>
        </div>
        <div className="rounded-lg border border-border bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Bottlenecks</p>
          <p className="mt-2 text-3xl font-semibold text-primary">{report.totals.acquisitionBottlenecks}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          {report.topPriorities.length > 0 ? (
            report.topPriorities.slice(0, 5).map((priority) => (
              <article key={priority.id} className="rounded-lg border border-border bg-white p-4">
                <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="break-words text-sm font-semibold text-primary">{priority.title}</h3>
                    <p className="mt-1 break-words text-xs leading-5 text-muted">{priority.rationale}</p>
                  </div>
                  <StatusBadge status={priority.category === "governance_stop" ? "urgent" : "watch"} label={priority.category.replaceAll("_", " ")} />
                </div>
                <p className="mt-3 break-words text-sm leading-6 text-primary">{priority.nextInternalAction}</p>
                <p className="mt-2 break-words text-xs leading-5 text-muted">
                  Route: <span className="font-semibold text-primary">{priority.assignedDepartment}</span> · ROI rank {priority.roiRank}
                </p>
              </article>
            ))
          ) : (
            <div className="rounded-lg border border-amber-100 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
              No source-labeled property priorities are available yet.
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
            <h3 className="break-words text-lg font-semibold text-emerald-950">Internal Department Routes</h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-emerald-950">
              {report.departmentRoutes.slice(0, 6).map((route) => (
                <li key={route.department} className="break-words">
                  <span className="font-semibold">{route.department}:</span> {route.work}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
            <h3 className="break-words text-lg font-semibold text-blue-950">Connector Evidence</h3>
            <ul className="mt-3 space-y-2 text-xs leading-5 text-blue-950">
              {(report.connectorEvidence.length > 0 ? report.connectorEvidence : ["No Tier 1 connector evidence has been stored yet."]).slice(0, 6).map((item) => (
                <li key={item} className="break-words">{item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-amber-100 bg-amber-50 p-4">
            <h3 className="break-words text-lg font-semibold text-amber-950">Data Gaps</h3>
            <ul className="mt-3 space-y-2 text-xs leading-5 text-amber-950">
              {(report.dataGaps.length > 0 ? report.dataGaps : ["No DFD data gaps are visible."]).slice(0, 6).map((item) => (
                <li key={item} className="break-words">{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
