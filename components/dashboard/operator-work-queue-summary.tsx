import type { R53ManualRevenueMetricsResult } from "@/lib/r53-manual-revenue-metrics-helper";
import type { StoredLead } from "@/lib/leads-storage";
import { StatCard } from "@/components/shared/stat-card";

type OperatorWorkQueueSummaryProps = {
  leads: StoredLead[];
  metrics: R53ManualRevenueMetricsResult;
};

type QueueSection = {
  title: string;
  count: number;
  status: string;
  detail: string;
};

type HighestValueAction = {
  rank: number;
  label: string;
  count: number;
  status: string;
  detail: string;
};

const requiredSafetyCopy =
  "Read-only operator work queue guidance. No provider called, no message sent, no runtime execution.";

const safetyBadges = ["Read-only", "Advisory-only", "No execution controls"];

function getLeadFollowUps(lead: StoredLead) {
  return Array.isArray(lead.followUps) ? lead.followUps : [];
}

function hasPendingFollowUp(lead: StoredLead) {
  return getLeadFollowUps(lead).some((followUp) => followUp.status === "pending");
}

function hasSellerOutcome(lead: StoredLead) {
  return Boolean(lead.lastSellerReply?.trim() || lead.latestApprovalNote?.trim());
}

function hasGovernanceStopSignal(lead: StoredLead) {
  return (
    lead.doNotContact === true ||
    lead.requiresHumanApproval === true ||
    lead.approvalStatus === "needs_human_review" ||
    lead.approvalStatus === "rejected"
  );
}

function isNearCloseLead(lead: StoredLead) {
  return lead.status === "under_contract";
}

function hasMissingCriticalData(lead: StoredLead) {
  return (
    !lead.source?.trim() ||
    !lead.propertyAddress?.trim() ||
    !lead.phone?.trim() ||
    !lead.situationDetails?.trim() ||
    (!lead.nextFollowUpAt && !hasPendingFollowUp(lead))
  );
}

function hasMissingNextStep(lead: StoredLead) {
  const isOpen = lead.status !== "closed";
  const hasNextFollowUp = Boolean(lead.nextFollowUpAt) || hasPendingFollowUp(lead);

  return isOpen && !hasNextFollowUp && !hasSellerOutcome(lead);
}

function hasBuyerDispositionPriority(lead: StoredLead) {
  return isNearCloseLead(lead) && lead.approvalStatus !== "approved_for_outreach";
}

function hasNearCloseRecoverySignal(lead: StoredLead) {
  return isNearCloseLead(lead) && (hasGovernanceStopSignal(lead) || hasMissingCriticalData(lead) || hasMissingNextStep(lead));
}

function hasStuckDealRecoverySignal(lead: StoredLead) {
  return lead.status !== "closed" && (hasMissingNextStep(lead) || hasMissingCriticalData(lead) || hasBuyerDispositionPriority(lead));
}

function getGovernanceStopCount(leads: StoredLead[], metrics: R53ManualRevenueMetricsResult) {
  const values = metrics.metricValues;

  return values.governance_blocked_count || values.dnc_opt_out_blocked_leads || leads.filter(hasGovernanceStopSignal).length;
}

