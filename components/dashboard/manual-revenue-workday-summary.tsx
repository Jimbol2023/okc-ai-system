import type { R53ManualRevenueMetricsResult } from "@/lib/r53-manual-revenue-metrics-helper";
import { StatCard } from "@/components/shared/stat-card";

type ManualRevenueWorkdaySummaryProps = {
  metrics: R53ManualRevenueMetricsResult;
};

const safetyBadges = ["Read-only", "Advisory-only", "Simulation-only"];

function getWorkdayFocus(metrics: R53ManualRevenueMetricsResult) {
  const {
    leads_needing_review,
    manual_follow_ups_overdue,
    near_close_opportunities,
    blocked_leads,
    missing_critical_data_count,
    buyer_ready_leads,
  } = metrics.metricValues;

  if (blocked_leads > 0 || missing_critical_data_count > 0) {
    return "Resolve blockers and missing data before lower-priority review.";
  }

  if (near_close_opportunities > 0) {
    return "Review near-close opportunities and confirm the next manual step.";
  }

  if (manual_follow_ups_overdue > 0) {
    return "Work overdue manual follow-ups before new low-priority records.";
  }

  if (buyer_ready_leads > 0) {
    return "Review buyer package readiness before any buyer-facing action.";
  }

  if (leads_needing_review > 0) {
    return "Complete manual review for new or human-review-required leads.";
  }

  return "No urgent revenue blocker is visible from current dashboard data.";
}

export function ManualRevenueWorkdaySummary({ metrics }: ManualRevenueWorkdaySummaryProps) {
  const values = metrics.metricValues;
  const workdayFocus = getWorkdayFocus(metrics);
  const priorityCards = [
    {
      label: "Today priority",
      value: String(values.leads_needing_review + values.manual_follow_ups_overdue + values.human_review_required_count),
      helper: "Manual review, overdue follow-up, and human-review-required workload",
    },
    {
      label: "Near-close review",
      value: String(values.near_close_opportunities),
      helper: "Advisory opportunity count; not closing or execution readiness",
    },
    {
      label: "Stuck or blocked",
      value: String(values.blocked_leads + values.governance_blocked_count),
      helper: "Do-not-proceed and governance-blocked visibility",
    },
    {
      label: "Buyer prep",
      value: String(values.buyer_ready_leads + values.incomplete_buyer_packages),
      helper: "Manual disposition package review only",
    },
  ];
  const workdaySections = [
    {
      title: "Revenue priorities",
      body: workdayFocus,
    },
    {
      title: "Manual follow-ups",
      body: `${values.manual_follow_ups_due} due and ${values.manual_follow_ups_overdue} overdue. Follow-up remains manual outside runtime automation.`,
    },
    {
      title: "Data blockers",
      body: `${values.missing_critical_data_count} records are missing critical data. Complete source, contact, property, motivation, timeline, or package details before moving work forward.`,
    },
    {
      title: "Human review",
      body: `${values.human_review_required_count} records require human review. Review does not grant execution permission.`,
    },
    {
      title: "Do-not-proceed",
      body: `${values.dnc_opt_out_blocked_leads} records show DNC or opt-out risk. Treat blocked states as stop signals.`,
    },
    {
      title: "Manual next action",
      body: "Review the highest-value records, call sellers manually outside the app, record outcomes, and prepare buyer packages manually.",
    },
  ];

  return (
    <section
      aria-labelledby="manual-revenue-workday-summary-heading"
      className="rounded-[1.5rem] border border-border bg-surface p-6"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">
            Revenue operations intelligence
          </p>
          <h2 id="manual-revenue-workday-summary-heading" className="text-xl font-semibold text-primary">
            Manual revenue workday summary
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-muted">
            Read-only guidance. No provider called, no message sent, no runtime execution.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.1em]">
          {safetyBadges.map((badge) => (
            <span key={badge} className="rounded-full border border-border bg-white px-3 py-1 text-primary">
              {badge}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {priorityCards.map((card) => (
          <StatCard key={card.label} label={card.label} value={card.value} helper={card.helper} />
        ))}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        {workdaySections.map((section) => (
          <article key={section.title} className="rounded-2xl border border-border bg-white p-4">
            <h3 className="text-sm font-semibold text-primary">{section.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{section.body}</p>
          </article>
        ))}
      </div>

      <p className="mt-4 rounded-2xl border border-[#e6d5b8] bg-[#fff8ec] p-3 text-sm leading-6 text-[#69420f]">
        Manual next actions are advisory text only. This section adds no buttons, no provider controls, no workflow
        mutation, no persistence, no polling, and no approval-as-execution behavior.
      </p>
    </section>
  );
}
