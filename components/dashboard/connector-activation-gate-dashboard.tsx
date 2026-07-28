import type { ConnectorActivationGateReport, ConnectorGateHealthStatus } from "@/lib/connector-activation-gate";
import type {
  ConnectorCredentialScopeVerificationReport,
  ConnectorScopeVerificationStatus,
  SecretConfigClassification,
} from "@/lib/connector-credential-scope-verification";

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

function healthTone(status: ConnectorGateHealthStatus) {
  if (status === "ready") return "good";
  if (status === "partial" || status === "not_configured") return "warn";
  return "danger";
}

function credentialTone(status: SecretConfigClassification) {
  if (status === "configured") return "good";
  if (status === "missing" || status === "placeholder" || status === "malformed") return "danger";
  return "warn";
}

function scopeTone(status: ConnectorScopeVerificationStatus) {
  if (status === "valid") return "good";
  if (status === "missing") return "danger";
  return "warn";
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

export function ConnectorActivationGateDashboard({
  report,
  verification,
}: {
  report: ConnectorActivationGateReport;
  verification?: ConnectorCredentialScopeVerificationReport;
}) {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-surface p-5 md:p-6">
        <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 space-y-2">
            <p className="break-words text-sm font-semibold uppercase text-muted">Sprint 6A Connector Activation Gate</p>
            <h1 className="break-words text-3xl font-semibold text-primary">Google Workspace read-only foundation</h1>
            <p className="max-w-4xl break-words text-sm leading-6 text-muted">
              Connector readiness, allowed read-only actions, forbidden actions, certification impact, and next safe setup steps. This view does not activate OAuth,
              change credentials, or allow provider writes.
            </p>
          </div>
          <div className="flex max-w-full flex-wrap gap-2">
            <Badge tone="good">read-only</Badge>
            <Badge>providerCalled:{String(report.providerCalled)}</Badge>
            <Badge tone="danger">liveExecution:{String(report.liveExecutionAllowed)}</Badge>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-4 xl:grid-cols-7">
          <Stat label="Connectors" value={report.summary.connectors} />
          <Stat label="Ready" value={report.summary.ready} tone="good" />
          <Stat label="Partial" value={report.summary.partial} tone="warn" />
          <Stat label="Blocked" value={report.summary.blocked} tone="danger" />
          <Stat label="Rate Limited" value={report.summary.rateLimited} tone="danger" />
          <Stat label="Read Actions" value={report.summary.readOnlyActionsAllowed} tone="good" />
          <Stat label="Forbidden" value={report.summary.forbiddenActions} tone="danger" />
        </div>
      </section>

      {verification ? (
        <section className="rounded-lg border border-border bg-surface p-4">
          <div className="flex min-w-0 flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0">
              <p className="break-words text-sm font-semibold uppercase text-muted">Credential & Scope Verification</p>
              <h2 className="break-words text-xl font-semibold text-primary">Local-only readiness checklist</h2>
              <p className="mt-1 max-w-4xl break-words text-xs leading-5 text-muted">
                Sanitized environment and scope evidence only. No OAuth flow, provider check, credential change, or secret value is shown.
              </p>
            </div>
            <div className="flex max-w-full flex-wrap gap-2">
              <Badge tone="good">{verification.mode}</Badge>
              <Badge>oauthStarted:{String(verification.safety.oauthStarted)}</Badge>
              <Badge tone="danger">rawSecrets:{String(verification.safety.rawSecretValuesExposed)}</Badge>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-4 xl:grid-cols-7">
            <Stat label="Credential OK" value={verification.summary.configuredCredentialChecks} tone="good" />
            <Stat label="Missing" value={verification.summary.missingCredentialChecks} tone="danger" />
            <Stat label="Placeholder" value={verification.summary.placeholderCredentialChecks} tone="danger" />
            <Stat label="Malformed" value={verification.summary.malformedCredentialChecks} tone="danger" />
            <Stat label="Scope OK" value={verification.summary.validScopeChecks} tone="good" />
            <Stat label="Scope Missing" value={verification.summary.missingScopeChecks} tone="danger" />
            <Stat label="Scope Unknown" value={verification.summary.unknownScopeChecks} tone="warn" />
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            {verification.checklist.map((item) => (
              <div key={item.connectorId} className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <h3 className="break-words text-base font-semibold text-primary">{item.connector}</h3>
                    <p className="mt-1 break-words text-xs leading-5 text-muted">{item.nextSafeAction}</p>
                  </div>
                  <Badge tone={healthTone(item.readinessStatus)}>{item.readinessStatus}</Badge>
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-bold uppercase text-muted">Credential checks</p>
                    <div className="mt-2 grid gap-2">
                      {item.credentialChecks.map((check) => (
                        <div key={check.key} className="rounded-md border border-slate-100 bg-slate-50 p-2">
                          <div className="flex items-start justify-between gap-2">
                            <p className="break-words text-xs font-semibold text-primary">{check.key}</p>
                            <Badge tone={credentialTone(check.classification)}>{check.classification}</Badge>
                          </div>
                          <p className="mt-1 break-words text-[11px] leading-4 text-muted">{check.safeLabel}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-muted">Scope checks</p>
                    <div className="mt-2 grid gap-2">
                      {item.scopeChecks.map((check) => (
                        <div key={check.scope} className="rounded-md border border-slate-100 bg-slate-50 p-2">
                          <div className="flex items-start justify-between gap-2">
                            <p className="break-all text-xs font-semibold text-primary">{check.scope}</p>
                            <Badge tone={scopeTone(check.status)}>{check.status}</Badge>
                          </div>
                          <p className="mt-1 break-words text-[11px] leading-4 text-muted">{check.evidenceSource}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border border-border bg-surface p-4">
          <h2 className="break-words text-xl font-semibold text-primary">Connector Gate Records</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase text-muted">
                  <th className="py-2 pr-4">Connector</th>
                  <th className="py-2 pr-4">Health</th>
                  <th className="py-2 pr-4">Credentials</th>
                  <th className="py-2 pr-4">Scope</th>
                  <th className="py-2 pr-4">Read</th>
                  <th className="py-2 pr-4">Blocked</th>
                  <th className="py-2 pr-4">Employees</th>
                </tr>
              </thead>
              <tbody>
                {report.records.map((record) => (
                  <tr key={record.connectorId} className="border-b border-slate-100">
                    <td className="py-3 pr-4 font-semibold text-primary">{record.connector}</td>
                    <td className="py-3 pr-4"><Badge tone={healthTone(record.healthStatus)}>{record.healthStatus}</Badge></td>
                    <td className="py-3 pr-4 text-muted">{record.credentialStatus}</td>
                    <td className="py-3 pr-4 text-muted">{record.scopeStatus}</td>
                    <td className="py-3 pr-4 text-muted">{record.allowedActions.length}</td>
                    <td className="py-3 pr-4 text-muted">{record.forbiddenActions.length}</td>
                    <td className="py-3 pr-4 text-muted">{record.affectedEmployees.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-4">
          <h2 className="break-words text-xl font-semibold text-primary">Certification Impact</h2>
          <div className="mt-3 grid gap-3">
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="text-xs font-bold uppercase text-muted">Level 2 candidates</p>
              <p className="mt-2 text-3xl font-semibold text-primary">{report.employeeCertificationImpact.level2UnlockedEmployees.length}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="text-xs font-bold uppercase text-muted">Level 3 candidates</p>
              <p className="mt-2 text-3xl font-semibold text-primary">{report.employeeCertificationImpact.level3CandidateEmployees.length}</p>
            </div>
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-xs font-bold uppercase text-red-900">Level 4/5 blocked</p>
              <p className="mt-2 text-3xl font-semibold text-red-700">{report.employeeCertificationImpact.level4BlockedEmployees.length}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-surface p-4">
        <h2 className="break-words text-xl font-semibold text-primary">Highest Impact Next Safe Actions</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {report.highestImpactNext.map((record) => (
            <div key={record.connectorId} className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="flex items-start justify-between gap-3">
                <p className="break-words text-sm font-semibold text-primary">{record.connector}</p>
                <Badge tone={record.revenueImpact === "high" ? "good" : "warn"}>{record.revenueImpact}</Badge>
              </div>
              <p className="mt-2 break-words text-xs leading-5 text-muted">{record.nextSafeAction}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {report.records.map((record) => (
          <div key={record.connectorId} className="rounded-lg border border-border bg-surface p-4">
            <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0">
                <h2 className="break-words text-xl font-semibold text-primary">{record.connector}</h2>
                <p className="mt-1 break-words text-xs leading-5 text-muted">{record.certificationImpact.explanation}</p>
              </div>
              <Badge tone={healthTone(record.healthStatus)}>{record.mode}</Badge>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase text-muted">Allowed read-only</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {record.allowedActions.length > 0 ? record.allowedActions.map((action) => <Badge key={action} tone="good">{action}</Badge>) : <Badge>none</Badge>}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-muted">Forbidden</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {record.forbiddenActions.slice(0, 6).map((action) => <Badge key={action} tone="danger">{action}</Badge>)}
                </div>
              </div>
            </div>
            <p className="mt-3 break-words text-xs leading-5 text-muted">
              Departments: {record.affectedDepartments.join(", ") || "none mapped yet"}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
