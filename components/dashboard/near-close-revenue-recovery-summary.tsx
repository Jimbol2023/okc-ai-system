import type { R53ManualRevenueMetricsResult } from "@/lib/r53-manual-revenue-metrics-helper";
import type { StoredLead } from "@/lib/leads-storage";
import { StatCard } from "@/components/shared/stat-card";

type NearCloseRevenueRecoverySummaryProps = {
  leads: StoredLead[];
  metrics: R53ManualRevenueMetricsResult;
};

type NearCloseSection = {
  title: string;
  count: number;
  status: string;
  detail: string;
};

const requiredSafetyCopy =
  "Read-only near-close recovery guidance. No provider called, no message sent, no runtime execution.";

const safetyBadges = ["Read-only", "Advisory-only", "No execution controls"];

function getLeadFollowUps(lead: StoredLead) {
  return Array.isArray(lead.followUps) ? lead.followUps : [];
}

function hasPendingFollowUp(lead: StoredLead) {
  return getLeadFollowUps(lead).some((followUp) => followUp.status === "pending");
}

function hasSellerResponseSignal(lead: StoredLead) {
  return Boolean(lead.lastSellerReply?.trim() || lead.latestApprovalNote?.trim());
}

function isNearCloseLead(lead: StoredLead) {
  return lead.status === "under_contract";
}

