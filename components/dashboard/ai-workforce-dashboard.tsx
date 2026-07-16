import type { AiWorkforceReport, AiWorkforceReadinessStatus } from "@/lib/ai-workforce";

function statusTone(status: AiWorkforceReadinessStatus) {
  if (status === "ready") return "border-emerald-200 bg-emerald-50 text-emerald-950";
  if (status === "partial") return "border-blue-200 bg-blue-50 text-blue-950";
  if (status === "installed_but_idle") return "border-amber-200 bg-amber-50 text-amber-950";

  return "border-red-200 bg-red-50 text-red-950";
}

function statusLabel(status: AiWorkforceReadinessStatus) {
  return status.replaceAll("_", " ");
}

function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "urgent" }) {
  return (
    <span className={`inline-flex min-h-7 items-center rounded-full border px-2.5 text-[11px] font-bold uppercase tracking-[0.08em] ${tone === "urgent" ? "border-red-200 bg-red-50 text-red-950" : "border-slate-200 bg-white text-slate-700"}`}>
      {children}
    </span>
  );
}

export function AiWorkforceDashboard({ report }: { report: AiWorkforceReport }) {
  const blockedEmployees = report.employees.filter((employee) => employee.readinessStatus === "blocked");
  const operationalEmployees = report.employees.filter((employee) => employee.canProduceInternalOutputToday);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-surface p-5 md:p-6">
        <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 space-y-2">
            <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">AI Workforce Foundation</p>
            <h1 className="break-words text-3xl font-semibold text-primary">J Capital AI workforce roster</h1>
            <p className="max-w-4xl break-words text-sm leading-6 text-muted">
              Departments, managers, employees, tools, KPIs, blockers, and safe next actions for internal-only daily work. External execution remains blocked.
            </p>
          </div>
          <div className="flex max-w-full flex-wrap gap-2">
            <Badge>providerCalled:{String(report.safety.providerCalled)}</Badge>
            <Badge tone="urgent">liveExecution:{String(report.safety.liveExecutionAllowed)}</Badge>
            <Badge tone="urgent">externalActionsBlocked:{String(report.safety.externalActionsBlocked)}</Badge>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-5">
          <div className="rounded-lg border border-border bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">Departments</p>
            <p className="mt-2 text-3xl font-semibold text-primary">{report.totals.departments}</p>
          </div>
          <div className="rounded-lg border border-border bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">Employees</p>
            <p className="mt-2 text-3xl font-semibold text-primary">{report.totals.employees}</p>
          </div>
          <div className="rounded-lg border border-border bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">Internal today</p>
            <p className="mt-2 text-3xl font-semibold text-primary">{report.totals.internalOutputAvailableToday}</p>
          </div>
          <div className="rounded-lg border border-border bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">Partial</p>
            <p className="mt-2 text-3xl font-semibold text-primary">{report.totals.partial}</p>
          </div>
          <div className="rounded-lg border border-border bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">Blocked</p>
            <p className="mt-2 text-3xl font-semibold text-primary">{report.totals.blocked}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.85fr]">
        <div className="rounded-lg border border-border bg-surface p-4">
          <h2 className="break-words text-xl font-semibold text-primary">Top missing connectors</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {report.topMissingConnectors.length === 0 ? (
              <Badge>none</Badge>
            ) : (
              report.topMissingConnectors.map((connector) => <Badge key={connector}>{connector}</Badge>)
            )}
          </div>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <h2 className="break-words text-xl font-semibold text-primary">Operational today</h2>
          <p className="mt-2 break-words text-sm leading-6 text-muted">
            {operationalEmployees.length} AI employee(s) can produce internal-only output today. External execution is still prohibited.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        {report.departments.map((department) => (
          <article key={department.id} className="rounded-lg border border-border bg-surface p-4">
            <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <p className="break-words text-xs font-bold uppercase tracking-[0.12em] text-muted">{department.division}</p>
                <h2 className="mt-1 break-words text-xl font-semibold text-primary">{department.name}</h2>
                <p className="mt-1 break-words text-sm leading-6 text-muted">Manager: {department.manager}</p>
                <p className="mt-2 break-words text-sm leading-6 text-muted">{department.mission}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex min-h-8 items-center rounded-full border px-3 text-xs font-bold uppercase tracking-[0.08em] ${statusTone(department.readinessStatus)}`}>
                  {statusLabel(department.readinessStatus)} {department.readinessPercent}%
                </span>
                <Badge>internal:{String(department.canProduceInternalOutputToday)}</Badge>
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              {department.employees.map((employee) => (
                <div key={employee.id} className="rounded-lg border border-slate-200 bg-white p-4">
                  <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <h3 className="break-words text-base font-semibold text-primary">{employee.name}</h3>
                      <p className="mt-1 break-words text-sm leading-6 text-muted">{employee.mission}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className={`inline-flex min-h-8 items-center rounded-full border px-3 text-xs font-bold uppercase tracking-[0.08em] ${statusTone(employee.readinessStatus)}`}>
                        {statusLabel(employee.readinessStatus)} {employee.readinessPercent}%
                      </span>
                      <Badge>approval:{employee.approvalLevel}</Badge>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-3 lg:grid-cols-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">Daily work</p>
                      <ul className="mt-2 space-y-1 text-sm leading-6 text-muted">
                        {employee.dailyResponsibilities.map((item) => <li key={item} className="break-words">{item}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">Tools</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {employee.tools.map((tool) => (
                          <Badge key={tool.toolKey} tone={tool.status === "blocked" || tool.status === "missing" ? "urgent" : "neutral"}>
                            {tool.label}:{tool.status}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">Next safe action</p>
                      <p className="mt-2 break-words text-sm leading-6 text-muted">{employee.safeNextAction}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-lg border border-red-100 bg-red-50 p-4">
        <h2 className="break-words text-xl font-semibold text-red-950">Blocked employees</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {blockedEmployees.length === 0 ? (
            <p className="text-sm leading-6 text-red-950">No employees are fully blocked from internal-only output.</p>
          ) : (
            blockedEmployees.map((employee) => (
              <div key={employee.id} className="rounded-lg border border-red-200 bg-white p-3">
                <p className="break-words text-sm font-semibold text-primary">{employee.name}</p>
                <p className="mt-1 break-words text-xs leading-5 text-muted">{employee.safeNextAction}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
