import type { R53ManualRevenueMetricsResult } from "@/lib/r53-manual-revenue-metrics-helper";
import type { StoredLead } from "@/lib/leads-storage";
import { StatCard } from "@/components/shared/stat-card";

type StuckDealRecoverySummaryProps = {
  leads: StoredLead[];
  metrics: R53ManualRevenueMetricsResult;
};

type RecoverySection = {
  title: string;
  count: number;
  status: string;
  detail: string;
};

const requiredSafetyCopy =
  "Read-only recovery guidance. No provider called, no message sent, no runtime execution.";

const safetyBadges = ["Read-only", "Advisory-only", "No execution controls"];

function hasPendingFollowUp(lead: StoredLead) {
  return Array.isArray(lead.followUps) && lead.followUps.some((followUp) => followUp.status === "pending");
}

function hasSellerOutcome(lead: StoredLead) {
  return Boolean(lead.lastSellerReply?.trim() || lead.latestApprovalNote?.trim());
}

function hasMissingNextStep(lead: StoredLead) {
  const isOpen = lead.status !== "closed";
  const hasNextFollowUp = Boolean(lead.nextFollowUpAt) || hasPendingFollowUp(lead);

  return isOpen && !hasNextFollowUp && !hasSellerOutcome(lead);
}

function hasBuyerReadinessBlocker(lead: StoredLead) {
  return lead.status === "under_contract" && lead.approvalStatus !== "approved_for_outreach";
}

function hasNearCloseFriction(lead: StoredLead) {
  return (
    lead.status === "under_contract" &&
    (lead.requiresHumanApproval === true ||
      lead.doNotContact === true ||
      lead.approvalStatus === "needs_human_review" ||
      lead.approvalStatus === "rejected" ||
      hasMissingNextStep(lead))
  );
}

function hasHumanReviewRequired(lead: StoredLead) {
  return lead.requiresHumanApproval === true || lead.approvalStatus === "needs_human_review";
}

function getRecoverySections(leads: StoredLead[], metrics: R53ManualRevenueMetricsResult): RecoverySection[] {
  const values = metrics.metricValues;
  const missingNextStepCount = leads.filter(hasMissingNextStep).length;
  const buyerReadinessBlockerCount = leads.filter(hasBuyerReadinessBlocker).length + values.incomplete_buyer_packages;
  const nearCloseFrictionCount = leads.filter(hasNearCloseFriction).length;

  return [
    {
      title: "Human-review-required items",
      count: values.human_review_required_count || leads.filter(hasHumanReviewRequired).length,
      status: "Review required before any next step.",
      detail: "Human review is a stop-and-check signal, not permission to contact, approve, or execute.",
    },
    {
      title: "Near-close friction",
      count: nearCloseFrictionCount || values.near_close_opportunities,
      status: "Near-close review needed.",
      detail: "Prioritize manual review where under-contract or late-stage records still have blockers.",
    },
    {
      title: "Overdue manual follow-ups",
      count: values.manual_follow_ups_overdue,
      status: "Manual follow-up is overdue.",
      detail: "Follow-up remains off-platform and human-owned after governance and contact safety review.",
    },
    {
      title: "Missing next steps",
      count: missingNextStepCount,
      status: "Human-owned next step missing.",
      detail: "Assign the next manual review step outside this component; this surface records nothing.",
    },
    {
      title: "Buyer-readiness blockers",
      count: buyerReadinessBlockerCount,
      status: "Buyer package needs manual review.",
      detail: "Buyer-readiness visibility does not authorize buyer-facing contact or package release.",
    },
    {
      title: "Missing critical data",
      count: values.missing_critical_data_count,
      status: "Critical data is incomplete.",
      detail: "Verify source, contact, property, motivation, timeline, and package details manually.",
    },
  ];
}

function getRecoverySummaryCount(sections: RecoverySection[]) {
  return sections.reduce((total, section) => total + section.count, 0);
}

function getRevenueLeakageIndicators(metrics: R53ManualRevenueMetricsResult, sections: RecoverySection[]) {
  const values = metrics.metricValues;
  const totalRecoverySignals = getRecoverySummaryCount(sections);

  return [
    {
      label: "Manual attention risk",
      value: totalRecoverySignals,
      helper: "Combined stuck-deal signals from existing dashboard data",
    },
    {
      label: "Seller momentum risk",
      value: values.manual_follow_ups_overdue,
      helper: "Overdue manual follow-up can slow conversion",
    },
    {
      label: "Disposition readiness risk",
      value: values.incomplete_buyer_packages + values.buyer_ready_leads,
      helper: "Buyer package review remains manual",
    },
  ];
}

export function StuckDealRecoverySummary({ leads, metrics }: StuckDealRecoverySummaryProps) {
  const sections = getRecoverySections(leads, metrics);
  const leakageIndicators = getRevenueLeakageIndicators(metrics, sections);

  return (
    <section
      aria-labelledby="stuck-deal-recovery-summary-heading"
      className="rounded-[1.5rem] border border-border bg-surface p-6"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">
            Stuck-deal recovery intelligence
          </p>
          <h2 id="stuck-deal-recovery-summary-heading" className="text-xl font-semibold text-primary">
            Read-only recovery summary
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-muted">{requiredSafetyCopy}</p>
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
        <StatCard
          label="Recovery signals"
          value={String(getRecoverySummaryCount(sections))}
          helper="Read-only stuck-deal signals from existing dashboard data"
        />
        <StatCard
          label="Human review"
          value={String(sections[0]?.count ?? 0)}
          helper="Review required; no permission or execution implied"
        />
        <StatCard
          label="Near-close friction"
          value={String(sections[1]?.count ?? 0)}
          helper="Late-stage blockers for manual review only"
        />
        <StatCard
          label="Revenue leakage"
          value={String(leakageIndicators[0]?.value ?? 0)}
          helper="Advisory attention indicator, not a forecast"
        />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        {sections.map((section) => (
          <article key={section.title} className="rounded-2xl border border-border bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-semibold text-primary">{section.title}</h3>
              <span className="rounded-full border border-border bg-[#f7fafc] px-2.5 py-1 text-xs font-bold text-primary">
                {section.count}
              </span>
            </div>
            <p className="mt-2 text-sm font-medium text-primary">{section.status}</p>
            <p className="mt-1 text-sm leading-6 text-muted">{section.detail}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3" aria-label="Revenue leakage indicators">
        {leakageIndicators.map((indicator) => (
          <article key={indicator.label} className="rounded-2xl border border-[#e6d5b8] bg-[#fff8ec] p-4">
            <p className="text-sm font-semibold text-[#69420f]">{indicator.label}</p>
            <p className="mt-2 text-2xl font-semibold text-[#442b0a]">{indicator.value}</p>
            <p className="mt-1 text-sm leading-6 text-[#69420f]">{indicator.helper}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
        <h3 className="font-semibold text-blue-950">Safe manual recovery guidance</h3>
        <p className="mt-1">
          Review human-review-required items first, then near-close friction, overdue manual follow-ups, missing next
          steps, buyer-readiness blockers, missing critical data, and revenue leakage indicators. Guidance is advisory
          text only and does not send, approve, automate, recover, persist, poll, or activate providers.
        </p>
      </div>
    </section>
  );
}