function hasGovernanceStopSignal(lead: StoredLead) {
  return (
    lead.doNotContact === true ||
    lead.requiresHumanApproval === true ||
    lead.approvalStatus === "needs_human_review" ||
    lead.approvalStatus === "rejected"
  );
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

function hasSellerResponseBlocker(lead: StoredLead) {
  return isNearCloseLead(lead) && !hasSellerResponseSignal(lead) && !hasPendingFollowUp(lead);
}

function hasBuyerPackageBlocker(lead: StoredLead) {
  return isNearCloseLead(lead) && lead.approvalStatus !== "approved_for_outreach";
}

function getNearCloseSections(leads: StoredLead[], metrics: R53ManualRevenueMetricsResult): NearCloseSection[] {
  const values = metrics.metricValues;
  const nearCloseLeads = leads.filter(isNearCloseLead);
  const governanceStopCount =
    values.governance_blocked_count || values.dnc_opt_out_blocked_leads || nearCloseLeads.filter(hasGovernanceStopSignal).length;
  const missingDataNearCloseCount = nearCloseLeads.filter(hasMissingCriticalData).length;
  const sellerResponseBlockerCount = nearCloseLeads.filter(hasSellerResponseBlocker).length;
  const buyerPackageBlockerCount = values.incomplete_buyer_packages || nearCloseLeads.filter(hasBuyerPackageBlocker).length;
  const assignmentFrictionCount = nearCloseLeads.filter(
    (lead) => hasBuyerPackageBlocker(lead) || hasMissingCriticalData(lead) || hasGovernanceStopSignal(lead),
  ).length;
  const staleTimelineCount = nearCloseLeads.filter((lead) => !lead.nextFollowUpAt && !hasPendingFollowUp(lead)).length;

  return [
    {
      title: "Governance stop signals",
      count: governanceStopCount,
      status: "Stop-and-review signal present.",
      detail: "Human review, rejection, or do-not-contact context stays visible before any manual recovery planning.",
    },
    {
      title: "Title/escrow blockers",
      count: missingDataNearCloseCount,
      status: "Manual verification context incomplete.",
      detail: "Missing critical lead context is shown as a review need only; no title or escrow action is started here.",
    },
    {
      title: "Closing checklist gaps",
      count: missingDataNearCloseCount + buyerPackageBlockerCount,
      status: "Checklist context needs manual review.",
      detail: "Gaps indicate incomplete dashboard signals, not a claim that the deal can or cannot proceed.",
    },
    {
      title: "Assignment friction",
      count: assignmentFrictionCount,
      status: "Assignment context needs manual review.",
      detail: "Under-contract records with missing package, governance, or data context stay advisory-only.",
    },
    {
      title: "Seller response blockers",
      count: sellerResponseBlockerCount,
      status: "Seller response context is missing.",
      detail: "Manual operator review can confirm seller status outside this read-only surface.",
    },
    {
      title: "Buyer package blockers",
      count: buyerPackageBlockerCount,
      status: "Buyer package context needs review.",
      detail: "Package visibility is informational only and does not authorize buyer contact or package release.",
    },
    {
      title: "Missing document blockers",
      count: values.missing_critical_data_count,
      status: "Critical dashboard data is incomplete.",
      detail: "Source, contact, property, motivation, timeline, and package fields may need manual verification.",
    },
    {
      title: "Stale near-close timelines",
      count: staleTimelineCount,
      status: "Human-owned timeline signal missing.",
      detail: "No auto-refresh, polling, reminders, or follow-up execution is attached to this count.",
    },
  ];
}

function getNearCloseRecoveryTotal(sections: NearCloseSection[]) {
  return sections.reduce((total, section) => total + section.count, 0);
}

function getPreClosingRevenueLeakageIndicators(metrics: R53ManualRevenueMetricsResult, sections: NearCloseSection[]) {
  const values = metrics.metricValues;

  return [
    {
      label: "Near-close attention load",
      value: values.near_close_opportunities,
      helper: "Under-contract dashboard signals requiring human prioritization",
    },
    {
      label: "Pre-closing leakage signals",
      value: getNearCloseRecoveryTotal(sections),
      helper: "Combined blocker visibility from already-loaded dashboard data",
    },
    {
      label: "Manual package review load",
      value: values.incomplete_buyer_packages,
      helper: "Package review signal only; no contact, send, or release action is available",
    },
  ];
}

export function NearCloseRevenueRecoverySummary({ leads, metrics }: NearCloseRevenueRecoverySummaryProps) {
  const sections = getNearCloseSections(leads, metrics);
  const leakageIndicators = getPreClosingRevenueLeakageIndicators(metrics, sections);

  return (
    <section
      aria-labelledby="near-close-revenue-recovery-heading"
      className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6"
    >
      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">
            Near-close revenue recovery intelligence
          </p>
          <h2 id="near-close-revenue-recovery-heading" className="break-words text-xl font-semibold text-primary">
            Read-only near-close recovery summary
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

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
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

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3" aria-label="Pre-closing revenue leakage indicators">
        {leakageIndicators.map((indicator) => (
          <article key={indicator.label} className="min-w-0 rounded-2xl border border-[#e6d5b8] bg-[#fff8ec] p-4">
            <p className="break-words text-sm font-semibold text-[#69420f]">{indicator.label}</p>
            <p className="mt-2 text-2xl font-semibold text-[#442b0a]">{indicator.value}</p>
            <p className="mt-1 break-words text-sm leading-6 text-[#69420f]">{indicator.helper}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Near-close revenue recovery summary">
        <StatCard
          label="Near-close records"
          value={String(metrics.metricValues.near_close_opportunities)}
          helper="Existing under-contract dashboard signal only"
        />
        <StatCard
          label="Governance stops"
          value={String(sections[0]?.count ?? 0)}
          helper="Review barrier; no override or execution control"
        />
        <StatCard
          label="Checklist gaps"
          value={String(sections[2]?.count ?? 0)}
          helper="Manual verification context from loaded lead data"
        />
        <StatCard
          label="Leakage indicators"
          value={String(leakageIndicators[1]?.value ?? 0)}
          helper="Advisory priority signal, not a forecast or readiness claim"
        />
      </div>

      <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
        <h3 className="break-words font-semibold text-blue-950">Safe manual recovery guidance</h3>
        <p className="mt-1 break-words">
          Review governance stop signals first, then title/escrow blockers, closing checklist gaps, assignment
          friction, seller response blockers, buyer package blockers, missing document blockers, stale near-close
          timelines, and pre-closing revenue leakage indicators. Guidance is advisory text only and does not send,
          approve, negotiate, assign, recover, persist, poll, activate providers, or execute runtime work.
        </p>
      </div>
    </section>
  );
}
