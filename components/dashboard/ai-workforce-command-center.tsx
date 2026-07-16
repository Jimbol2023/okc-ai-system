import type { AiEmployeeWorkStatus, AiWorkforceCommandCenterReport } from "@/lib/ai-collaboration-engine";

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

function statusTone(status: AiEmployeeWorkStatus) {
  if (status === "working") return "good";
  if (status === "waiting" || status === "needs_approval") return "warn";
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

export function AiWorkforceCommandCenter({ report }: { report: AiWorkforceCommandCenterReport }) {
  const departments = [...new Set(report.employees.map((employee) => employee.department))];

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-surface p-5 md:p-6">
        <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 space-y-2">
            <p className="break-words text-sm font-semibold uppercase text-muted">AI Workforce Command Center</p>
            <h1 className="break-words text-3xl font-semibold text-primary">AI workforce floor</h1>
            <p className="max-w-4xl break-words text-sm leading-6 text-muted">
              Employee status, interdepartment requests, dependency chains, blockers, and escalations. Internal coordination only.
            </p>
          </div>
          <div className="flex max-w-full flex-wrap gap-2">
            <Badge tone="good">read-only</Badge>
            <Badge>providerCalled:{String(report.safety.providerCalled)}</Badge>
            <Badge tone="danger">external:{String(report.safety.externalExecutionAllowed)}</Badge>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-4 xl:grid-cols-7">
          <Stat label="Employees" value={report.totals.employees} />
          <Stat label="Working" value={report.totals.working} tone="good" />
          <Stat label="Waiting" value={report.totals.waiting} tone="warn" />
          <Stat label="Blocked" value={report.totals.blocked} tone="danger" />
          <Stat label="Approvals" value={report.totals.needsApproval} tone="warn" />
          <Stat label="Requests" value={report.totals.requests} />
          <Stat label="Overall" value={`${report.readiness.overallAiCompanyReadiness}%`} />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-lg border border-border bg-surface p-4">
          <h2 className="break-words text-xl font-semibold text-primary">Internal Readiness</h2>
          <p className="mt-3 text-4xl font-semibold text-emerald-700">{report.readiness.internalOperationalReadiness.overall}%</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge>workforce {report.readiness.internalOperationalReadiness.workforce}%</Badge>
            <Badge>loop {report.readiness.internalOperationalReadiness.operatingLoop}%</Badge>
            <Badge>collab {report.readiness.internalOperationalReadiness.collaboration}%</Badge>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <h2 className="break-words text-xl font-semibold text-primary">External Readiness</h2>
          <p className="mt-3 text-4xl font-semibold text-red-700">{report.readiness.externalOperationalReadiness.overall}%</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge>connectors {report.readiness.externalOperationalReadiness.connectors}%</Badge>
            <Badge>crm {report.readiness.externalOperationalReadiness.crmExecution}%</Badge>
            <Badge tone="danger">publishing {report.readiness.externalOperationalReadiness.publishing}%</Badge>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <h2 className="break-words text-xl font-semibold text-primary">Escalations</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge tone="warn">manager {report.managerEscalations.length}</Badge>
            <Badge tone="warn">CEO {report.ceoEscalations.length}</Badge>
            <Badge tone={report.totals.blocked > 0 ? "danger" : "good"}>blocked {report.totals.blocked}</Badge>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        {departments.map((department) => {
          const employees = report.employees.filter((employee) => employee.department === department);

          return (
            <article key={department} className="rounded-lg border border-border bg-surface p-4">
              <h2 className="break-words text-xl font-semibold text-primary">{department}</h2>
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                {employees.map((employee) => (
                  <div key={employee.employeeId} className="rounded-lg border border-slate-200 bg-white p-4">
                    <div className="flex min-w-0 flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0">
                        <h3 className="break-words text-base font-semibold text-primary">{employee.employee}</h3>
                        <p className="mt-1 break-words text-xs leading-5 text-muted">Manager: {employee.manager}</p>
                      </div>
                      <Badge tone={statusTone(employee.status)}>{employee.status}</Badge>
                    </div>
                    <p className="mt-3 break-words text-sm leading-6 text-muted">{employee.currentAssignment}</p>
                    <div className="mt-3 grid gap-2 text-xs leading-5 text-muted md:grid-cols-2">
                      <p className="break-words">Requested by: {employee.requestedBy ?? "internal operating loop"}</p>
                      <p className="break-words">Waiting on: {employee.waitingOn ?? "none"}</p>
                      <p className="break-words">Handoff: {employee.handoffTarget ?? "none"}</p>
                      <p className="break-words">Due: {employee.dueDate ?? "today"}</p>
                    </div>
                    {employee.blocker ? (
                      <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-950">
                        {employee.blocker}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-4">
          <h2 className="break-words text-xl font-semibold text-primary">Interdepartment Requests</h2>
          <div className="mt-3 grid gap-3">
            {report.requests.slice(0, 12).map((request) => (
              <div key={request.id} className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="break-words text-sm font-semibold text-primary">{request.title}</p>
                  <Badge tone={request.status === "blocked" ? "danger" : request.status === "needs_ceo_approval" ? "warn" : "neutral"}>{request.status}</Badge>
                </div>
                <p className="mt-2 break-words text-xs leading-5 text-muted">
                  {request.fromDepartment} → {request.toDepartment}. Output: {request.neededOutput}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-4">
          <h2 className="break-words text-xl font-semibold text-primary">Dependency Chains</h2>
          <div className="mt-3 grid gap-3">
            {report.dependencyChains.slice(0, 12).map((chain) => (
              <div key={chain.id} className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="break-words text-sm font-semibold text-primary">{chain.employees.join(" → ")}</p>
                  <Badge tone={chain.status === "blocked" ? "danger" : chain.status === "needs_ceo_approval" ? "warn" : "neutral"}>{chain.status}</Badge>
                </div>
                {chain.blocker ? <p className="mt-2 break-words text-xs leading-5 text-muted">{chain.blocker}</p> : null}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
