import type { AiEmployeeToolboxReadinessReport, ConnectorMatrixStatus } from "@/lib/ai-employee-toolbox-readiness";

function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "good" | "warn" | "danger" }) {
  const toneClass =
    tone === "good"
      ? "border-emerald-200 bg-emerald-50 text-emerald-950"
      : tone === "warn"
        ? "border-amber-200 bg-amber-50 text-amber-950"
        : tone === "danger"
          ? "border-red-200 bg-red-50 text-red-950"
          : "border-slate-200 bg-white text-slate-700";

  return (
    <span className={`inline-flex min-h-7 items-center rounded-full border px-2.5 text-[11px] font-bold uppercase ${toneClass}`}>
      {children}
    </span>
  );
}

function statusTone(status: ConnectorMatrixStatus) {
  if (status === "ready") return "good";
  if (status === "partial" || status === "needs_approval" || status === "needs_credentials") return "warn";
  if (status === "blocked") return "danger";

  return "neutral";
}

function Stat({ label, value, tone = "neutral" }: { label: string; value: string | number; tone?: "neutral" | "good" | "warn" | "danger" }) {
  const textTone = tone === "good" ? "text-emerald-700" : tone === "warn" ? "text-amber-700" : tone === "danger" ? "text-red-700" : "text-primary";

  return (
    <div className="rounded-lg border border-border bg-white p-4">
      <p className="text-xs font-bold uppercase text-muted">{label}</p>
      <p className={`mt-2 break-words text-3xl font-semibold ${textTone}`}>{value}</p>
    </div>
  );
}