function getHighestValueActions(leads: StoredLead[], metrics: R53ManualRevenueMetricsResult): HighestValueAction[] {
  const values = metrics.metricValues;
  const governanceStopCount = getGovernanceStopCount(leads, metrics);
  const nearCloseCount = leads.filter(hasNearCloseRecoverySignal).length || values.near_close_opportunities;
  const stuckDealCount = leads.filter(hasStuckDealRecoverySignal).length;
  const sellerFollowUpCount = values.manual_follow_ups_overdue || values.manual_follow_ups_due;
  const buyerReviewCount = values.incomplete_buyer_packages + leads.filter(hasBuyerDispositionPriority).length;
  const missingRevenueDataCount = values.missing_critical_data_count;
  const bottleneckCount = governanceStopCount + values.human_review_required_count + missingRevenueDataCount;

  return [
    {
      rank: 1,
      label: "Governance stop review",
      count: governanceStopCount,
      status: "Manual review recommended first.",
      detail: "Stop-and-review signals stay ahead of all revenue guidance.",
    },
    {
      rank: 2,
      label: "Near-close recovery review",
      count: nearCloseCount,
      status: "Operator attention recommended.",
      detail: "Late-stage blockers can create immediate revenue leakage.",
    },
    {
      rank: 3,
      label: "Stuck-deal recovery review",
      count: stuckDealCount,
      status: "Priority recovery focus.",
      detail: "Stalled records may need human next-step review.",
    },
    {
      rank: 4,
      label: "Seller follow-up review",
      count: sellerFollowUpCount,
      status: "Follow-up priority.",
      detail: "Seller-side review remains human-owned and off-platform.",
    },
    {
      rank: 5,
      label: "Buyer disposition review",
      count: buyerReviewCount,
      status: "Buyer review recommended.",
      detail: "Package and disposition context stays manual.",
    },
    {
      rank: 6,
      label: "Missing revenue data review",
      count: missingRevenueDataCount,
      status: "Revenue leakage attention.",
      detail: "Missing source, contact, property, motivation, or timeline data needs verification.",
    },
    {
      rank: 7,
      label: "Workflow bottleneck review",
      count: bottleneckCount,
      status: "Friction escalation.",
      detail: "Bottlenecks are review labels only, not workflow changes.",
    },
  ];
}

function getQueueSections(leads: StoredLead[], metrics: R53ManualRevenueMetricsResult): QueueSection[] {
  const values = metrics.metricValues;
  const highestValueActions = getHighestValueActions(leads, metrics);
  const governanceStopCount = highestValueActions[0]?.count ?? 0;
  const nearCloseCount = highestValueActions[1]?.count ?? 0;
  const stuckDealCount = highestValueActions[2]?.count ?? 0;
  const sellerFollowUpCount = highestValueActions[3]?.count ?? 0;
  const buyerReviewCount = highestValueActions[4]?.count ?? 0;
  const missingRevenueDataCount = highestValueActions[5]?.count ?? 0;
  const bottleneckCount = highestValueActions[6]?.count ?? 0;

  return [
    {
      title: "Governance stop signals",
      count: governanceStopCount,
      status: "Manual review required.",
      detail: "Review barriers remain visible before any revenue priority guidance.",
    },
    {
      title: "Highest-value next actions",
      count: highestValueActions.reduce((total, action) => total + action.count, 0),
      status: "Top manual attention areas.",
      detail: "Priorities are advisory labels for human planning only.",
    },
    {
      title: "Daily revenue priorities",
      count: values.leads_needing_review + values.manual_follow_ups_due + values.near_close_opportunities,
      status: "Daily priority labels are advisory.",
      detail: "Use these signals to scan work without changing workflow state.",
    },
    {
      title: "Near-close recovery items",
      count: nearCloseCount,
      status: "Late-stage review focus.",
      detail: "Near-close visibility does not imply closing, assignment, or buyer-contact readiness.",
    },
    {
      title: "Stuck-deal recovery items",
      count: stuckDealCount,
      status: "Deal review recommended.",
      detail: "Stalled records remain review-only and do not trigger recovery work.",
    },
    {
      title: "Seller follow-up priorities",
      count: sellerFollowUpCount,
      status: "Seller follow-up recommended.",
      detail: "Follow-up priority is a manual label and does not send or dial.",
    },
    {
      title: "Buyer disposition priorities",
      count: buyerReviewCount,
      status: "Buyer review recommended.",
      detail: "Disposition review does not contact buyers or release packages.",
    },
    {
      title: "Missing revenue data items",
      count: missingRevenueDataCount,
      status: "Revenue leakage attention.",
      detail: "Missing facts and assumptions need human verification.",
    },
    {
      title: "Workflow bottlenecks",
      count: bottleneckCount,
      status: "Friction escalation.",
      detail: "Bottleneck labels do not assign work or change workflow state.",
    },
    {
      title: "Manual review queue",
      count: values.human_review_required_count || values.leads_needing_review,
      status: "Manual review recommended.",
      detail: "Queue visibility is read-only and records nothing.",
    },
  ];
}

