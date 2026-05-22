import type { R53ManualRevenueMetricsResult } from "@/lib/r53-manual-revenue-metrics-helper";
import type { StoredLead } from "@/lib/leads-storage";
import { StatCard } from "@/components/shared/stat-card";

type BuyerReadyDispositionPrioritySummaryProps = {
  leads: StoredLead[];
  metrics: R53ManualRevenueMetricsResult;
};

type PackageGapKey = "assignment" | "title" | "photos" | "repair" | "arv" | "rent" | "strategy";

type PrioritySection = {
  title: string;
  count: number;
  status: string;
  detail: string;
};

const safetyBadges = ["Read-only", "Advisory-only", "Simulation-only", "No send controls"];

const packageGapLabels: Record<PackageGapKey, string> = {
  assignment: "Assignment data",
  title: "Title data",
  photos: "Photo data",
  repair: "Repair data",
  arv: "ARV data",
  rent: "Rent data",
  strategy: "Strategy data",
};

function normalizeText(value?: string | null) {
  return value?.trim().toLowerCase() ?? "";
}

function hasAny(value: string, terms: string[]) {
  return terms.some((term) => value.includes(term));
}

function hasGovernanceStopSignal(lead: StoredLead) {
  return (
    lead.doNotContact === true ||
    lead.requiresHumanApproval === true ||
    lead.approvalStatus === "needs_human_review" ||
    lead.approvalStatus === "rejected"
  );
}

function isBuyerReadyPriority(lead: StoredLead) {
  return lead.status === "under_contract" || lead.approvalStatus === "approved_for_outreach";
}

