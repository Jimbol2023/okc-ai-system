import {
  getProductionReadinessScore,
  getProductionReadinessStatus,
  productionHardeningChecklist
} from "@/lib/production-readiness";
import { WorkflowOrchestrationReadinessPanel } from "@/components/dashboard/workflow-orchestration-readiness-panel";
import { createArchitectureImprovementBacklog } from "@/lib/executive-dashboard";
import { getInfrastructureHealth } from "@/lib/infrastructure-health";

export default async function DashboardProductionReadinessPage() {
  const readinessStatus = getProductionReadinessStatus();
  const readinessScore = getProductionReadinessScore();
  const architectureBacklog = createArchitectureImprovementBacklog();
  const infrastructureHealth = await getInfrastructureHealth({
    includeDatabase: true,
    includeOAuth: true,
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-primary">Runtime Operations</h1>
        <p className="max-w-3xl text-sm leading-6 text-muted md:text-base">
          Admin-only infrastructure health for environment, OAuth, connectors, database, safety gates, audit posture, and deployment readiness.
        </p>
      </div>

      <section className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-[0_18px_40px_rgba(17,37,52,0.05)] md:p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <SummaryCard label="Infrastructure Status" value={infrastructureHealth.status} />
          <SummaryCard label="Runtime Environment" value={infrastructureHealth.environment} />
          <SummaryCard label="Database" value={infrastructureHealth.database.status} />
        </div>

        <div className="mt-5 rounded-2xl border border-border bg-white px-4 py-4">
          <p className="text-sm font-semibold text-primary">Runtime Assessment</p>
          <p className="mt-2 text-sm leading-6 text-[#40576b]">
            Health checks are redacted. The dashboard never exposes environment values, OAuth tokens, provider response bodies, or secret material.
          </p>
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-[0_18px_40px_rgba(17,37,52,0.05)] md:p-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Deployment Gate</p>
          <h2 className="text-xl font-semibold text-primary">Blockers And Warnings</h2>
          <p className="max-w-4xl text-sm leading-6 text-[#40576b]">
            Production builds fail only on platform-critical or safety blockers. Department connector gaps remain visible without blocking unrelated company deployment.
          </p>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <StatusList title="Deployment Blockers" items={infrastructureHealth.blockers} emptyText="No company-wide deployment blockers detected." tone="high" />
          <StatusList title="Department / Connector Blockers" items={infrastructureHealth.warnings} emptyText="No department connector blockers detected." tone="medium" />
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-[0_18px_40px_rgba(17,37,52,0.05)] md:p-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Operator Actions</p>
          <h2 className="text-xl font-semibold text-primary">Next Required Moves</h2>
        </div>
        <div className="mt-5 rounded-2xl border border-border bg-white px-4 py-4">
          <ul className="space-y-2">
            {infrastructureHealth.operatorActions.map((action) => (
              <li key={action} className="break-words text-sm leading-6 text-[#40576b]">
                {action}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-[0_18px_40px_rgba(17,37,52,0.05)] md:p-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Environment</p>
          <h2 className="text-xl font-semibold text-primary">Runtime Variables</h2>
          <p className="max-w-4xl text-sm leading-6 text-[#40576b]">
            Only presence, status, and length are shown. Values are never rendered.
          </p>
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {infrastructureHealth.env.items.map((item) => (
            <article key={item.key} className="rounded-2xl border border-border bg-white px-4 py-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="break-words text-sm font-semibold text-primary">{item.key}</h3>
                  <p className="mt-1 text-xs leading-5 text-muted">{item.message}</p>
                </div>
                <Badge tone={item.status === "present" ? "low" : item.level === "critical" ? "high" : "medium"}>{item.status}</Badge>
              </div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                present:{String(item.present)} length:{item.length} level:{item.level}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-[0_18px_40px_rgba(17,37,52,0.05)] md:p-6">
        <div className="grid gap-4 lg:grid-cols-3">
          <article className="rounded-2xl border border-border bg-white px-4 py-4">
            <p className="text-sm font-semibold text-primary">Google OAuth</p>
            <p className="mt-2 text-sm leading-6 text-[#40576b]">
              attempted:{String(infrastructureHealth.oauth.google.attempted)} ok:{String(infrastructureHealth.oauth.google.ok)} status:{infrastructureHealth.oauth.google.status ?? "n/a"}
            </p>
            {infrastructureHealth.oauth.google.errorType ? <p className="mt-2 text-xs font-semibold text-[#9f3a22]">{infrastructureHealth.oauth.google.errorType}</p> : null}
          </article>
          <article className="rounded-2xl border border-border bg-white px-4 py-4">
            <p className="text-sm font-semibold text-primary">Safety Gates</p>
            <p className="mt-2 text-sm leading-6 text-[#40576b]">
              execution:{String(infrastructureHealth.safetyGates.approvedExecutionEnabled)} smoke:{String(infrastructureHealth.safetyGates.approvedExecutionProductionSmokePassed)}
            </p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">liveExecution:{String(infrastructureHealth.liveExecutionAllowed)}</p>
          </article>
          <article className="rounded-2xl border border-border bg-white px-4 py-4">
            <p className="text-sm font-semibold text-primary">Build And Deployment</p>
            <p className="mt-2 break-words text-sm leading-6 text-[#40576b]">
              ref:{infrastructureHealth.build.commitRef ?? "n/a"} region:{infrastructureHealth.build.vercelRegion ?? "n/a"}
            </p>
            <p className="mt-2 break-words text-xs leading-5 text-muted">url:{infrastructureHealth.deployment.url ?? "local"}</p>
          </article>
          <article className="rounded-2xl border border-border bg-white px-4 py-4">
            <p className="text-sm font-semibold text-primary">Audit And Logs</p>
            <p className="mt-2 text-sm leading-6 text-[#40576b]">
              status:{infrastructureHealth.auditTrail.status} checked:{String(infrastructureHealth.auditTrail.checked)}
            </p>
            <p className="mt-2 text-xs leading-5 text-muted">{infrastructureHealth.auditTrail.message}</p>
          </article>
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-[0_18px_40px_rgba(17,37,52,0.05)] md:p-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Connectors</p>
          <h2 className="text-xl font-semibold text-primary">Readiness By Dependency</h2>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {infrastructureHealth.connectors.map((connector) => (
            <article key={connector.connectorId} className="rounded-2xl border border-border bg-white px-4 py-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-base font-semibold text-primary">{connector.label}</h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted">{connector.connectorId}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge tone={connector.status === "ready" ? "low" : "medium"}>{connector.status}</Badge>
                  {connector.departmentEnablement === "blocked" ? <Badge tone="medium">Connector Needed</Badge> : null}
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#40576b]">
                scope:{connector.deploymentScope} enablement:{connector.departmentEnablement} oauthReady:{String(connector.oauthReady)} providerCalled:{String(connector.providerCalled)} liveExecution:{String(connector.liveExecutionAllowed)}
              </p>
              <p className="mt-2 break-words text-xs leading-5 text-muted">
                affected:{connector.affectedDepartments.join(", ")} internalFallback:{String(connector.safeInternalFallbackAvailable)}
              </p>
              <p className="mt-2 break-words text-xs leading-5 text-muted">
                missing:{connector.missingEnvKeys.length > 0 ? connector.missingEnvKeys.join(", ") : "none"}
              </p>
            </article>
          ))}
        </div>
      </section>

      <WorkflowOrchestrationReadinessPanel />

      <section className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-[0_18px_40px_rgba(17,37,52,0.05)] md:p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <SummaryCard label="Legacy Status" value={readinessStatus} />
          <SummaryCard label="Hardening Items" value={String(productionHardeningChecklist.length)} />
          <SummaryCard label="Hardening Score" value={`${readinessScore}%`} />
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-[0_18px_40px_rgba(17,37,52,0.05)] md:p-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Executive Architecture Backlog</p>
          <h2 className="text-xl font-semibold text-primary">CEO Approval Priorities</h2>
          <p className="max-w-4xl text-sm leading-6 text-[#40576b]">
            These improvements are advisory and approval-gated. They do not activate providers, connectors, outreach, scraping, publishing, or live workflows.
          </p>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {architectureBacklog.map((item) => (
            <article key={item.id} className="rounded-2xl border border-border bg-white px-4 py-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-primary">{item.title}</h3>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{item.ownerDepartment}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge tone={item.risk}>{item.risk}</Badge>
                  <span className="inline-flex rounded-full bg-[#e7eef5] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#355066]">
                    {item.readinessState.replaceAll("_", " ")}
                  </span>
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#40576b]">{item.businessValue}</p>
              <p className="mt-3 text-sm font-semibold leading-6 text-primary">Next safe action: {item.nextSafeAction}</p>
              <p className="mt-3 text-xs leading-5 text-muted">
                Source basis: {item.sourceBasis.map((source) => `${source.category}: ${source.label}`).join("; ")}
              </p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                approval:{String(item.ceoApprovalRequired)} providerCalled:{String(item.providerCalled)} liveExecution:{String(item.liveExecutionAllowed)}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        {productionHardeningChecklist.map((item) => (
          <article
            key={item.title}
            className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-[0_18px_40px_rgba(17,37,52,0.05)] md:p-6"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-primary">{item.title}</h2>
                <div className="flex flex-wrap gap-2">
                  <Badge tone={item.priority}>{item.priority}</Badge>
                  <Badge tone={item.status}>{item.status}</Badge>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-border bg-white px-4 py-4">
              <p className="text-sm font-semibold text-primary">Recommended Action</p>
              <p className="mt-2 text-sm leading-6 text-[#40576b]">{item.recommendedAction}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-white px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-2 text-lg font-semibold text-primary">{value}</p>
    </div>
  );
}

function StatusList({
  title,
  items,
  emptyText,
  tone,
}: {
  title: string;
  items: string[];
  emptyText: string;
  tone: "high" | "medium";
}) {
  return (
    <article className="rounded-2xl border border-border bg-white px-4 py-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-primary">{title}</h3>
        <Badge tone={items.length > 0 ? tone : "low"}>{String(items.length)}</Badge>
      </div>
      <ul className="mt-3 space-y-2">
        {(items.length > 0 ? items : [emptyText]).map((item) => (
          <li key={item} className="break-words text-sm leading-6 text-[#40576b]">
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

function Badge({
  children,
  tone
}: {
  children: string;
  tone: "high" | "medium" | "low" | "not started" | "in progress" | "planned";
}) {
  const className =
    tone === "high"
      ? "bg-[#f7ddd7] text-[#9f3a22]"
      : tone === "medium"
        ? "bg-[#f6e8cc] text-[#9a6a1a]"
        : tone === "low"
          ? "bg-[#e7eef5] text-[#355066]"
          : tone === "in progress"
            ? "bg-[#dcefe3] text-[#2d6a4f]"
            : tone === "planned"
              ? "bg-[#e7eef5] text-[#355066]"
              : "bg-[#f7ddd7] text-[#9f3a22]";

  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${className}`}>{children}</span>;
}