export function AiEmployeeToolboxReadinessDashboard({ report }: { report: AiEmployeeToolboxReadinessReport }) {
  const topEmployees = [...report.employees].sort((a, b) => a.toolbox.readinessPercent - b.toolbox.readinessPercent).slice(0, 12);
  const blockedDepartments = report.departments.filter((department) => department.missingTools.length > 0 || department.blockedTools.length > 0).slice(0, 8);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-surface p-5 md:p-6">
        <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 space-y-2">
            <p className="break-words text-sm font-semibold uppercase text-muted">AI Employee Toolbox Readiness</p>
            <h1 className="break-words text-3xl font-semibold text-primary">Company operational readiness</h1>
            <p className="max-w-4xl break-words text-sm leading-6 text-muted">
              Employee tools, connector readiness, certification levels, and activation priorities. Readiness visibility only; external execution remains blocked.
            </p>
          </div>
          <div className="flex max-w-full flex-wrap gap-2">
            <Badge tone="good">read-only</Badge>
            <Badge>providerCalled:{String(report.safety.providerCalled)}</Badge>
            <Badge tone="danger">external:{String(report.safety.externalExecutionAllowed)}</Badge>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-4 xl:grid-cols-7">
          <Stat label="Overall" value={`${report.companyOperationalReadiness.overall}%`} tone="good" />
          <Stat label="Workforce" value={`${report.companyOperationalReadiness.workforce}%`} />
          <Stat label="Departments" value={`${report.companyOperationalReadiness.departments}%`} />
          <Stat label="Loop" value={`${report.companyOperationalReadiness.operatingLoop}%`} />
          <Stat label="CEO Review" value={`${report.companyOperationalReadiness.ceoReview}%`} />
          <Stat label="Connectors" value={`${report.companyOperationalReadiness.connectorReadiness}%`} tone="warn" />
          <Stat label="External" value={`${report.companyOperationalReadiness.externalReadiness}%`} tone="danger" />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-lg border border-border bg-surface p-4">
          <h2 className="break-words text-xl font-semibold text-primary">Certification Distribution</h2>
          <div className="mt-3 grid gap-2">
            {([0, 1, 2, 3, 4, 5] as const).map((level) => (
              <div key={level} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3">
                <span className="text-sm font-semibold text-primary">Level {level}</span>
                <Badge tone={level >= 4 ? "danger" : level === 3 ? "good" : "neutral"}>{report.certificationDistribution[level]} employees</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-4">
          <h2 className="break-words text-xl font-semibold text-primary">Highest ROI Connectors To Activate Next</h2>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {report.highestRoiConnectorsToActivateNext.slice(0, 8).map((connector) => (
              <div key={connector.connectorId} className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="break-words text-sm font-semibold text-primary">{connector.connector}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge tone={statusTone(connector.status)}>{connector.status}</Badge>
                    {connector.connectorNeeded ? <Badge tone="danger">Connector Needed</Badge> : null}
                  </div>
                </div>
                <p className="mt-2 break-words text-xs leading-5 text-muted">
                  Enablement: {connector.enablementStatus}. Unlocks {connector.unlocksEmployees} employee(s), {connector.unlocksDepartments} department(s). Mode: {connector.mode}.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-surface p-4">
        <h2 className="break-words text-xl font-semibold text-primary">Company Connector Matrix</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase text-muted">
                <th className="py-2 pr-4">Connector</th>
                <th className="py-2 pr-4">Departments</th>
                <th className="py-2 pr-4">Employees</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Enablement</th>
                <th className="py-2 pr-4">Mode</th>
                <th className="py-2 pr-4">Impact</th>
              </tr>
            </thead>
            <tbody>
              {report.connectorMatrix.slice(0, 24).map((connector) => (
                <tr key={connector.connectorId} className="border-b border-slate-100">
                  <td className="py-3 pr-4 font-semibold text-primary">{connector.connector}</td>
                  <td className="py-3 pr-4 text-muted">{connector.unlocksDepartments}</td>
                  <td className="py-3 pr-4 text-muted">{connector.unlocksEmployees}</td>
                  <td className="py-3 pr-4"><Badge tone={statusTone(connector.status)}>{connector.status}</Badge></td>
                  <td className="py-3 pr-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge tone={connector.enablementStatus === "enabled" ? "good" : "danger"}>{connector.enablementStatus}</Badge>
                      {connector.connectorNeeded ? <Badge tone="danger">Connector Needed</Badge> : null}
                    </div>
                    <p className="mt-1 text-xs text-muted">internal fallback:{String(connector.safeInternalFallbackAvailable)}</p>
                  </td>
                  <td className="py-3 pr-4 text-muted">{connector.mode}</td>
                  <td className="py-3 pr-4 text-muted">{connector.revenueImpact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-4">
          <h2 className="break-words text-xl font-semibold text-primary">Employees Needing Tools</h2>
          <div className="mt-3 grid gap-3">
            {topEmployees.map((employee) => (
              <div key={employee.id} className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="flex min-w-0 flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <p className="break-words text-sm font-semibold text-primary">{employee.name}</p>
                    <p className="mt-1 break-words text-xs leading-5 text-muted">{employee.department} · {employee.certification.label}</p>
                  </div>
                  <Badge tone={employee.toolbox.readinessPercent >= 75 ? "good" : "warn"}>{employee.toolbox.readinessPercent}% ready</Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {employee.toolbox.missingTools.slice(0, 5).map((tool) => <Badge key={tool.toolKey} tone="warn">{tool.label}</Badge>)}
                  {employee.toolbox.blockedTools.slice(0, 3).map((tool) => <Badge key={tool.toolKey} tone="danger">{tool.label}</Badge>)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-4">
          <h2 className="break-words text-xl font-semibold text-primary">Departments Blocked By Tools</h2>
          <div className="mt-3 grid gap-3">
            {blockedDepartments.map((department) => (
              <div key={department.department} className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="break-words text-sm font-semibold text-primary">{department.department}</p>
                  <Badge tone={department.readinessPercent >= 75 ? "good" : "warn"}>{department.readinessPercent}%</Badge>
                </div>
                <p className="mt-2 break-words text-xs leading-5 text-muted">
                  Missing: {department.missingTools.slice(0, 5).join(", ") || "none"}
                </p>
                <p className="mt-1 break-words text-xs leading-5 text-muted">
                  Blocked: {department.blockedTools.slice(0, 5).join(", ") || "none"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
