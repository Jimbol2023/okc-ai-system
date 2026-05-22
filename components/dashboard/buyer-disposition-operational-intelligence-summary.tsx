import type { R53ManualRevenueMetricsResult } from "@/lib/r53-manual-revenue-metrics-helper";
import type { StoredLead } from "@/lib/leads-storage";
import { StatCard } from "@/components/shared/stat-card";

type BuyerDispositionOperationalIntelligenceSummaryProps = {
  leads: StoredLead[];
  metrics: R53ManualRevenueMetricsResult;
};

type OperationalSection = {
  title: string;
  count: number;
  status: string;
  detail: string;
};

type PackageGapKey = "assignment" | "title" | "photos" | "repair" | "arv" | "rent" | "strategy";

const safetyBadges = ["Read-only", "Advisory-only", "Simulation-only", "No execution controls"];

function normalizeText(value?: string | null) {
  return value?.trim().toLowerCase() ?? "";
}

function hasAny(value: string, terms: string[]) {
  return terms.some((term) => value.includes(term));
}

function getLeadContext(lead: StoredLead) {
  return normalizeText(
    [
      lead.situationDetails,
      lead.latestApprovalNote,
      lead.lastSellerReply,
      lead.scoreBreakdown,
      lead.source,
      lead.propertyAddress,
      lead.county,
    ]
      .filter(Boolean)
      .join(" "),
  );
}

function hasGovernanceStopSignal(lead: StoredLead) {
  return (
    lead.doNotContact === true ||
    lead.requiresHumanApproval === true ||
    lead.approvalStatus === "needs_human_review" ||
    lead.approvalStatus === "rejected"
  );
}

function isDispositionCandidate(lead: StoredLead) {
  return lead.status === "under_contract" || lead.status === "closed" || lead.approvalStatus === "approved_for_outreach";
}

function hasHighPriorityRevenueSignal(lead: StoredLead) {
  return lead.priority === "High" || lead.opportunityScore === "High" || lead.isHot === true;
}

function getPackageGaps(lead: StoredLead): PackageGapKey[] {
  const context = getLeadContext(lead);
  const gaps: PackageGapKey[] = [];

  if (lead.status !== "under_contract" && lead.status !== "closed") gaps.push("assignment");
  if (!lead.parcelId?.trim() && !lead.county?.trim()) gaps.push("title");
  gaps.push("photos");
  if (!lead.analyzer?.estimatedRepairs?.trim() && !hasAny(context, ["repair", "rehab", "renovation", "as-is", "as is"])) {
    gaps.push("repair");
  }
  if (!lead.analyzer?.arv?.trim()) gaps.push("arv");
  if (!hasAny(context, ["rent", "rental", "tenant", "cashflow", "cash flow"])) gaps.push("rent");
  if (!hasAny(context, ["wholesale", "assignment", "flip", "rental", "brrrr", "hold", "strategy"])) {
    gaps.push("strategy");
  }

  return gaps;
}

function hasBuyerEngagementSignal(lead: StoredLead) {
  const context = getLeadContext(lead);

  return hasAny(context, ["buyer", "cash", "investor", "rental", "flip", "wholesale", "assignment"]);
}

function hasBuyerDemandSignal(lead: StoredLead) {
  const context = getLeadContext(lead);

  return hasAny(context, ["okc", "oklahoma", "rental", "rent", "tenant", "flip", "rehab", "arv", "cash flow"]);
}

function hasDemandMismatchSignal(lead: StoredLead) {
  return hasBuyerEngagementSignal(lead) && !hasBuyerDemandSignal(lead);
}

function hasStaleDealSignal(lead: StoredLead) {
  const createdAt = new Date(lead.timestamp);
  const createdTime = createdAt.getTime();
  const isOlderOpenDeal = !Number.isNaN(createdTime) && Date.now() - createdTime > 1000 * 60 * 60 * 24 * 21;

  return isOlderOpenDeal && lead.status !== "closed";
}

