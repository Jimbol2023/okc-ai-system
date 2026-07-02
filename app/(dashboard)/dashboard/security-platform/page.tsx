import { DashboardCard, SafetyBadge, StatusBadge } from "@/components/dashboard/dashboard-ui";
import {
  createEnterpriseSecurityPlatformReport,
  type SecurityControlStatus,
  type SecuritySeverity,
  type ThreatSignal,
} from "@/lib/enterprise-security-platform";

export const dynamic = "force-dynamic";

function severityTone(severity: SecuritySeverity) {
  if (severity === "critical" || severity === "high") return "urgent";
  if (severity === "medium") return "watch";
  return "neutral";
}

function controlTone(status: SecurityControlStatus["status"]) {
  if (status === "blocked") return "urgent";
  if (status === "partial" || status === "planned") return "watch";
  return "neutral";
}

function formatLabel(value: string) {
  return value.replaceAll("_", " ");
}

function ControlCard({ control }: { control: SecurityControlStatus }) {
  return (
    <article className="rounded-lg border border-border bg-white p-4">
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="break-words text-base font-semibold text-primary">{control.title}</h2>
          <p className="mt-2 break-words text-sm leading-6 text-muted">{control.summary}</p>
        </div>
        <StatusBadge status={controlTone(control.status)} label={formatLabel(control.status)} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <SafetyBadge tone={severityTone(control.severity)}>severity:{control.severity}</SafetyBadge>
        <SafetyBadge>productionRequired:{String(control.requiredForProduction)}</SafetyBadge>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Evidence</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">
            {control.evidence.map((item) => (
              <li key={`${control.id}-${item}`}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-blue-900">Recommendations</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-blue-950">
            {control.recommendations.map((item) => (
              <li key={`${control.id}-${item}`}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

function ThreatCard({ signal }: { signal: ThreatSignal }) {
  return (
    <article className="rounded-lg border border-border bg-white p-4">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="break-words text-base font-semibold text-primary">{formatLabel(signal.category)}</h2>
          <p className="mt-2 break-words text-sm leading-6 text-muted">{signal.summary}</p>
        </div>
        <StatusBadge status={severityTone(signal.severity)} label={signal.severity} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <SafetyBadge>monitored:true</SafetyBadge>
        <SafetyBadge>containment:{String(signal.containmentAvailable)}</SafetyBadge>
      </div>
    </article>
  );
}

export default function SecurityPlatformPage() {
  const report = createEnterpriseSecurityPlatformReport();

  return (
    <div className="space-y-6">
      <DashboardCard className="p-5 md:p-6">
        <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 space-y-2">
            <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">Phase 5 AI Core</p>
            <h1 className="break-words text-3xl font-semibold text-primary">Enterprise Security Platform</h1>
            <p className="max-w-4xl break-words text-sm leading-6 text-muted">{report.summary}</p>
          </div>
          <div className="flex max-w-full flex-wrap gap-2">
            <SafetyBadge>zeroTrust:true</SafetyBadge>
            <SafetyBadge>providerCalled:false</SafetyBadge>
            <SafetyBadge>liveExecution:false</SafetyBadge>
            <SafetyBadge tone="urgent">productionGate:blocked</SafetyBadge>
          </div>
        </div>
      </DashboardCard>

      <section className="grid gap-4 md:grid-cols-3">
        <DashboardCard>
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">Security Health</p>
          <p className="mt-2 text-3xl font-semibold text-primary">{report.securityHealthScore}</p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">Threat Level</p>
          <div className="mt-3">
            <StatusBadge status={severityTone(report.threatLevel)} label={report.threatLevel} />
          </div>
        </DashboardCard>
        <DashboardCard>
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">Production Activation</p>
          <p className="mt-2 text-lg font-semibold text-primary">{report.productionActivationGate.allowed ? "Allowed" : "Blocked"}</p>
        </DashboardCard>
      </section>

      <DashboardCard>
        <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <h2 className="break-words text-xl font-semibold text-primary">Production Readiness Gate</h2>
            <p className="mt-2 max-w-3xl break-words text-sm leading-6 text-muted">
              Live connectors and production workflows remain blocked until every critical security requirement is satisfied.
            </p>
          </div>
          <StatusBadge status="urgent" label={`${report.productionActivationGate.blockers.length} blockers`} />
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <div className="rounded-lg border border-red-100 bg-red-50 p-3">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-red-800">Blockers</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-red-900">
              {report.productionActivationGate.blockers.slice(0, 8).map((blocker) => (
                <li key={blocker}>{blocker}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Required Checks</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {report.productionActivationGate.requiredChecks.map((check) => (
                <SafetyBadge key={check}>{check}</SafetyBadge>
              ))}
            </div>
          </div>
        </div>
      </DashboardCard>

      <section className="grid gap-4 xl:grid-cols-2">
        {report.controls.map((control) => (
          <ControlCard key={control.id} control={control} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {report.threatSignals.map((signal) => (
          <ThreatCard key={signal.id} signal={signal} />
        ))}
      </section>

      <DashboardCard>
        <h2 className="break-words text-xl font-semibold text-primary">Incident Response Timeline</h2>
        <p className="mt-2 break-words text-sm leading-6 text-muted">
          Every incident produces a containment path, root-cause review, recovery recommendation, and manual recovery approval requirement.
        </p>
        <ol className="mt-4 space-y-3">
          {report.incidentPlan.timeline.map((event, index) => (
            <li key={`${index}-${event}`} className="rounded-lg border border-border bg-white p-3 text-sm leading-6 text-muted">
              <span className="font-semibold text-primary">{index + 1}. </span>
              {event}
            </li>
          ))}
        </ol>
      </DashboardCard>
    </div>
  );
}