function getQueueTotal(sections: QueueSection[]) {
  return sections.reduce((total, section) => total + section.count, 0);
}

export function OperatorWorkQueueSummary({ leads, metrics }: OperatorWorkQueueSummaryProps) {
  const highestValueActions = getHighestValueActions(leads, metrics);
  const sections = getQueueSections(leads, metrics);

  return (
    <section
      aria-labelledby="operator-work-queue-heading"
      className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6"
    >
      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">
            Operator work queue intelligence
          </p>
          <h2 id="operator-work-queue-heading" className="break-words text-xl font-semibold text-primary">
            Read-only operator work queue summary
          </h2>
          <p className="max-w-3xl break-words text-sm leading-6 text-muted">{requiredSafetyCopy}</p>
        </div>
        <div className="flex max-w-full flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.1em]">
          {safetyBadges.map((badge) => (
            <span key={badge} className="max-w-full break-words rounded-full border border-border bg-white px-3 py-1 text-center leading-5 text-primary">
              {badge}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7" aria-label="Highest-value next actions">
        {highestValueActions.map((action) => (
          <article key={action.rank} className="min-w-0 rounded-2xl border border-border bg-white p-4">
            <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
              <h3 className="min-w-0 flex-1 break-words text-sm font-semibold text-primary">{action.label}</h3>
              <span className="shrink-0 rounded-full border border-border bg-[#f7fafc] px-2.5 py-1 text-xs font-bold text-primary">
                {action.rank}
              </span>
            </div>
            <p className="mt-2 text-2xl font-semibold text-primary">{action.count}</p>
            <p className="mt-1 break-words text-sm font-medium text-primary">{action.status}</p>
            <p className="mt-1 break-words text-sm leading-6 text-muted">{action.detail}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {sections.map((section) => (
          <article key={section.title} className="min-w-0 rounded-2xl border border-border bg-white p-4">
            <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
              <h3 className="min-w-0 flex-1 break-words text-sm font-semibold text-primary">{section.title}</h3>
              <span className="shrink-0 rounded-full border border-border bg-[#f7fafc] px-2.5 py-1 text-xs font-bold text-primary">
                {section.count}
              </span>
            </div>
            <p className="mt-2 break-words text-sm font-medium text-primary">{section.status}</p>
            <p className="mt-1 break-words text-sm leading-6 text-muted">{section.detail}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Operator work queue summary">
        <StatCard
          label="Queue signals"
          value={String(getQueueTotal(sections))}
          helper="Read-only manual priority signals from existing dashboard data"
        />
        <StatCard
          label="Governance stops"
          value={String(highestValueActions[0]?.count ?? 0)}
          helper="Review first; no override or execution control"
        />
        <StatCard
          label="Daily priorities"
          value={String(sections[2]?.count ?? 0)}
          helper="Advisory daily attention labels"
        />
        <StatCard
          label="Manual reviews"
          value={String(sections[9]?.count ?? 0)}
          helper="Human review queue visibility only"
        />
      </div>

      <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
        <h3 className="break-words font-semibold text-blue-950">Safe operator guidance</h3>
        <p className="mt-1 break-words">
          Review governance stop signals first, then highest-value next actions, daily revenue priorities, near-close
          recovery items, stuck-deal recovery items, seller follow-up priorities, buyer disposition priorities, missing
          revenue data items, workflow bottlenecks, and the manual review queue. Guidance is advisory text only and
          does not send, approve, automate, recover, persist, poll, contact providers, negotiate, or change workflow
          state.
        </p>
      </div>
    </section>
  );
}