function hasAssignmentMomentumSignal(lead: StoredLead) {
  return !hasGovernanceStopSignal(lead) && isDispositionCandidate(lead) && getPackageGaps(lead).length <= 3;
}

function hasHighLikelihoodAssignmentReview(lead: StoredLead) {
  return (
    !hasGovernanceStopSignal(lead) &&
    (isDispositionCandidate(lead) || hasHighPriorityRevenueSignal(lead)) &&
    hasBuyerEngagementSignal(lead) &&
    getPackageGaps(lead).length <= 3
  );
}

function hasDispositionBottleneck(lead: StoredLead) {
  return hasGovernanceStopSignal(lead) || getPackageGaps(lead).length >= 4 || hasDemandMismatchSignal(lead);
}

function getOperationalSections(
  leads: StoredLead[],
  metrics: R53ManualRevenueMetricsResult,
): OperationalSection[] {
  const values = metrics.metricValues;
  const governanceStopCount =
    values.governance_blocked_count || values.dnc_opt_out_blocked_leads || leads.filter(hasGovernanceStopSignal).length;
  const incompletePackageCount =
    values.incomplete_buyer_packages || leads.filter((lead) => getPackageGaps(lead).length > 0).length;
  const staleDealCount = leads.filter(hasStaleDealSignal).length;
  const highLikelihoodAssignmentCount = leads.filter(hasHighLikelihoodAssignmentReview).length;
  const buyerEngagementCount = leads.filter(hasBuyerEngagementSignal).length;
  const demandMismatchCount = leads.filter(hasDemandMismatchSignal).length;
  const bottleneckCount = leads.filter(hasDispositionBottleneck).length;
  const workloadPriorityCount = leads.filter(
    (lead) => !hasGovernanceStopSignal(lead) && (hasHighPriorityRevenueSignal(lead) || hasStaleDealSignal(lead)),
  ).length;

  return [
    {
      title: "Governance stop signals",
      count: governanceStopCount,
      status: "Governance stop signals must be resolved first.",
      detail: "Stop signals outrank revenue priority, assignment readiness, buyer engagement, stale-deal, and workload labels.",
    },
    {
      title: "Revenue-priority disposition review",
      count: workloadPriorityCount,
      status: "Disposition priority label is advisory only.",
      detail: "Revenue priority helps focus manual review and does not create buyer-facing action.",
    },
    {
      title: "High-likelihood assignment review",
      count: highLikelihoodAssignmentCount,
      status: "High assignment probability does not mean send.",
      detail: "Assignment probability is a manual review label based on already-visible deal context.",
    },
    {
      title: "Assignment-readiness review",
      count: leads.filter(hasAssignmentMomentumSignal).length,
      status: "Assignment-readiness review needed.",
      detail: "Assignment readiness and momentum are advisory only and do not queue or execute disposition work.",
    },
    {
      title: "Buyer package completeness review",
      count: incompletePackageCount,
      status: "Package-prep priority.",
      detail: "Missing package data must be verified manually before any operator action outside this dashboard.",
    },
    {
      title: "Stale buyer package",
      count: leads.filter((lead) => getPackageGaps(lead).length > 0 && hasStaleDealSignal(lead)).length,
      status: "Manual disposition review recommended.",
      detail: "Stale package visibility does not launch reactivation, outreach, or campaign activity.",
    },
    {
      title: "Stale deal visibility",
      count: staleDealCount,
      status: "Manual disposition review recommended.",
      detail: "Stale-deal visibility is operator guidance only and does not mutate workflow state.",
    },
    {
      title: "Buyer engagement review",
      count: buyerEngagementCount,
      status: "Buyer engagement review needed.",
      detail: "Engagement quality and response probability are review labels and do not authorize contact.",
    },
    {
      title: "Buyer demand mismatch",
      count: demandMismatchCount,
      status: "Review buyer context before taking action.",
      detail: "Demand mismatch is advisory visibility and does not perform autonomous matching.",
    },
    {
      title: "Disposition bottleneck",
      count: bottleneckCount,
      status: "Manual disposition review recommended.",
      detail: "Bottlenecks remain read-only and do not assign work, persist state, poll, or activate providers.",
    },
    {
      title: "Blocked disposition",
      count: governanceStopCount + leads.filter((lead) => !hasGovernanceStopSignal(lead) && getPackageGaps(lead).length >= 5).length,
      status: "Governance stop signals must be resolved first.",
      detail: "Blocked disposition is review-only stop visibility and cannot approve any buyer-facing action.",
    },
  ];
}