function getLeadContext(lead: StoredLead) {
  return normalizeText(
    [
      lead.situationDetails,
      lead.latestApprovalNote,
      lead.lastSellerReply,
      lead.scoreBreakdown,
      lead.source,
    ]
      .filter(Boolean)
      .join(" "),
  );
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

function hasBuyerFitReviewSignal(lead: StoredLead) {
  const context = getLeadContext(lead);

  return (
    isBuyerReadyPriority(lead) ||
    lead.priority === "High" ||
    lead.opportunityScore === "High" ||
    hasAny(context, ["buyer", "cash", "investor", "wholesale", "assignment", "rental", "flip"])
  );
}

function hasDemandAlignmentReviewSignal(lead: StoredLead) {
  const context = getLeadContext(lead);

  return hasAny(context, ["okc", "oklahoma", "buyer", "cash", "rental", "rent", "flip", "rehab", "arv", "repair"]);
}

function isNearBuyerReadyReview(lead: StoredLead) {
  return !hasGovernanceStopSignal(lead) && hasBuyerFitReviewSignal(lead) && getPackageGaps(lead).length <= 3;
}

function isReadyToPackageDeal(lead: StoredLead) {
  return !hasGovernanceStopSignal(lead) && isBuyerReadyPriority(lead) && getPackageGaps(lead).length <= 2;
}

function hasDispositionBottleneck(lead: StoredLead) {
  return hasGovernanceStopSignal(lead) || getPackageGaps(lead).length >= 4 || !hasBuyerFitReviewSignal(lead);
}

function hasHighProbabilityBuyerReview(lead: StoredLead) {
  return !hasGovernanceStopSignal(lead) && hasBuyerFitReviewSignal(lead) && hasDemandAlignmentReviewSignal(lead);
}

function countPackageGap(leads: StoredLead[], gap: PackageGapKey) {
  return leads.filter((lead) => getPackageGaps(lead).includes(gap)).length;
}

function getPrioritySections(leads: StoredLead[], metrics: R53ManualRevenueMetricsResult): PrioritySection[] {
  const governanceStopCount =
    metrics.metricValues.governance_blocked_count ||
    metrics.metricValues.dnc_opt_out_blocked_leads ||
    leads.filter(hasGovernanceStopSignal).length;
  const buyerReadyCount = metrics.metricValues.buyer_ready_leads || leads.filter(isBuyerReadyPriority).length;
  const incompletePackageCount =
    metrics.metricValues.incomplete_buyer_packages || leads.filter((lead) => getPackageGaps(lead).length > 0).length;
  const bottleneckCount = leads.filter(hasDispositionBottleneck).length;

  return [
    {
      title: "Governance stop signals",
      count: governanceStopCount,
      status: "Governance stop signals must be resolved first.",
      detail: "Stop signals outrank buyer-ready, package-prep, buyer-fit, demand alignment, and bottleneck labels.",
    },
    {
      title: "Buyer-ready disposition priority",
      count: buyerReadyCount,
      status: "Buyer-ready label is advisory only.",
      detail: "Buyer-ready does not mean send. Review buyer package before taking action.",
    },
    {
      title: "Near-buyer-ready review",
      count: leads.filter(isNearBuyerReadyReview).length,
      status: "Manual disposition review recommended.",
      detail: "Remaining package or fit gaps require human review before any buyer-facing action outside this dashboard.",
    },
    {
      title: "Ready-to-package deal",
      count: leads.filter(isReadyToPackageDeal).length,
      status: "Package-prep priority.",
      detail: "Ready-to-package means operator package-prep guidance only; it does not release a package.",
    },
    {
      title: "Incomplete buyer package",
      count: incompletePackageCount,
      status: "Review buyer package before taking action.",
      detail: "Missing assignment, title, photos, repair, ARV, rent, or strategy data must be verified manually.",
    },
    {
      title: "Buyer-fit review needed",
      count: leads.filter(hasBuyerFitReviewSignal).length,
      status: "Buyer-fit review needed.",
      detail: "Buyer-fit is a manual review label and does not match, contact, negotiate, or send automatically.",
    },
    {
      title: "Buyer demand alignment review",
      count: leads.filter(hasDemandAlignmentReviewSignal).length,
      status: "Manual disposition review recommended.",
      detail: "Demand alignment is advisory only and depends on already-visible lead context.",
    },
    {
      title: "High-probability buyer review",
      count: leads.filter(hasHighProbabilityBuyerReview).length,
      status: "Manual disposition review recommended.",
      detail: "High-probability buyer review is a priority label, not a buyer contact instruction.",
    },
    {
      title: "Disposition bottleneck",
      count: bottleneckCount,
      status: "Manual disposition review recommended.",
      detail: "Package, fit, data, or governance friction remains review-only and does not change workflow state.",
    },
    {
      title: "Blocked buyer disposition",
      count: governanceStopCount + leads.filter((lead) => !hasGovernanceStopSignal(lead) && getPackageGaps(lead).length >= 5).length,
      status: "Governance stop signals must be resolved first.",
      detail: "Blocked buyer disposition remains review-only and cannot approve any buyer-facing action.",
    },
  ];
}

function getPriorityTotal(sections: PrioritySection[]) {
  return sections.reduce((total, section) => total + section.count, 0);
}

export function BuyerReadyDispositionPrioritySummary({
  leads,
  metrics,
}: BuyerReadyDispositionPrioritySummaryProps) {
  const sections = getPrioritySections(leads, metrics);
  const packageGaps = (Object.keys(packageGapLabels) as PackageGapKey[]).map((gap) => ({
    gap,
    label: packageGapLabels[gap],
    count: countPackageGap(leads, gap),
  }));

  return (
    <section
      aria-labelledby="buyer-ready-disposition-priority-heading"
      aria-describedby="buyer-ready-disposition-priority-summary"
      className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6"
    >
      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">
            Buyer-ready disposition priority intelligence
          </p>
          <h2 id="buyer-ready-disposition-priority-heading" className="break-words text-xl font-semibold text-primary">
            Read-only buyer-ready priority summary
          </h2>
          <p id="buyer-ready-disposition-priority-summary" className="max-w-3xl break-words text-sm leading-6 text-muted">
            Manual disposition review recommended. Buyer-ready label is advisory only. Buyer-ready does not mean send.
            Review buyer package before taking action.
          </p>
        </div>
        <div className="flex max-w-full flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.1em]">
          {safetyBadges.map((badge) => (
            <span key={badge} className="max-w-full break-words rounded-full border border-border bg-white px-3 py-1 text-center leading-5 text-primary">
              {badge}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
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

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Buyer-ready disposition summary">
        <StatCard
          label="Priority signals"
          value={String(getPriorityTotal(sections))}
          helper="Read-only buyer disposition review labels"
        />
        <StatCard
          label="Governance stops"
          value={String(sections[0]?.count ?? 0)}
          helper="Resolved first; no override control"
        />
        <StatCard
          label="Package-prep priority"
          value={String(sections[3]?.count ?? 0)}
          helper="Operator package-prep guidance only"
        />
        <StatCard
          label="Buyer-fit reviews"
          value={String(sections[5]?.count ?? 0)}
          helper="Buyer-fit review needed before action"
        />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7" aria-label="Missing buyer package data">
        {packageGaps.map((item) => (
          <article key={item.gap} className="min-w-0 rounded-2xl border border-border bg-white p-4">
            <h3 className="break-words text-sm font-semibold text-primary">{item.label}</h3>
            <p className="mt-2 text-2xl font-semibold text-primary">{item.count}</p>
            <p className="mt-1 break-words text-sm leading-6 text-muted">Missing package data requires manual verification.</p>
          </article>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
        <h3 className="break-words font-semibold text-blue-950">Operator package-prep guidance</h3>
        <p className="mt-1 break-words">
          Governance stop signals must be resolved first. Then review buyer-ready disposition priority,
          near-buyer-ready review, ready-to-package deal labels, incomplete buyer package gaps, buyer-fit review
          needed, buyer demand alignment review, high-probability buyer review, disposition bottlenecks, and blocked
          buyer disposition. Guidance is advisory text only and does not create buyer-facing action, use communication
          systems, persist, poll, negotiate, or execute workflows.
        </p>
      </div>

      <div className="mt-4 flex max-w-full flex-wrap gap-2 text-xs font-bold">
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">readOnly:true</span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">advisoryOnly:true</span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">simulationOnly:true</span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">providerCalled:false</span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">sent:false</span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          persistenceAllowedNow:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">pollingAllowed:false</span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          runtimeActivationAllowed:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          providerActivationAllowed:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          approvalGrantsExecution:false
        </span>
      </div>
    </section>
  );
}
