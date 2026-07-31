import Link from "next/link";
import type { Route } from "next";
import { AiWorkforceCommandCenter } from "@/components/dashboard/ai-workforce-command-center";
import type { CeoOperatingScorecardReport, CeoScorecardStatus } from "@/lib/ceo-operating-scorecard";

function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "good" | "warn" | "danger" }) {
  const toneClass =
    tone === "good"
      ? "border-emerald-200 bg-emerald-50 text-emerald-950"
      : tone === "warn"
        ? "border-amber-200 bg-amber-50 text-amber-950"
        : tone === "danger"
          ? "border-red-200 bg-red-50 text-red-950"
          : "border-slate-200 bg-white text-slate-700";

  return <span className={`inline-flex min-h-7 items-center rounded-full border px-2.5 text-[11px] font-bold uppercase ${toneClass}`}>{children}</span>;
}

function statusTone(status: CeoScorecardStatus | string) {
  if (status === "ready" || status === "measured") return "good";
  if (status === "blocked") return "danger";
  if (status === "needs_ceo_approval" || status === "watch" || status === "not_yet_measured") return "warn";

  return "neutral";
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} tabIndex={-1} className="rounded-lg border border-border bg-surface p-4 md:p-5">
      <h2 className="break-words text-xl font-semibold text-primary">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function KpiValue({ value }: { value: string | number }) {
  return <span className="break-words text-2xl font-semibold text-primary">{value}</span>;
}

