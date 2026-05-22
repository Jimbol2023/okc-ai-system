import type { R53ManualRevenueMetricsResult } from "@/lib/r53-manual-revenue-metrics-helper";
import { getActiveDistressFlags } from "@/lib/distress-flags";
import type { StoredLead } from "@/lib/leads-storage";
import { StatCard } from "@/components/shared/stat-card";

type DrivingForDollarsIntelligenceSummaryProps = {
  leads: StoredLead[];
  metrics: R53ManualRevenueMetricsResult;
};

type PropertyReviewSection = {
  title: string;
  count: number;
  status: string;
  detail: string;
};

const safetyBadges = ["Read-only", "Advisory-only", "Simulation-only", "No GPS, scraping, or outreach"];

function isOpenLead(lead: StoredLead) {
  return lead.status !== "closed";
}

function hasGovernanceStopSignal(lead: StoredLead) {
  return (
    lead.doNotContact === true ||
    lead.requiresHumanApproval === true ||
    lead.approvalStatus === "needs_human_review" ||
    lead.approvalStatus === "rejected"
  );
}

function activeDistressCount(lead: StoredLead) {
  return getActiveDistressFlags(lead.distressFlags).length;
}

function hasDistressVisibility(lead: StoredLead) {
  return isOpenLead(lead) && activeDistressCount(lead) > 0;
}

function hasVacancySignal(lead: StoredLead) {
  return isOpenLead(lead) && lead.distressFlags.vacantProperty === true;
}

function hasRepairSignal(lead: StoredLead) {
  return isOpenLead(lead) && lead.distressFlags.majorRepairs === true;
}

function hasOwnershipResearchNeed(lead: StoredLead) {
  return isOpenLead(lead) && (!lead.ownerName?.trim() || !lead.mailingAddress?.trim() || !lead.parcelId?.trim());
}

function hasIncompletePropertyData(lead: StoredLead) {
  return (
    isOpenLead(lead) &&
    (!lead.source?.trim() ||
      !lead.propertyAddress?.trim() ||
      !lead.city?.trim() ||
      !lead.state?.trim() ||
      !lead.zipCode?.trim() ||
      !lead.situationDetails?.trim())
  );
}

function hasStaleFieldObservation(lead: StoredLead) {
  const createdAt = new Date(lead.timestamp);
  const createdTime = createdAt.getTime();

  return isOpenLead(lead) && !Number.isNaN(createdTime) && Date.now() - createdTime > 1000 * 60 * 60 * 24 * 21;
}

function hasRevenuePotential(lead: StoredLead) {
  return isOpenLead(lead) && (lead.priority === "High" || lead.opportunityScore === "High" || lead.isHot === true);
}

function hasDuplicateReviewSignal(lead: StoredLead, allLeads: StoredLead[]) {
  const address = lead.propertyAddress.trim().toLowerCase();
  if (!address) return false;

  return allLeads.filter((candidate) => candidate.propertyAddress.trim().toLowerCase() === address).length > 1;
}

