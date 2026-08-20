import Link from "next/link";

import { DashboardCard, SafetyBadge, StatusBadge } from "@/components/dashboard/dashboard-ui";
import { RevenueOutcomeRecorder } from "@/components/dashboard/revenue-outcome-recorder";
import { listDbLeads } from "@/lib/leads-db";
import { createRevenueAttributionLedgerReportFromDb, type RevenueAttributionLedgerReport } from "@/lib/revenue-attribution-ledger";
import { createRevenueCommandCenter, ensureConnectorDefinitions, type RevenueCommandCenterReport } from "@/lib/revenue-spine";
import { createTodaysRevenueWork } from "@/lib/todays-revenue-work";

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

function formatMoney(cents: number | null | undefined) {
  if (cents === null || cents === undefined) return "Insufficient";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function formatRatio(value: number | null | undefined) {
  if (value === null || value === undefined) return "Insufficient";

  return `${Math.round(value * 100)}%`;
}

export default async function RevenueCommandCenterPage() {
  await ensureConnectorDefinitions();
  const leads = await listDbLeads();
  const report: RevenueCommandCenterReport = await createRevenueCommandCenter(leads);
  const ledger: RevenueAttributionLedgerReport = await createRevenueAttributionLedgerReportFromDb({
    tenantId: process.env.PUBLIC_TENANT_ID?.trim() || "default",
    window: "all_time",
  });
  const todaysRevenueWork = createTodaysRevenueWork({ leads, ledger });
  const topLedgerRows = ledger.rows.slice(0, 6);
  const leadOptions = leads.slice(0, 100).map((lead) => ({
    id: lead.id,
    label: `${lead.firstName} ${lead.lastName}`.trim() || lead.propertyAddress || "Unnamed lead",
    propertyAddress: lead.propertyAddress,
    source: lead.source,
    referralCode: lead.referralCode,
    referralCampaign: lead.referralCampaign,
    referralLandingPage: lead.referralLandingPage,
  }));

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

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Connector Health</p>
          <p className="mt-2 text-2xl font-bold text-primary">{report.connectorHealth.approvalRequired}</p>
          <p className="mt-1 text-xs text-muted">Need approval before provider calls.</p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">AI Feedback</p>
          <p className="mt-2 text-2xl font-bold text-primary">{report.decisionFeedback.pending}</p>
          <p className="mt-1 text-xs text-muted">Pending recommendation decisions.</p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Execution Boundary</p>
          <p className="mt-2 text-2xl font-bold text-primary">{report.agentGovernance.advisoryOnly ? "On" : "Review"}</p>
          <p className="mt-1 text-xs text-muted">AI remains advisory-only.</p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Automation</p>
          <p className="mt-2 text-2xl font-bold text-primary">{report.agentGovernance.browserAutomationEnabled ? "On" : "Off"}</p>
          <p className="mt-1 text-xs text-muted">Browser automation disabled by default.</p>
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
          <div className="mt-4 space-y-2">
            {report.executiveBriefing.risks.map((risk) => (
              <div key={risk} className="rounded border border-border bg-white p-3 text-sm leading-6 text-muted">
                {risk}
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

      <section className="grid gap-4 xl:grid-cols-[1fr_1.1fr]">
        <DashboardCard>
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Revenue Attribution</p>
              <h2 className="mt-2 text-lg font-bold text-primary">Lead ROI Ledger</h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Read-only source and campaign ROI from verified spend, appointment, contract, closing, and realized revenue outcomes.
              </p>
            </div>
            <SafetyBadge tone="good">read-only</SafetyBadge>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded border border-border bg-white p-3">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Top Revenue Source</p>
              <p className="mt-2 text-lg font-bold text-primary">{ledger.summary.topRevenueSource ?? "Insufficient data"}</p>
            </div>
            <div className="rounded border border-border bg-white p-3">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Best ROI Source</p>
              <p className="mt-2 text-lg font-bold text-primary">{ledger.summary.bestRoiSource ?? "Insufficient data"}</p>
            </div>
            <div className="rounded border border-border bg-white p-3">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Lowest Cost / Contract</p>
              <p className="mt-2 text-lg font-bold text-primary">{ledger.summary.lowestCostPerContractSource ?? "Insufficient data"}</p>
            </div>
            <div className="rounded border border-border bg-white p-3">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Highest Close Rate</p>
              <p className="mt-2 text-lg font-bold text-primary">{ledger.summary.highestCloseRateSource ?? "Insufficient data"}</p>
            </div>
          </div>
          <div className="mt-4 rounded border border-border bg-white p-3">
            <p className="text-sm font-bold text-primary">Current Baseline</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              {ledger.summary.baselineState === "REAL_OUTCOME_DATA_AVAILABLE"
                ? `${ledger.summary.totalClosedDeals} closed deal(s), ${formatMoney(ledger.summary.totalNetRevenueCents)} net revenue, ${formatMoney(ledger.summary.totalSpendCents)} verified spend.`
                : "INSUFFICIENT_REAL_OUTCOME_DATA. The ledger is ready for the first verified real outcome without manufacturing ROI."}
            </p>
          </div>
        </DashboardCard>

        <DashboardCard>
          <h2 className="text-lg font-bold text-primary">Source ROI Rows</h2>
          <div className="mt-4 space-y-3">
            {topLedgerRows.map((row) => (
              <div key={`${row.source}:${row.campaign ?? "none"}`} className="rounded border border-border bg-white p-3">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <p className="break-words text-sm font-bold text-primary">{row.source}</p>
                    <p className="mt-1 text-xs text-muted">Campaign: {row.campaign ?? "none"}</p>
                  </div>
                  <SafetyBadge tone={row.dataQuality === "VERIFIED" ? "good" : "watch"}>{row.dataQuality}</SafetyBadge>
                </div>
                <div className="mt-3 grid gap-2 text-xs text-muted sm:grid-cols-3">
                  <p>Spend: {formatMoney(row.spendCents)}</p>
                  <p>Contracts: {row.contractCount}</p>
                  <p>Closed: {row.closedDealCount}</p>
                  <p>Gross: {formatMoney(row.grossRevenueCents)}</p>
                  <p>Net: {formatMoney(row.netRevenueCents)}</p>
                  <p>ROI: {formatRatio(row.roi)}</p>
                </div>
                <p className="mt-2 text-xs text-muted">
                  Sample size {row.sampleSize}; cost per contract {formatMoney(row.costPerContractCents)}; last outcome {row.lastOutcomeDate ? formatDate(row.lastOutcomeDate) : "not recorded"}.
                </p>
              </div>
            ))}
            {topLedgerRows.length === 0 ? <p className="text-sm text-muted">No verified revenue attribution rows yet.</p> : null}
          </div>
        </DashboardCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <DashboardCard>
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Internal Recording</p>
              <h2 className="mt-2 text-lg font-bold text-primary">Record Business Outcome</h2>
              <p className="mt-2 text-sm leading-6 text-muted">Authenticated manual outcome capture for source spend, lead, appointment, contract, and verified closed revenue records.</p>
            </div>
            <SafetyBadge tone="watch">admin write</SafetyBadge>
          </div>
          <div className="mt-4">
            <RevenueOutcomeRecorder leads={leadOptions} />
          </div>
        </DashboardCard>

        <DashboardCard>
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Today&apos;s Revenue Work</p>
              <h2 className="mt-2 text-lg font-bold text-primary">Read-Only Operating Queue</h2>
              <p className="mt-2 text-sm leading-6 text-muted">Highest-priority human review work from lead age, follow-up timing, missing evidence, and source spend gaps.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={todaysRevenueWork.summary.urgent > 0 ? "urgent" : "good"} label={`${todaysRevenueWork.summary.urgent} urgent`} />
              <SafetyBadge tone="good">no outreach</SafetyBadge>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {todaysRevenueWork.items.map((item) => (
              <div key={item.id} className="rounded border border-border bg-white p-3">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <p className="break-words text-sm font-bold text-primary">{item.label}</p>
                    <p className="mt-1 text-xs text-muted">{item.category.replaceAll("_", " ")}</p>
                  </div>
                  <StatusBadge status={item.priority} label={item.priority} />
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">{item.detail}</p>
              </div>
            ))}
            {todaysRevenueWork.items.length === 0 ? <p className="text-sm text-muted">No urgent revenue work is currently queued.</p> : null}
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

      <section className="grid gap-4 xl:grid-cols-2">
        <DashboardCard>
          <h2 className="text-lg font-bold text-primary">AI Decision Feedback</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded border border-border bg-white p-3">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Total</p>
              <p className="mt-2 text-xl font-bold text-primary">{report.decisionFeedback.total}</p>
            </div>
            <div className="rounded border border-border bg-white p-3">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Accepted / Modified</p>
              <p className="mt-2 text-xl font-bold text-primary">
                {report.decisionFeedback.accepted} / {report.decisionFeedback.modified}
              </p>
            </div>
            <div className="rounded border border-border bg-white p-3">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Ignored</p>
              <p className="mt-2 text-xl font-bold text-primary">{report.decisionFeedback.ignored}</p>
            </div>
            <div className="rounded border border-border bg-white p-3">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Unknown Outcome</p>
              <p className="mt-2 text-xl font-bold text-primary">{report.decisionFeedback.unknownOutcome}</p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {report.decisionLogs.slice(0, 5).map((decision) => (
              <div key={decision.id} className="rounded border border-border bg-white p-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-bold text-primary">{decision.recommendationType}</p>
                  <SafetyBadge tone={decision.providerCalled || decision.outreachSent ? "watch" : "good"}>{decision.userDecision}</SafetyBadge>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">{decision.recommendation}</p>
                <p className="mt-2 text-xs font-semibold text-muted">Confidence: {decision.confidence}/100</p>
              </div>
            ))}
            {report.decisionLogs.length === 0 ? <p className="text-sm text-muted">No AI decision feedback yet.</p> : null}
          </div>
        </DashboardCard>

        <DashboardCard>
          <h2 className="text-lg font-bold text-primary">Layered Agent Governance</h2>
          <div className="mt-4 space-y-3">
            <div className="rounded border border-border bg-white p-3">
              <p className="text-sm font-bold text-primary">Approved acquisition paths</p>
              <p className="mt-2 text-sm leading-6 text-muted">{report.agentGovernance.supportedDataSources.join(", ")}</p>
            </div>
            <div className="rounded border border-border bg-white p-3">
              <p className="text-sm font-bold text-primary">Disabled by default</p>
              <p className="mt-2 text-sm leading-6 text-muted">{report.agentGovernance.disabledByDefaultSources.join(", ")}</p>
            </div>
            <div className="rounded border border-border bg-white p-3">
              <p className="text-sm font-bold text-primary">AI agent roles</p>
              <p className="mt-2 text-sm leading-6 text-muted">{report.agentGovernance.aiAgentRoles.join(", ")}</p>
            </div>
          </div>
        </DashboardCard>
      </section>
    </main>
  );
}
