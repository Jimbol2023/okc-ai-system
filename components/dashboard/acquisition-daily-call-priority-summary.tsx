import type { R53ManualRevenueMetricsResult } from "@/lib/r53-manual-revenue-metrics-helper";
import type { StoredLead } from "@/lib/leads-storage";
import { StatCard } from "@/components/shared/stat-card";

type AcquisitionDailyCallPrioritySummaryProps = {
  leads: StoredLead[];
  metrics: R53ManualRevenueMetricsResult;
};

type SellerPrioritySection = {
  title: string;
  count: number;
  status: string;
  detail: string;
};

const safetyBadges = ["Read-only", "Advisory-only", "No execution controls"];

function getLeadFollowUps(lead: StoredLead) {
  return Array.isArray(lead.followUps) ? lead.followUps : [];
}

function hasPendingFollowUp(lead: StoredLead) {
  return getLeadFollowUps(lead).some((followUp) => followUp.status === "pending");
}

function hasCompletedSellerCall(lead: StoredLead) {
  return getLeadFollowUps(lead).some((followUp) => followUp.type === "call" && followUp.status === "completed");
}

function hasSellerContext(lead: StoredLead) {
  return Boolean(lead.lastSellerReply?.trim() || lead.latestApprovalNote?.trim() || lead.situationDetails?.trim());
}

function hasGovernanceStopSignal(lead: StoredLead) {
  return (
    lead.doNotContact === true ||
    lead.requiresHumanApproval === true ||
    lead.approvalStatus === "needs_human_review" ||
    lead.approvalStatus === "rejected"
  );
}

function hasMissingAcquisitionData(lead: StoredLead) {
  return (
    !lead.source?.trim() ||
    !lead.propertyAddress?.trim() ||
    !lead.phone?.trim() ||
    !lead.situationDetails?.trim() ||
    (!lead.nextFollowUpAt && !hasPendingFollowUp(lead))
  );
}

function isOpenSellerLead(lead: StoredLead) {
  return lead.status !== "closed";
}

function hasHighPrioritySellerSignal(lead: StoredLead) {
  return isOpenSellerLead(lead) && (lead.priority === "High" || lead.opportunityScore === "High" || lead.isHot === true);
}

function hasSellerUrgencySignal(lead: StoredLead) {
  const context = `${lead.situationDetails ?? ""} ${lead.lastSellerReply ?? ""} ${lead.latestApprovalNote ?? ""}`.toLowerCase();
  const urgencyTerms = ["urgent", "asap", "quick", "soon", "behind", "foreclosure", "vacant", "repair", "cash"];

  return isOpenSellerLead(lead) && urgencyTerms.some((term) => context.includes(term));
}

function hasOverdueFollowUpSignal(lead: StoredLead) {
  const dueAt = lead.nextFollowUpAt ? new Date(lead.nextFollowUpAt) : null;
  const isPastDue = dueAt instanceof Date && !Number.isNaN(dueAt.getTime()) && dueAt.getTime() < Date.now();

  return isOpenSellerLead(lead) && (isPastDue || getLeadFollowUps(lead).some((followUp) => followUp.status === "pending"));
}

function hasLeadDecayRisk(lead: StoredLead) {
  if (!isOpenSellerLead(lead) || hasCompletedSellerCall(lead)) return false;

  const createdAt = new Date(lead.timestamp);
  const createdTime = createdAt.getTime();
  const isOlderOpenLead = !Number.isNaN(createdTime) && Date.now() - createdTime > 1000 * 60 * 60 * 24 * 14;

  return isOlderOpenLead && !hasPendingFollowUp(lead);
}

function hasSellerMomentumRisk(lead: StoredLead) {
  return isOpenSellerLead(lead) && hasSellerContext(lead) && !hasCompletedSellerCall(lead) && !hasPendingFollowUp(lead);
}

function hasAcquisitionBottleneck(lead: StoredLead) {
  return isOpenSellerLead(lead) && (hasGovernanceStopSignal(lead) || hasMissingAcquisitionData(lead) || hasLeadDecayRisk(lead));
}

