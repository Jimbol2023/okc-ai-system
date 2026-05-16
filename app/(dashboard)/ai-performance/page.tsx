import type { Route } from "next";
import Link from "next/link";

import AiMemoryPanel from "@/components/dashboard/ai-memory-panel";
import { getAiAlerts } from "@/lib/ai-alerts";
import {
  analyzeOverridePerformance,
  compareBeforeAfterMetrics,
} from "@/lib/ai-impact-analyzer";
import {
  generateAiLearningInsights,
  type AiLearningInsights,
} from "@/lib/ai-learning-engine";
import { getLatestAiPerformanceMetric } from "@/lib/ai-performance";
import {
  calculateAiPerformanceRates,
  type AiPerformanceRate,
} from "@/lib/ai-performance-engine";

function getSeverityStyles(severity: string) {
  switch (severity) {
    case "critical":
      return "bg-purple-100 text-purple-700";
    case "high":
      return "bg-red-100 text-red-700";
    case "medium":
      return "bg-orange-100 text-orange-700";
    case "warning":
      return "bg-yellow-100 text-yellow-700";
    case "info":
      return "bg-slate-200 text-slate-700";
    default:
      return "bg-slate-200 text-slate-700";
  }
}

function getActionLabel(type: string) {
  switch (type) {
    case "stale_new_leads":
      return "View Stale Leads";
    case "overdue_followups":
      return "Fix Follow-Ups";
    case "ai_replies_waiting_approval":
      return "Review AI Replies";
    case "dnc_records_present":
      return "Review DNC Records";
    case "high_idle_automation":
      return "Fix Automation";
    default:
      return "Open Action";
  }
}

function getSafeActionHref(actionUrl: string): Route {
  if (actionUrl.startsWith("/dashboard")) {
    return actionUrl as Route;
  }

  return "/dashboard/leads";
}