function getOperationalSignalTotal(sections: OperationalSection[]) {
  return sections.reduce((total, section) => total + section.count, 0);
}

export function BuyerDispositionOperationalIntelligenceSummary({
  leads,
  metrics,
}: BuyerDispositionOperationalIntelligenceSummaryProps) {
  const sections = getOperationalSections(leads, metrics);

  return (
    <section
      aria-labelledby="buyer-disposition-operational-intelligence-heading"
      aria-describedby="buyer-disposition-operational-intelligence-summary"
      className="rounded-[1.5rem] border border-border bg-surface p-6"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">
            Buyer disposition operational intelligence
          </p>
          <h2 id="buyer-disposition-operational-intelligence-heading" className="text-xl font-semibold text-primary">
            Read-only disposition operations summary
          </h2>
          <p id="buyer-disposition-operational-intelligence-summary" className="max-w-3xl text-sm leading-6 text-muted">
            Manual disposition review recommended. Disposition priority label is advisory only. Review buyer context
            before taking action. High assignment probability does not mean send.
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

      <div className="mt-5 grid gap-3 lg:grid-cols-4">
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

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Buyer disposition operational summary">
        <StatCard
          label="Operational signals"
          value={String(getOperationalSignalTotal(sections))}
          helper="Read-only disposition review labels"
        />
        <StatCard
          label="Governance stops"
          value={String(sections[0]?.count ?? 0)}
          helper="Resolved first; no override control"
        />
        <StatCard
          label="High assignment review"
          value={String(sections[2]?.count ?? 0)}
          helper="Review label only"
        />
        <StatCard
          label="Disposition bottlenecks"
          value={String(sections[9]?.count ?? 0)}
          helper="Read-only bottleneck visibility"
        />
      </div>

      <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
        <h3 className="font-semibold text-blue-950">Operator disposition workflow guidance</h3>
        <p className="mt-1">
          Governance stop signals must be resolved first. Then review revenue-priority disposition, high-likelihood
          assignment, assignment readiness, buyer package completeness, stale buyer package, stale deal visibility, buyer
          engagement, buyer demand mismatch, disposition bottlenecks, blocked disposition, and workload priority. This is
          advisory text only and does not create buyer communication, provider activation, persistence, polling,
          autonomous matching, autonomous negotiation, or execution controls.
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
        <span className="rounded border border-blue-200 bg-white px-2 py-1 text-blue-950">readOnly:true</span>
        <span className="rounded border border-blue-200 bg-white px-2 py-1 text-blue-950">advisoryOnly:true</span>
        <span className="rounded border border-blue-200 bg-white px-2 py-1 text-blue-950">simulationOnly:true</span>
        <span className="rounded border border-blue-200 bg-white px-2 py-1 text-blue-950">providerCalled:false</span>
        <span className="rounded border border-blue-200 bg-white px-2 py-1 text-blue-950">sent:false</span>
        <span className="rounded border border-blue-200 bg-white px-2 py-1 text-blue-950">
          persistenceAllowedNow:false
        </span>
        <span className="rounded border border-blue-200 bg-white px-2 py-1 text-blue-950">pollingAllowed:false</span>
        <span className="rounded border border-blue-200 bg-white px-2 py-1 text-blue-950">
          runtimeActivationAllowed:false
        </span>
        <span className="rounded border border-blue-200 bg-white px-2 py-1 text-blue-950">
          providerActivationAllowed:false
        </span>
        <span className="rounded border border-blue-200 bg-white px-2 py-1 text-blue-950">
          approvalGrantsExecution:false
        </span>
      </div>
    </section>
  );
}
