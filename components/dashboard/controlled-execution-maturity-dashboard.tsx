import type { ControlledExecutionMaturityReport } from "@/lib/controlled-execution-maturity";

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

function Stat({ label, value, tone = "neutral" }: { label: string; value: string | number; tone?: "neutral" | "good" | "warn" | "danger" }) {
  return (
    <div className="rounded-lg border border-border bg-white p-4">
      <p className="text-xs font-bold uppercase text-muted">{label}</p>
      <p className={`mt-2 break-words text-3xl font-semibold ${tone === "danger" ? "text-red-900" : tone === "warn" ? "text-amber-950" : "text-primary"}`}>{value}</p>
    </div>
  );
}

function Rows({
  title,
  rows,
  empty,
}: {
  title: string;
  rows: Array<{ id: string; title: string; actionType: string; sourceLabel: string; status?: string; blockedReason?: string | null; externalReference?: string | null }>;
  empty: string;
}) {
  return (
    <section className="rounded-lg border border-border bg-surface p-4">
      <h2 className="break-words text-xl font-semibold text-primary">{title}</h2>
      <div className="mt-3 space-y-3">
        {rows.length === 0 ? (
          <p className="break-words text-sm leading-6 text-muted">{empty}</p>
        ) : (
          rows.map((row) => (
            <article key={row.id} className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="flex min-w-0 flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <p className="break-words text-sm font-semibold text-primary">{row.title}</p>
                  <p className="mt-1 break-words text-xs leading-5 text-muted">{row.sourceLabel}</p>
                  {row.blockedReason ? <p className="mt-1 break-words text-xs leading-5 text-red-900">{row.blockedReason}</p> : null}
                  {row.externalReference ? <p className="mt-1 break-words text-xs leading-5 text-muted">Result: {row.externalReference}</p> : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge tone="good">{row.actionType}</Badge>
                  {row.status ? <Badge>{row.status}</Badge> : null}
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

function boolTone(value: boolean) {
  return value ? "good" : "danger";
}

export function ControlledExecutionMaturityDashboard({ report }: { report: ControlledExecutionMaturityReport }) {
  const drivePacket = report.driveDraftPilotReadiness;
  const providerPreview = report.providerExecutionFramework.driveDraftPreview;
  const governedPreviews = report.providerExecutionFramework.governedDraftPreviews;

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-surface p-5 md:p-6">
        <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 space-y-2">
            <p className="break-words text-sm font-semibold uppercase text-muted">Sprint 7 Controlled Execution</p>
            <h1 className="break-words text-3xl font-semibold text-primary">Internal Execution Bridge</h1>
            <p className="max-w-4xl break-words text-sm leading-6 text-muted">
              CEO-approved internal CRM task and note outcomes can be tracked here. External execution remains blocked until a separately approved low-risk pilot.
            </p>
          </div>
          <div className="flex max-w-full flex-wrap gap-2">
            <Badge tone={report.level4InternalExecutionReady ? "good" : "warn"}>internal level 4:{String(report.level4InternalExecutionReady)}</Badge>
            <Badge tone="danger">external level 4:{String(report.level4ExternalExecutionReady)}</Badge>
            <Badge>providerCalled:{String(report.safety.providerCalled)}</Badge>
            <Badge tone="danger">production deploy:{String(report.safety.productionDeployIncluded)}</Badge>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <Stat label="Pending Internal Approvals" value={report.pendingInternalApprovals.length} />
          <Stat label="Executed Outcomes" value={report.executedInternalOutcomes.length} tone="good" />
          <Stat label="Blocked Executions" value={report.blockedExecutions.length} tone={report.blockedExecutions.length ? "warn" : "neutral"} />
          <Stat label="External Gate" value={report.externalReadinessGate.go ? "go" : "blocked"} tone={report.externalReadinessGate.go ? "good" : "danger"} />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Rows title="Pending Internal Approvals" rows={report.pendingInternalApprovals} empty="No internal CRM task or note approvals are pending." />
        <Rows title="Executed Internal Outcomes" rows={report.executedInternalOutcomes} empty="No internal CRM task or note outcomes have executed yet." />
        <Rows title="Blocked Executions" rows={report.blockedExecutions} empty="No blocked internal executions are currently visible." />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border border-border bg-surface p-4">
          <h2 className="break-words text-xl font-semibold text-primary">Draft External Work</h2>
          <p className="mt-2 break-words text-sm leading-6 text-muted">Drafts may be prepared for CEO review, but they cannot send, publish, schedule, post, create provider records, or reply externally.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {report.draftExternalWork.allowedDraftActions.map((action) => <Badge key={action}>{action}</Badge>)}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-4">
          <h2 className="break-words text-xl font-semibold text-primary">External Readiness Gate</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge tone={report.externalReadinessGate.go ? "good" : "danger"}>{report.externalReadinessGate.go ? "go" : "blocked"}</Badge>
            <Badge>pilot:{report.externalReadinessGate.recommendedPilot ?? "none"}</Badge>
          </div>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
            {report.externalReadinessGate.blockedReasons.map((reason) => <li key={reason} className="break-words">{reason}</li>)}
          </ul>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-surface p-4">
        <div className="flex min-w-0 flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <h2 className="break-words text-xl font-semibold text-primary">Google Drive Draft Pilot Readiness</h2>
            <p className="mt-2 max-w-4xl break-words text-sm leading-6 text-muted">
              No Google Drive document will be created in this sprint. Preview-only pilot requires separate approval. Production blocked.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge tone={drivePacket.status === "ready" ? "good" : drivePacket.status === "missing_config" ? "warn" : "danger"}>{drivePacket.status}</Badge>
            <Badge>{drivePacket.connector}</Badge>
            <Badge>{drivePacket.candidateAction}</Badge>
          </div>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <p className="text-xs font-bold uppercase text-muted">Required Config</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {drivePacket.requiredConfigKeys.map((check) => (
                <Badge key={check.key} tone={check.classification === "configured" ? "good" : check.classification === "missing" ? "warn" : "danger"}>
                  {check.key}:{check.classification}
                </Badge>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <p className="text-xs font-bold uppercase text-muted">Required Controls</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge tone={boolTone(drivePacket.pilotFlagConfigured)}>pilot flag</Badge>
              <Badge tone={boolTone(drivePacket.exactActionAllowlisted)}>exact action</Badge>
              <Badge tone={boolTone(drivePacket.testFolderConfigured)}>test folder</Badge>
              <Badge tone={boolTone(drivePacket.rollbackPlanPresent)}>rollback</Badge>
              <Badge tone={boolTone(drivePacket.auditPathConfirmed)}>audit</Badge>
              <Badge tone={boolTone(drivePacket.memoryPathConfirmed)}>memory</Badge>
              <Badge tone={boolTone(drivePacket.killSwitchConfirmed)}>kill switch</Badge>
              <Badge tone={boolTone(drivePacket.ceoApprovalConfirmed)}>CEO approval</Badge>
              <Badge tone={boolTone(drivePacket.previewOnly)}>Preview only</Badge>
              <Badge tone={boolTone(drivePacket.productionBlocked)}>Production blocked</Badge>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <p className="text-xs font-bold uppercase text-muted">Scope Boundary</p>
            <p className="mt-2 break-words text-sm leading-6 text-muted">Current read-only: {drivePacket.requiredScope.currentReadOnlyScope}</p>
            <p className="mt-2 break-words text-sm leading-6 text-muted">Future draft scope: {drivePacket.requiredScope.futureDraftWriteScope}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge tone="danger">scope change:{String(drivePacket.requiredScope.scopeChangeAuthorizedThisSprint)}</Badge>
              <Badge>providerCalled:{String(drivePacket.providerCalled)}</Badge>
              <Badge tone="danger">liveExecution:{String(drivePacket.liveExecutionAllowed)}</Badge>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
            <p className="text-xs font-bold uppercase text-amber-950">Blocked Reasons</p>
            <ul className="mt-2 space-y-2 text-sm leading-6 text-amber-950">
              {drivePacket.blockedReasons.length === 0 ? <li>No readiness blockers in this packet.</li> : drivePacket.blockedReasons.map((reason) => <li key={reason} className="break-words">{reason}</li>)}
            </ul>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <p className="text-xs font-bold uppercase text-muted">Next Safe Action</p>
            <p className="mt-2 break-words text-sm leading-6 text-muted">{drivePacket.nextSafeAction}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge>recommended:{drivePacket.recommendedPilot ?? "none"}</Badge>
              <Badge tone="danger">Production untouched</Badge>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h2 className="break-words text-xl font-semibold text-red-950">Production Hard Block Proof</h2>
          <p className="mt-2 break-words text-sm leading-6 text-red-950">
            Sprint 9 pilot readiness requires Preview only. The executor blocks before provider calls when NODE_ENV or VERCEL_ENV is production.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge tone="danger">NODE_ENV=production blocked</Badge>
            <Badge tone="danger">VERCEL_ENV=production blocked</Badge>
            <Badge tone={boolTone(drivePacket.productionBlocked)}>Production blocked</Badge>
            <Badge>providerCalled:{String(drivePacket.providerCalled)}</Badge>
          </div>
        </div>

        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <h2 className="break-words text-xl font-semibold text-emerald-950">No Provider Execution Evidence</h2>
          <p className="mt-2 break-words text-sm leading-6 text-emerald-950">
            This dashboard renders readiness and redacted dry-run previews only. No Google Workspace API call, OAuth exchange, document creation, Gmail send, Calendar insert, deployment, publish, scrape, ad action, or workflow execution is performed here.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge tone="good">readiness only</Badge>
            <Badge tone="good">redacted preview only</Badge>
            <Badge>providerCalled:{String(providerPreview.safety.providerCalled)}</Badge>
            <Badge tone="danger">wouldCall:{String(providerPreview.safety.wouldCallProvider)}</Badge>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-surface p-4">
        <div className="flex min-w-0 flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <h2 className="break-words text-xl font-semibold text-primary">Provider Execution Framework</h2>
            <p className="mt-2 max-w-4xl break-words text-sm leading-6 text-muted">
              Dry-run provider draft previews only. Sprint 10C normalizes payloads before preview; Sprint 10D integrates governed previews without provider calls, OAuth changes, sends, inserts, uploads, Preview deploy, or Production deploy.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge tone={providerPreview.status === "preview_ready" ? "good" : "danger"}>{providerPreview.status}</Badge>
            <Badge>{providerPreview.mode}</Badge>
            <Badge tone="danger">live write:{String(providerPreview.registryEntry.liveWriteEnabled)}</Badge>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3">
          <div className="flex min-w-0 flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase text-muted">Sprint 10C/10D Governed Preview Integration</p>
              <p className="mt-2 break-words text-sm leading-6 text-muted">
                Normalized draft payloads feed preview-only adapter packets. No provider route, OAuth change, deployment, autonomous execution, or live write is created here.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge>{report.providerExecutionFramework.payloadValidationPolicy.payloadSchemaVersion}</Badge>
              <Badge>{report.providerExecutionFramework.payloadValidationPolicy.previewIntegrationVersion}</Badge>
              <Badge tone={boolTone(report.providerExecutionFramework.payloadValidationPolicy.normalizedPayloadRequired)}>normalized payload required</Badge>
            </div>
          </div>
          <div className="mt-3 grid gap-3 xl:grid-cols-4">
            {governedPreviews.map((item) => (
              <div key={item.actionType ?? item.status} className="rounded-lg border border-slate-200 bg-surface p-3">
                <p className="break-words text-sm font-semibold text-primary">{item.actionType ?? "invalid_action"}</p>
                <p className="mt-1 break-words text-xs leading-5 text-muted">{item.connector ?? "no connector"}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge tone={item.validation.ok ? "good" : "warn"}>{item.validation.status}</Badge>
                  <Badge tone={item.ok ? "good" : "danger"}>{item.status}</Badge>
                  <Badge>providerCalled:{String(item.integration.providerCalled)}</Badge>
                  <Badge tone="danger">autonomous:{String(item.integration.autonomousExecution)}</Badge>
                  <Badge tone="danger">live:{String(item.integration.liveExecutionAllowed)}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <p className="text-xs font-bold uppercase text-muted">Exact Action Registry</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {report.providerExecutionFramework.actions.map((action) => (
                <Badge key={action.actionType} tone={action.liveWriteEnabled ? "danger" : "good"}>
                  {action.actionType}
                </Badge>
              ))}
              {report.providerExecutionFramework.actions.map((action) => <Badge key={`${action.actionType}-connector`}>{action.connector}</Badge>)}
              <Badge>{providerPreview.registryEntry.allowedEnvironment}</Badge>
              <Badge tone={boolTone(providerPreview.registryEntry.productionBlocked)}>Production blocked</Badge>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <p className="text-xs font-bold uppercase text-muted">Redacted Request Preview</p>
            <p className="mt-2 break-words text-sm leading-6 text-muted">Method: {providerPreview.requestPreview.method}</p>
            <p className="break-words text-sm leading-6 text-muted">Operation: {providerPreview.requestPreview.providerOperation}</p>
            <p className="break-words text-sm leading-6 text-muted">Folder: {providerPreview.requestPreview.targetFolder}</p>
            <p className="break-words text-sm leading-6 text-muted">Title: {providerPreview.requestPreview.title}</p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <p className="text-xs font-bold uppercase text-muted">Safety Preflight</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge tone={boolTone(providerPreview.approvalRequired)}>CEO approval</Badge>
              <Badge tone={boolTone(providerPreview.killSwitch.confirmed)}>kill switch</Badge>
              <Badge tone={boolTone(providerPreview.auditPreflight.ready)}>audit</Badge>
              <Badge tone={boolTone(providerPreview.memoryPreflight.ready)}>memory</Badge>
              <Badge>providerCalled:{String(providerPreview.safety.providerCalled)}</Badge>
              <Badge tone="danger">wouldCall:{String(providerPreview.safety.wouldCallProvider)}</Badge>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
            <p className="text-xs font-bold uppercase text-amber-950">Framework Blockers</p>
            <ul className="mt-2 space-y-2 text-sm leading-6 text-amber-950">
              {providerPreview.blockedReasons.length === 0 ? <li>No dry-run preview blockers in this framework report.</li> : providerPreview.blockedReasons.map((reason) => <li key={reason} className="break-words">{reason}</li>)}
            </ul>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <p className="text-xs font-bold uppercase text-muted">Next Safe Action</p>
            <p className="mt-2 break-words text-sm leading-6 text-muted">{providerPreview.nextSafeAction}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge tone="danger">No live write</Badge>
              <Badge tone="danger">No provider call</Badge>
              <Badge tone="danger">Production blocked</Badge>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-surface p-4">
        <div className="flex min-w-0 flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <h2 className="break-words text-xl font-semibold text-primary">Sprint 9 Preview Pilot Endpoint</h2>
            <p className="mt-2 max-w-4xl break-words text-sm leading-6 text-muted">
              The controlled Google Drive test document pilot is available only as an authenticated POST endpoint. This dashboard does not execute it.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge>create_drive_doc_draft</Badge>
            <Badge tone="danger">Preview only</Badge>
            <Badge tone="danger">Production blocked</Badge>
          </div>
        </div>
        <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <p className="text-xs font-bold uppercase text-muted">Endpoint</p>
            <p className="mt-2 break-all text-sm leading-6 text-muted">POST /api/company/provider-pilots/google-drive-draft</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <p className="text-xs font-bold uppercase text-muted">Required Confirmation</p>
            <p className="mt-2 break-words text-sm leading-6 text-muted">CREATE_PREVIEW_DRIVE_DRAFT</p>
          </div>
        </div>
      </section>
    </div>
  );
}