function getSellerPrioritySections(
  leads: StoredLead[],
  metrics: R53ManualRevenueMetricsResult,
): SellerPrioritySection[] {
  const values = metrics.metricValues;
  const governanceStopCount =
    values.governance_blocked_count || values.dnc_opt_out_blocked_leads || leads.filter(hasGovernanceStopSignal).length;
  const highPrioritySellerCount = leads.filter(hasHighPrioritySellerSignal).length;
  const urgencyCount = leads.filter(hasSellerUrgencySignal).length;
  const sellerMomentumCount = leads.filter(hasSellerMomentumRisk).length;
  const overdueFollowUpCount = values.manual_follow_ups_overdue || leads.filter(hasOverdueFollowUpSignal).length;
  const leadDecayCount = leads.filter(hasLeadDecayRisk).length;
  const highMotivationCount = leads.filter((lead) => hasSellerUrgencySignal(lead) || lead.priority === "High").length;
  const missingAcquisitionDataCount = values.missing_critical_data_count || leads.filter(hasMissingAcquisitionData).length;
  const bottleneckCount = leads.filter(hasAcquisitionBottleneck).length;
  const dailyPriorityCount =
    highPrioritySellerCount + urgencyCount + overdueFollowUpCount + leadDecayCount + missingAcquisitionDataCount;

  return [
    {
      title: "Governance stop signals",
      count: governanceStopCount,
      status: "Governance stop signals must be resolved first.",
      detail: "Do-not-contact, rejection, and human-review states stay ahead of seller priority guidance.",
    },
    {
      title: "Highest-priority seller review",
      count: highPrioritySellerCount,
      status: "High-priority seller review.",
      detail: "Priority reflects already-loaded lead signals and remains a manual review label.",
    },
    {
      title: "Daily seller call priorities",
      count: dailyPriorityCount,
      status: "Call priority label is advisory only.",
      detail: "Use this count to focus human review; it does not create calls, messages, campaigns, or workflows.",
    },
    {
      title: "Seller urgency review",
      count: urgencyCount,
      status: "Review seller context before taking action.",
      detail: "Urgency is an assumption from existing seller context and needs human verification.",
    },
    {
      title: "Seller momentum risk",
      count: sellerMomentumCount,
      status: "Manual call review recommended.",
      detail: "Seller context exists, but no completed call or pending follow-up is visible.",
    },
    {
      title: "Overdue seller follow-up",
      count: overdueFollowUpCount,
      status: "Seller follow-up priority.",
      detail: "Overdue follow-up is visibility only and does not dial, send, schedule, or persist anything.",
    },
    {
      title: "Lead decay risk",
      count: leadDecayCount,
      status: "Manual call review recommended.",
      detail: "Older open records without completed call context may need human triage.",
    },
    {
      title: "High-motivation seller review",
      count: highMotivationCount,
      status: "Review seller context before taking action.",
      detail: "Motivation signals are assumptions and cannot invent property or seller facts.",
    },
    {
      title: "Missing acquisition data",
      count: missingAcquisitionDataCount,
      status: "Missing acquisition data.",
      detail: "Source, phone, property, motivation, timeline, or next-step gaps require manual verification.",
    },
    {
      title: "Acquisition bottlenecks",
      count: bottleneckCount,
      status: "Manual next step guidance.",
      detail: "Bottleneck labels are advisory and do not assign work or change workflow state.",
    },
  ];
}

function getSellerPriorityTotal(sections: SellerPrioritySection[]) {
  return sections.reduce((total, section) => total + section.count, 0);
}

export function AcquisitionDailyCallPrioritySummary({
  leads,
  metrics,
}: AcquisitionDailyCallPrioritySummaryProps) {
  const sections = getSellerPrioritySections(leads, metrics);

  return (
    <section
      aria-labelledby="acquisition-daily-call-priority-heading"
      className="rounded-[1.5rem] border border-border bg-surface p-6"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">
            Acquisition daily call priority intelligence
          </p>
          <h2 id="acquisition-daily-call-priority-heading" className="text-xl font-semibold text-primary">
            Read-only seller priority summary
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-muted">
            Manual call review recommended. Call priority label is advisory only. No provider called, no message sent,
            no runtime execution.
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

      <div className="mt-5 grid gap-3 lg:grid-cols-5">
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

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Daily seller priority summary">
        <StatCard
          label="Seller priority signals"
          value={String(getSellerPriorityTotal(sections))}
          helper="Read-only seller review signals from existing dashboard data"
        />
        <StatCard
          label="Governance stops"
          value={String(sections[0]?.count ?? 0)}
          helper="Must be resolved first; no override control"
        />
        <StatCard
          label="Follow-up priority"
          value={String(sections[5]?.count ?? 0)}
          helper="Seller follow-up priority is advisory only"
        />
        <StatCard
          label="Missing data"
          value={String(sections[8]?.count ?? 0)}
          helper="Assumptions require manual verification"
        />
      </div>

      <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
        <h3 className="font-semibold text-blue-950">Manual call review guidance</h3>
        <p className="mt-1">
          Governance stop signals must be resolved first. Review seller context before taking action, then review
          highest-priority seller records, daily seller call priorities, seller urgency, seller momentum risk, overdue
          seller follow-up, lead decay risk, high-motivation seller review, missing acquisition data, and acquisition
          bottlenecks. Guidance is advisory text only and does not call, dial, send, persist, poll, activate providers,
          launch campaigns, negotiate, or execute workflows.
        </p>
      </div>
    </section>
  );
}
