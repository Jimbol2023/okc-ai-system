import Link from "next/link";

import { DashboardCard, SafetyBadge, StatusBadge } from "@/components/dashboard/dashboard-ui";
import { listDbLeads } from "@/lib/leads-db";
import { createRevenueCommandCenter, ensureConnectorDefinitions, type RevenueCommandCenterReport } from "@/lib/revenue-spine";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function formatDate(value: Date | string | null | undefined) {
  if (!value) return "Not scheduled";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not scheduled";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function getStatus(score: number) {
  if (score >= 72) return "good";
  if (score >= 50) return "watch";

  return "missing";
}

export default async function RevenueCommandCenterPage() {
  await ensureConnectorDefinitions();
  const report: RevenueCommandCenterReport = await createRevenueCommandCenter(await listDbLeads());

  return (
    <main className="space-y-6">
      <section className="rounded-lg border border-border bg-surface p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Revenue execution spine</p>
            <h1 className="mt-2 text-2xl font-bold text-primary">Revenue Command Center</h1>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-muted">
              Unified acquisition visibility from lead source to dedupe warnings, advisory scoring, follow-up tasks, pipeline movement, analytics, and audit events.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <SafetyBadge tone="good">providerCalled:false</SafetyBadge>
            <SafetyBadge tone="good">outreachSent:false</SafetyBadge>
            <SafetyBadge tone="watch">manual approval required</SafetyBadge>
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        <DashboardCard>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Leads</p>
          <p className="mt-2 text-2xl font-bold text-primary">{report.summary.totalLeads}</p>
          <p className="mt-1 text-xs text-muted">All sources in unified queue.</p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Qualified</p>
          <p className="mt-2 text-2xl font-bold text-primary">{report.summary.qualifiedLeads}</p>
          <p className="mt-1 text-xs text-muted">Score or priority signal.</p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Open Tasks</p>
          <p className="mt-2 text-2xl font-bold text-primary">{report.summary.openTasks}</p>
          <p className="mt-1 text-xs text-muted">Manual revenue actions.</p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Follow-Up Due</p>
          <p className="mt-2 text-2xl font-bold text-primary">{report.summary.followUpDue}</p>
          <p className="mt-1 text-xs text-muted">Attention required.</p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Duplicates</p>
          <p className="mt-2 text-2xl font-bold text-primary">{report.summary.duplicateWarnings}</p>
          <p className="mt-1 text-xs text-muted">Warnings, not silent merges.</p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Data Gaps</p>
          <p className="mt-2 text-2xl font-bold text-primary">{report.summary.missingDataRecords}</p>
          <p className="mt-1 text-xs text-muted">Missing fields limit confidence.</p>
        </DashboardCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <DashboardCard>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-primary">{report.executiveBriefing.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{report.executiveBriefing.summary}</p>
            </div>
            <StatusBadge status={report.summary.followUpDue > 0 ? "watch" : "good"} />
          </div>
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {report.executiveBriefing.recommendedActions.map((action) => (
              <div key={action} className="rounded border border-border bg-white p-3 text-sm font-semibold leading-6 text-primary">
                {action}
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard>
          <h2 className="text-lg font-bold text-primary">Source Performance</h2>
          <div className="mt-4 space-y-3">
            {report.sourcePerformance.slice(0, 6).map((source) => (
              <div key={source.source} className="rounded border border-border bg-white p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="min-w-0 break-words text-sm font-bold text-primary">{source.source}</p>
                  <StatusBadge status={getStatus(source.avgScore)} label={`${source.avgScore}/100`} />
                </div>
                <p className="mt-1 text-xs text-muted">
                  {source.leads} leads, {source.qualified} qualified, {source.conversionSignal}% quality signal.
                </p>
              </div>
            ))}
            {report.sourcePerformance.length === 0 ? <p className="text-sm text-muted">No source performance yet.</p> : null}
          </div>
        </DashboardCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <DashboardCard>
          <h2 className="text-lg font-bold text-primary">Unified Lead Inbox</h2>
          <div className="mt-4 space-y-3">
            {report.inbox.slice(0, 10).map((item) => (
              <Link key={item.lead.id} href={`/dashboard/leads/${item.lead.id}`} className="block rounded border border-border bg-white p-3 transition hover:border-accent">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <p className="break-words text-sm font-bold text-primary">
                      {item.lead.firstName} {item.lead.lastName}
                    </p>
                    <p className="mt-1 break-words text-xs text-muted">{item.lead.propertyAddress || "No property address captured"}</p>
                    <p className="mt-2 text-xs font-semibold text-muted">Source: {item.lead.source || "Unknown"}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge status={getStatus(item.latestScore?.score ?? 0)} label={`${item.latestScore?.score ?? 0}/100`} />
                    <SafetyBadge tone={item.duplicateWarnings.length > 0 ? "watch" : "good"}>{item.duplicateWarnings.length} duplicate warnings</SafetyBadge>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-primary">{item.recommendedAction}</p>
                {item.latestScore?.missingData.length ? (
                  <p className="mt-2 text-xs text-muted">Missing: {item.latestScore.missingData.join(", ")}</p>
                ) : null}
              </Link>
            ))}
            {report.inbox.length === 0 ? <p className="text-sm text-muted">No leads in the unified inbox yet.</p> : null}
          </div>
        </DashboardCard>

        <DashboardCard>
          <h2 className="text-lg font-bold text-primary">Manual Follow-Up Tasks</h2>
          <div className="mt-4 space-y-3">
            {report.tasks.slice(0, 8).map((task) => (
              <div key={task.id} className="rounded border border-border bg-white p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-bold text-primary">{task.title}</p>
                  <StatusBadge status={task.priority === "High" ? "urgent" : task.priority === "Medium" ? "watch" : "missing"} label={task.priority} />
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">{task.recommendedAction}</p>
                <p className="mt-2 text-xs font-semibold text-muted">Due: {formatDate(task.dueAt)}</p>
              </div>
            ))}
            {report.tasks.length === 0 ? <p className="text-sm text-muted">No open revenue tasks yet.</p> : null}
          </div>
        </DashboardCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <DashboardCard>
          <h2 className="text-lg font-bold text-primary">Connector Safety Registry</h2>
          <div className="mt-4 space-y-3">
            {report.connectors.map((connector) => (
              <div key={connector.id} className="rounded border border-border bg-white p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-primary">{connector.label}</p>
                  <SafetyBadge tone={connector.status === "active" ? "good" : "watch"}>{connector.status}</SafetyBadge>
                </div>
                <p className="mt-1 text-xs text-muted">
                  {connector.category}; providerCallsAllowed:{String(connector.providerCallsAllowed)}
                </p>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard>
          <h2 className="text-lg font-bold text-primary">Recent Revenue Audit</h2>
          <div className="mt-4 space-y-3">
            {report.auditEvents.map((event) => (
              <div key={event.id} className="rounded border border-border bg-white p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-primary">{event.action}</p>
                  <SafetyBadge tone={event.result === "success" ? "good" : "watch"}>{event.result}</SafetyBadge>
                </div>
                <p className="mt-1 text-xs text-muted">
                  {event.targetType} {event.targetId ? `- ${event.targetId}` : ""} from {event.source}
                </p>
                <p className="mt-1 text-xs text-muted">{formatDate(event.createdAt)}</p>
              </div>
            ))}
            {report.auditEvents.length === 0 ? <p className="text-sm text-muted">No revenue audit events yet.</p> : null}
          </div>
        </DashboardCard>
      </section>
    </main>
  );
}