function getPropertyReviewSections(
  leads: StoredLead[],
  metrics: R53ManualRevenueMetricsResult,
): PropertyReviewSection[] {
  const governanceStopCount =
    metrics.metricValues.governance_blocked_count ||
    metrics.metricValues.dnc_opt_out_blocked_leads ||
    leads.filter(hasGovernanceStopSignal).length;
  const distressCount = leads.filter(hasDistressVisibility).length;
  const incompleteCount = metrics.metricValues.missing_critical_data_count || leads.filter(hasIncompletePropertyData).length;
  const staleCount = leads.filter(hasStaleFieldObservation).length;
  const revenuePotentialCount = leads.filter(hasRevenuePotential).length;
  const ownershipResearchCount = leads.filter(hasOwnershipResearchNeed).length;
  const duplicateCount = leads.filter((lead) => hasDuplicateReviewSignal(lead, leads)).length;
  const acquisitionBottleneckCount = new Set(
    leads
      .filter((lead) => hasGovernanceStopSignal(lead) || hasIncompletePropertyData(lead) || hasOwnershipResearchNeed(lead))
      .map((lead) => lead.id),
  ).size;

  return [
    {
      title: "Governance stop visibility",
      count: governanceStopCount,
      status: "Governance stop signals must be resolved first.",
      detail: "Stop signals outrank distress visibility, revenue opportunity, stale-property urgency, acquisition momentum, workload pressure, and neighborhood opportunity visibility.",
    },
    {
      title: "Manual property review priority",
      count: revenuePotentialCount + distressCount + staleCount,
      status: "Manual property review recommended.",
      detail: "Driving-for-dollars priority label is advisory only and does not contact owners, send communication, route drivers, or activate providers.",
    },
    {
      title: "Visible distress signal review",
      count: distressCount,
      status: "Review property context before taking action.",
      detail: "Distress visibility is based on stored lead signals only and cannot infer owner intent or invent property facts.",
    },
    {
      title: "Vacancy signal visibility",
      count: leads.filter(hasVacancySignal).length,
      status: "Human verification required before acquisition action.",
      detail: "Vacancy visibility is a review signal only and does not trigger skip tracing, scraping, mailers, calls, SMS, or email.",
    },
    {
      title: "Deferred maintenance review",
      count: leads.filter(hasRepairSignal).length,
      status: "Property condition review needed.",
      detail: "Repair visibility helps prioritize manual review and cannot generate offers or negotiate.",
    },
    {
      title: "Ownership research needed",
      count: ownershipResearchCount,
      status: "Ownership research remains manual.",
      detail: "Ownership research needed does not run owner-data scraping, phone-number collection, tracing services, or owner contact.",
    },
    {
      title: "Stale field observation review",
      count: staleCount,
      status: "Field observation quality should be reviewed.",
      detail: "Stale-property visibility is advisory only and does not auto-refresh, poll, route operators, or launch outreach.",
    },
    {
      title: "Incomplete property data visibility",
      count: incompleteCount,
      status: "Lead quality should be checked before action.",
      detail: "Incomplete property data must be resolved by human review before relying on acquisition guidance.",
    },
    {
      title: "Duplicate property review",
      count: duplicateCount,
      status: "Duplicate property review needed.",
      detail: "Duplicate visibility is a quality signal only and cannot merge, persist, delete, or mutate records.",
    },
    {
      title: "Acquisition bottleneck visibility",
      count: acquisitionBottleneckCount,
      status: "Acquisition review may deserve prioritization.",
      detail: "Bottleneck visibility does not execute acquisition workflow, escalate approval, or automate lead generation.",
    },
  ];
}

function getTotal(sections: PropertyReviewSection[]) {
  return sections.reduce((total, section) => total + section.count, 0);
}

export function DrivingForDollarsIntelligenceSummary({
  leads,
  metrics,
}: DrivingForDollarsIntelligenceSummaryProps) {
  const sections = getPropertyReviewSections(leads, metrics);

  return (
    <section
      aria-labelledby="driving-for-dollars-intelligence-heading"
      aria-describedby="driving-for-dollars-intelligence-summary"
      className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6"
    >
      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">
            Driving-for-dollars intelligence
          </p>
          <h2 id="driving-for-dollars-intelligence-heading" className="break-words text-xl font-semibold text-primary">
            Read-only property review priority summary
          </h2>
          <p id="driving-for-dollars-intelligence-summary" className="max-w-3xl break-words text-sm leading-6 text-muted">
            Manual property review recommended. Driving-for-dollars priority label is advisory only. Review property
            context before taking action. Governance stop signals must be resolved first.
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

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
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

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Driving-for-dollars summary">
        <StatCard label="Property review signals" value={String(getTotal(sections))} helper="Read-only review labels" />
        <StatCard label="Governance stops" value={String(sections[0]?.count ?? 0)} helper="Resolved first" />
        <StatCard label="Distress visibility" value={String(sections[2]?.count ?? 0)} helper="Human verification" />
        <StatCard label="Acquisition bottlenecks" value={String(sections[9]?.count ?? 0)} helper="Manual review only" />
      </div>

      <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
        <h3 className="break-words font-semibold text-blue-950">Human-only property review guidance</h3>
        <p className="mt-1 break-words">
          Review governance stops first, then manual property review priority, distress visibility, vacancy signals,
          deferred maintenance, ownership research, stale observations, incomplete property data, duplicate property
          review, and acquisition bottlenecks. This is advisory text only and does not create owner contact, outbound
          communication, map or GPS systems, data scraping, tracing services, provider systems, campaigns, persistence,
          polling, runtime activation, autonomous property targeting, autonomous routing, or execution controls.
        </p>
      </div>

      <div className="mt-4 flex max-w-full flex-wrap gap-2 text-xs font-bold">
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">readOnly:true</span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">advisoryOnly:true</span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">simulationOnly:true</span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">providerCalled:false</span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">sent:false</span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">pollingAllowed:false</span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          runtimeActivationAllowed:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          approvalGrantsExecution:false
        </span>
      </div>
    </section>
  );
}