function MetricCard({ title, value }: { title: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function RateMetricCard({
  title,
  metric,
}: {
  title: string;
  metric: AiPerformanceRate;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">
        {metric.value}%
      </p>
      <p className="mt-2 text-xs text-slate-500">
        {metric.numerator} of {metric.denominator}
      </p>
    </div>
  );
}

function InsightCard({
  title,
  label,
  summary,
  rate,
}: {
  title: string;
  label: string;
  summary: string;
  rate?: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-2 font-semibold text-slate-950">{label}</p>
        </div>
        {typeof rate === "number" ? (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {rate}%
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-sm text-slate-600">{summary}</p>
    </div>
  );
}

function AiLearningInsightsSection({
  insights,
}: {
  insights: AiLearningInsights;
}) {
  const approvalInsights = insights.approvalBiasInsights.slice(0, 3);
  const messageInsights = insights.messagePerformance.slice(0, 3);

  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold">AI Learning Insights</h2>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <InsightCard
          title="Best Reply Style"
          label={insights.bestPerformingReplyStyle.label}
          summary={insights.bestPerformingReplyStyle.summary}
          rate={insights.bestPerformingReplyStyle.rate}
        />
        <InsightCard
          title="Weak Reply Style"
          label={insights.worstPerformingReplyStyle.label}
          summary={insights.worstPerformingReplyStyle.summary}
          rate={insights.worstPerformingReplyStyle.rate}
        />
        <InsightCard
          title="Follow-Up Timing"
          label={insights.recommendedFollowUpTiming.label}
          summary={insights.recommendedFollowUpTiming.summary}
          rate={insights.recommendedFollowUpTiming.rate}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-slate-950">Approval Patterns</h3>
          {approvalInsights.length > 0 ? (
            <div className="mt-3 space-y-3">
              {approvalInsights.map((insight) => (
                <div key={insight.label} className="text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-slate-800">{insight.label}</p>
                    <span className="text-xs font-semibold text-slate-500">
                      {insight.rate}%
                    </span>
                  </div>
                  <p className="mt-1 text-slate-600">{insight.summary}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-600">
              Not enough approval memory yet.
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-slate-950">Message Performance</h3>
          {messageInsights.length > 0 ? (
            <div className="mt-3 space-y-3">
              {messageInsights.map((insight) => (
                <div key={insight.label} className="text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-slate-800">{insight.label}</p>
                    <span className="text-xs font-semibold text-slate-500">
                      {insight.rate}%
                    </span>
                  </div>
                  <p className="mt-1 text-slate-600">{insight.summary}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-600">
              Not enough sent-message memory yet.
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <InsightCard
          title="High Conversion Profile"
          label={insights.highConversionLeadProfile.label}
          summary={insights.highConversionLeadProfile.summary}
          rate={insights.highConversionLeadProfile.rate}
        />
        <InsightCard
          title="Low Conversion Profile"
          label={insights.lowConversionLeadProfile.label}
          summary={insights.lowConversionLeadProfile.summary}
          rate={insights.lowConversionLeadProfile.rate}
        />
      </div>
    </section>
  );
}

type OverridePerformance = Awaited<ReturnType<typeof analyzeOverridePerformance>>;
type ImprovementMetrics = Awaited<ReturnType<typeof compareBeforeAfterMetrics>>;

function ImpactRateLine({
  label,
  before,
  after,
  lift,
}: {
  label: string;
  before: number;
  after: number;
  lift: number;
}) {
  const liftLabel = lift > 0 ? `+${lift}%` : `${lift}%`;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-sm font-semibold text-slate-950">{label}</p>
      <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
        <div>
          <p className="text-xs uppercase text-slate-500">Before</p>
          <p className="mt-1 font-bold text-slate-900">{before}%</p>
        </div>
        <div>
          <p className="text-xs uppercase text-slate-500">After</p>
          <p className="mt-1 font-bold text-slate-900">{after}%</p>
        </div>
        <div>
          <p className="text-xs uppercase text-slate-500">Lift</p>
          <p className="mt-1 font-bold text-slate-900">{liftLabel}</p>
        </div>
      </div>
    </div>
  );
}

function StrategyList({
  title,
  totalOverrides,
  strategies,
}: {
  title: string;
  totalOverrides: number;
  strategies: string[];
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="font-semibold text-slate-950">{title}</p>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {totalOverrides} override(s)
        </span>
      </div>
      {strategies.length > 0 ? (
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          {strategies.map((strategy) => (
            <li key={strategy}>{strategy}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-slate-600">
          Not enough override outcomes yet.
        </p>
      )}
    </div>
  );
}

function AiOptimizationImpactSection({
  overridePerformance,
  improvementMetrics,
}: {
  overridePerformance: OverridePerformance;
  improvementMetrics: ImprovementMetrics;
}) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold">AI Optimization Impact</h2>
      <p className="mt-2 text-sm text-slate-600">
        Measures applied override outcomes only. No strategy is auto-promoted.
      </p>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <ImpactRateLine
          label="Response Lift"
          before={improvementMetrics.before.responseRate.rate}
          after={improvementMetrics.after.responseRate.rate}
          lift={improvementMetrics.responseLift}
        />
        <ImpactRateLine
          label="Conversion Lift"
          before={improvementMetrics.before.conversionRate.rate}
          after={improvementMetrics.after.conversionRate.rate}
          lift={improvementMetrics.conversionLift}
        />
        <ImpactRateLine
          label="Follow-Up Lift"
          before={improvementMetrics.before.followUpSuccessRate.rate}
          after={improvementMetrics.after.followUpSuccessRate.rate}
          lift={improvementMetrics.followUpLift}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <StrategyList
          title="Reply Style Strategies"
          totalOverrides={overridePerformance.replyStyle.totalOverrides}
          strategies={overridePerformance.replyStyle.winningStrategies}
        />
        <StrategyList
          title="Follow-Up Timing Strategies"
          totalOverrides={overridePerformance.followUpTiming.totalOverrides}
          strategies={overridePerformance.followUpTiming.winningStrategies}
        />
      </div>
    </section>
  );
}

export default async function AiPerformancePage() {
  const [
    latest,
    actionAlerts,
    performanceRates,
    learningInsights,
    overridePerformance,
    improvementMetrics,
  ] =
    await Promise.all([
    getLatestAiPerformanceMetric(),
    getAiAlerts(),
    calculateAiPerformanceRates(),
    generateAiLearningInsights(),
    analyzeOverridePerformance(),
    compareBeforeAfterMetrics(),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <Link href="/dashboard/leads" className="text-sm text-slate-500">
        Back to leads
      </Link>

      <h1 className="mt-3 text-3xl font-bold">AI Performance Monitor</h1>

      {!latest ? (
        <div className="mt-6 rounded border border-yellow-200 bg-yellow-50 p-6">
          No AI performance snapshot found yet.
        </div>
      ) : (
        <>
          <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard title="Total Leads" value={latest.totalLeads} />
            <MetricCard title="New Leads" value={latest.newLeads} />
            <MetricCard title="Seller Replies" value={latest.sellerReplies} />
            <MetricCard
              title="Avg Confidence"
              value={`${Math.round((latest.avgConfidence || 0) * 100)}%`}
            />
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-bold">AI Memory Performance</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <RateMetricCard
                title="Response Rate"
                metric={performanceRates.responseRate}
              />
              <RateMetricCard
                title="Approval Rate"
                metric={performanceRates.approvalRate}
              />
              <RateMetricCard
                title="Rejection Rate"
                metric={performanceRates.rejectionRate}
              />
              <RateMetricCard
                title="Conversion Rate"
                metric={performanceRates.conversionRate}
              />
              <RateMetricCard
                title="Follow-Up Effectiveness"
                metric={performanceRates.followUpEffectiveness}
              />
            </div>
          </section>

          <AiLearningInsightsSection insights={learningInsights} />
          <AiOptimizationImpactSection
            overridePerformance={overridePerformance}
            improvementMetrics={improvementMetrics}
          />
          <AiMemoryPanel />

          <section className="mt-8">
            <h2 className="text-xl font-bold">AI Action Alerts</h2>

            {actionAlerts.map((alert) => (
              <div key={alert.id} className="mt-4 rounded border p-4">
                <div className="flex justify-between">
                  <p className="font-semibold">{alert.title}</p>
                  <span className={getSeverityStyles(alert.severity)}>
                    {alert.severity}
                  </span>
                </div>

                <p className="mt-2">{alert.message}</p>

                {alert.actionUrl && (
                  <Link
                    href={getSafeActionHref(alert.actionUrl)}
                    className="mt-3 inline-block rounded bg-black px-4 py-2 text-white"
                  >
                    {getActionLabel(alert.type)}
                  </Link>
                )}
              </div>
            ))}
          </section>
        </>
      )}
    </main>
  );
}