export function CeoOperatingScorecard({ report }: { report: CeoOperatingScorecardReport }) {
  const readyWork = report.departments.filter((department) => department.status === "ready").length;
  const blockedWork = report.departments.filter((department) => department.status === "blocked").length;

  return (
    <div className="space-y-6" data-testid="ceo-operating-scorecard">
      <section className="rounded-lg border border-border bg-surface p-5 md:p-6" aria-labelledby="ceo-scorecard-title">
        <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 space-y-2">
            <p className="break-words text-sm font-semibold uppercase text-muted">CEO Operating Scorecard</p>
            <h1 id="ceo-scorecard-title" className="break-words text-3xl font-semibold text-primary">
              Daily operating loop control
            </h1>
            <p className="max-w-4xl break-words text-sm leading-6 text-muted">
              One read-only view for today&apos;s objective, active mission, department work, approvals, KPI evidence, connector gaps, and governance boundaries.
            </p>
          </div>
          <div className="flex max-w-full flex-wrap gap-2">
            <Badge tone="good">read-only</Badge>
            <Badge>tenant:{report.tenantScope}</Badge>
            <Badge>providerCalled:{String(report.governance.providerCalled)}</Badge>
            <Badge tone="danger">external:{String(report.governance.externalExecutionPermitted)}</Badge>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-bold uppercase text-muted">Owner</p>
            <p className="mt-2 break-words text-lg font-semibold text-primary">{report.objective.ownerDepartment}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-bold uppercase text-muted">Mission</p>
            <p className="mt-2 break-words text-lg font-semibold text-primary">{report.mission.status}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-bold uppercase text-muted">Ready work</p>
            <p className="mt-2 break-words text-lg font-semibold text-primary">{readyWork}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-bold uppercase text-muted">Blocked</p>
            <p className="mt-2 break-words text-lg font-semibold text-red-700">{blockedWork + report.connectorReadiness.length}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-bold uppercase text-muted">CEO approvals</p>
            <p className="mt-2 break-words text-lg font-semibold text-amber-700">{report.approvals.length}</p>
          </div>
        </div>
      </section>

      <nav aria-label="Scorecard drill-down links" className="rounded-lg border border-border bg-surface p-3">
        <div className="flex flex-wrap gap-2">
          {report.drillDownLinks.map((link) => (
            <Link key={link.href} href={link.href as Route} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-primary hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary">
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      <section className="grid gap-4 xl:grid-cols-2">
        <Section id="scorecard-objective" title="Today's Business Objective">
          <div className="space-y-3">
            <p className="break-words text-2xl font-semibold text-primary">{report.objective.objective}</p>
            <div className="flex flex-wrap gap-2">
              <Badge tone="warn">{report.objective.status}</Badge>
              <Badge>{report.objective.targetPeriod}</Badge>
              <Badge>{report.objective.ownerProfessional}</Badge>
            </div>
            <p className="break-words text-sm leading-6 text-muted">Target KPI: {report.objective.targetKpi}</p>
            <p className="break-words text-sm leading-6 text-muted">Current KPI: {report.objective.currentKpi.value}</p>
          </div>
        </Section>

        <Section id="scorecard-mission" title="Daily Mission">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge tone={statusTone(report.mission.status)}>{report.mission.status}</Badge>
              <Badge>{report.mission.dueState}</Badge>
              <Badge>{report.mission.evidenceReadiness}</Badge>
            </div>
            <p className="break-words text-lg font-semibold text-primary">{report.mission.title}</p>
            <p className="break-words text-sm leading-6 text-muted">Assigned departments: {report.mission.assignedDepartments.join(", ") || "no evidence"}</p>
            <p className="break-words text-sm leading-6 text-muted">Dependencies: {report.mission.dependencies.join("; ") || "none visible"}</p>
          </div>
        </Section>
      </section>

      <Section id="scorecard-kpis" title="KPI Movement">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {report.kpiEvidence.map((kpi) => (
            <article key={kpi.id} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="break-words text-sm font-semibold text-primary">{kpi.label}</h3>
                <Badge tone={statusTone(kpi.evidenceState)}>{kpi.evidenceState}</Badge>
              </div>
              <p className="mt-3">
                <KpiValue value={kpi.value} /> <span className="text-xs text-muted">{kpi.unit}</span>
              </p>
              <p className="mt-2 break-words text-xs leading-5 text-muted">{kpi.detail}</p>
            </article>
          ))}
        </div>
      </Section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Section id="scorecard-departments" title="Department Work">
          <div className="grid gap-3">
            {report.departments.slice(0, 12).map((department) => (
              <article key={department.department} className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex min-w-0 flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <h3 className="break-words text-base font-semibold text-primary">{department.department}</h3>
                  <Badge tone={statusTone(department.status)}>{department.status}</Badge>
                </div>
                <p className="mt-2 break-words text-sm leading-6 text-muted">{department.assignedWork}</p>
                <p className="mt-2 break-words text-xs leading-5 text-muted">Latest deliverable: {department.latestDeliverable}</p>
                <p className="mt-1 break-words text-xs leading-5 text-muted">QA: {department.qaStatus}. Approval needed: {String(department.approvalNeeded)}</p>
                {department.blocker ? <p className="mt-2 rounded-md border border-amber-200 bg-amber-50 p-2 text-xs leading-5 text-amber-950">{department.blocker}</p> : null}
              </article>
            ))}
          </div>
        </Section>

        <Section id="scorecard-decisions" title="CEO Decisions">
          <div className="grid gap-3">
            {report.approvals.length > 0 ? (
              report.approvals.map((approval) => (
                <article key={approval.id} className="rounded-lg border border-slate-200 bg-white p-4">
                  <div className="flex min-w-0 flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <h3 className="break-words text-base font-semibold text-primary">{approval.title}</h3>
                    <Badge tone={statusTone(approval.riskLevel)}>{approval.riskLevel}</Badge>
                  </div>
                  <p className="mt-2 break-words text-sm leading-6 text-muted">Recommended decision: {approval.recommendedDecision}</p>
                  <p className="mt-1 break-words text-xs leading-5 text-muted">Evidence count: {approval.evidenceCount}. Next action: {approval.nextAction}</p>
                </article>
              ))
            ) : (
              <p className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-muted">No pending CEO approval evidence is available.</p>
            )}
          </div>
        </Section>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Section id="scorecard-connectors" title="Connector And Data Gaps">
          <div className="grid gap-3">
            {report.connectorReadiness.map((connector) => (
              <article key={`${connector.connector}-${connector.sourceLabel}`} className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex min-w-0 flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <h3 className="break-words text-base font-semibold text-primary">{connector.connector}</h3>
                  <Badge tone={connector.readinessState === "healthy" ? "good" : "warn"}>{connector.readinessState}</Badge>
                </div>
                <p className="mt-2 break-words text-sm leading-6 text-muted">{connector.dataGap}</p>
                <p className="mt-1 break-words text-xs leading-5 text-muted">Affected: {connector.departmentAffected}. Safe next step: {connector.safeNextStep}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section id="scorecard-governance" title="Governance">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-xs font-bold uppercase text-muted">Phase 3</p>
              <p className="mt-2 break-words text-lg font-semibold text-primary">{report.governance.phase3Status}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-xs font-bold uppercase text-muted">Phase 4</p>
              <p className="mt-2 break-words text-lg font-semibold text-red-700">{report.governance.phase4Status}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-xs font-bold uppercase text-muted">Provider called</p>
              <p className="mt-2 break-words text-lg font-semibold text-primary">{String(report.governance.providerCalled)}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-xs font-bold uppercase text-muted">Live execution</p>
              <p className="mt-2 break-words text-lg font-semibold text-red-700">{String(report.governance.liveExecutionAllowed)}</p>
            </div>
          </div>
        </Section>
      </section>

      <Section id="scorecard-loop" title="Controlled Operating Loop">
        <div className="grid gap-3 lg:grid-cols-2">
          {report.operatingLoop.map((step) => (
            <article key={step.id} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex min-w-0 flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <h3 className="break-words text-base font-semibold text-primary">{step.label}</h3>
                <Badge tone={statusTone(step.status)}>{step.status}</Badge>
              </div>
              <p className="mt-2 break-words text-sm leading-6 text-muted">Owner: {step.owner}</p>
              <p className="mt-1 break-words text-xs leading-5 text-muted">Evidence: {step.evidence}</p>
              <p className="mt-1 break-words text-xs leading-5 text-muted">Next action: {step.nextAction}</p>
              {step.blocker ? <p className="mt-2 rounded-md border border-amber-200 bg-amber-50 p-2 text-xs leading-5 text-amber-950">{step.blocker}</p> : null}
            </article>
          ))}
        </div>
      </Section>

      <Section id="scorecard-workforce" title="Workforce Drill-Down">
        <AiWorkforceCommandCenter report={report.embeddedWorkforce} />
      </Section>
    </div>
  );
}
