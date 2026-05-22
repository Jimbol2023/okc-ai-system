import type { R53ManualRevenueMetricsResult } from "@/lib/r53-manual-revenue-metrics-helper";
import type { StoredLead } from "@/lib/leads-storage";
import { StatCard } from "@/components/shared/stat-card";

type LeadQualityIntelligenceSummaryProps = {
  leads: StoredLead[];
  metrics: R53ManualRevenueMetricsResult;
};

type LeadQualitySection = {
  title: string;
  count: number;
  status: string;
  detail: string;
};

const safetyBadges = ["Read-only", "Advisory-only", "Simulation-only", "No enrichment or skip tracing"];

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

function hasMissingContactOrAddress(lead: StoredLead) {
  return isOpenLead(lead) && (!lead.phone?.trim() || !lead.email?.trim() || !lead.propertyAddress?.trim());
}

function hasMissingSellerMotivation(lead: StoredLead) {
  return isOpenLead(lead) && !lead.situationDetails?.trim();
}

function hasMissingTimeline(lead: StoredLead) {
  return isOpenLead(lead) && !lead.nextFollowUpAt && !lead.followUps?.some((followUp) => followUp.status === "pending");
}

function hasMissingPropertyCondition(lead: StoredLead) {
  return isOpenLead(lead) && !lead.scoreBreakdown?.trim() && !lead.situationDetails?.toLowerCase().includes("repair");
}

function hasMissingArvRepairEstimate(lead: StoredLead) {
  return isOpenLead(lead) && (!lead.analyzer?.arv?.trim() || !lead.analyzer?.estimatedRepairs?.trim());
}

function hasDuplicateLeadSignal(lead: StoredLead, allLeads: StoredLead[]) {
  const address = lead.propertyAddress.trim().toLowerCase();
  const phone = lead.phone.trim().toLowerCase();
  if (!address && !phone) return false;

  return (
    allLeads.filter(
      (candidate) =>
        (address && candidate.propertyAddress.trim().toLowerCase() === address) ||
        (phone && candidate.phone.trim().toLowerCase() === phone),
    ).length > 1
  );
}

function hasStaleLeadQuality(lead: StoredLead) {
  const createdAt = new Date(lead.timestamp);
  const createdTime = createdAt.getTime();

  return isOpenLead(lead) && !Number.isNaN(createdTime) && Date.now() - createdTime > 1000 * 60 * 60 * 24 * 21;
}

function hasLowConfidenceLead(lead: StoredLead) {
  return isOpenLead(lead) && (lead.score < 40 || lead.opportunityScore === "Low");
}

function hasAcquisitionReadinessGap(lead: StoredLead) {
  return (
    hasMissingContactOrAddress(lead) ||
    hasMissingSellerMotivation(lead) ||
    hasMissingTimeline(lead) ||
    hasMissingPropertyCondition(lead)
  );
}

function hasDispositionReadinessGap(lead: StoredLead) {
  return isOpenLead(lead) && (!lead.propertyAddress?.trim() || !lead.analyzer?.arv?.trim() || !lead.analyzer?.estimatedRepairs?.trim());
}

function hasRevenueRisk(lead: StoredLead) {
  return isOpenLead(lead) && (hasGovernanceStopSignal(lead) || hasAcquisitionReadinessGap(lead) || hasDispositionReadinessGap(lead));
}

function getLeadQualitySections(leads: StoredLead[], metrics: R53ManualRevenueMetricsResult): LeadQualitySection[] {
  const governanceStopCount =
    metrics.metricValues.governance_blocked_count ||
    metrics.metricValues.dnc_opt_out_blocked_leads ||
    leads.filter(hasGovernanceStopSignal).length;
  const incompleteDataCount =
    metrics.metricValues.missing_critical_data_count ||
    leads.filter((lead) => hasMissingContactOrAddress(lead) || hasMissingSellerMotivation(lead) || hasMissingTimeline(lead)).length;
  const duplicateCount = leads.filter((lead) => hasDuplicateLeadSignal(lead, leads)).length;
  const staleCount = leads.filter(hasStaleLeadQuality).length;
  const lowConfidenceCount = leads.filter(hasLowConfidenceLead).length;
  const acquisitionGapCount = leads.filter(hasAcquisitionReadinessGap).length;
  const dispositionGapCount = leads.filter(hasDispositionReadinessGap).length;
  const revenueRiskCount = leads.filter(hasRevenueRisk).length;

  return [
    {
      title: "Governance stop visibility",
      count: governanceStopCount,
      status: "Governance stop signals must be resolved first.",
      detail: "Stop signals outrank lead quality score, revenue opportunity, data completeness, acquisition readiness, disposition readiness, follow-up urgency, and workload pressure.",
    },
    {
      title: "Incomplete lead data visibility",
      count: incompleteDataCount,
      status: "Manual lead quality review recommended.",
      detail: "Incomplete data visibility is advisory only and cannot enrich, contact, assign, reject, route, persist, or execute workflows.",
    },
    {
      title: "Missing contact or address",
      count: leads.filter(hasMissingContactOrAddress).length,
      status: "Manual data cleanup priority.",
      detail: "Missing phone, email, or address labels do not activate external lookups, provider validation, enrichment, or tracing services.",
    },
    {
      title: "Missing seller motivation",
      count: leads.filter(hasMissingSellerMotivation).length,
      status: "Review lead data before taking action.",
      detail: "Seller motivation visibility supports manual review and does not contact sellers or launch follow-up.",
    },
    {
      title: "Missing timeline",
      count: leads.filter(hasMissingTimeline).length,
      status: "Seller follow-up readiness needs review.",
      detail: "Timeline visibility does not create tasks, assign leads automatically, route work automatically, send messages, or call anyone.",
    },
    {
      title: "Missing ARV or repairs",
      count: leads.filter(hasMissingArvRepairEstimate).length,
      status: "Disposition-readiness data needs review.",
      detail: "ARV and repair gaps are read-only quality labels and cannot generate offers or activate workflows.",
    },
    {
      title: "Duplicate lead visibility",
      count: duplicateCount,
      status: "Human verification required before workflow action.",
      detail: "Duplicate visibility cannot merge, delete, reject, mutate, enrich, or route lead records.",
    },
    {
      title: "Stale lead quality review",
      count: staleCount,
      status: "Operator attention may be warranted.",
      detail: "Stale lead quality review does not launch follow-up automatically, campaigns, SMS, email, calls, enrichment, or tracing services.",
    },
    {
      title: "Low-confidence lead review",
      count: lowConfidenceCount,
      status: "Lead quality priority label is advisory only.",
      detail: "Low-confidence visibility cannot reject leads automatically or qualify leads for execution.",
    },
    {
      title: "Revenue risk visibility",
      count: revenueRiskCount,
      status: "Revenue risk should be reviewed manually.",
      detail: "Revenue-risk visibility does not contact sellers or buyers, enrich data, activate provider systems, launch campaigns, or execute workflows.",
    },
  ];
}

function getTotal(sections: LeadQualitySection[]) {
  return sections.reduce((total, section) => total + section.count, 0);
}

export function LeadQualityIntelligenceSummary({ leads, metrics }: LeadQualityIntelligenceSummaryProps) {
  const sections = getLeadQualitySections(leads, metrics);

  return (
    <section
      aria-labelledby="lead-quality-intelligence-heading"
      aria-describedby="lead-quality-intelligence-summary"
      className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6"
    >
      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">Lead quality intelligence</p>
          <h2 id="lead-quality-intelligence-heading" className="break-words text-xl font-semibold text-primary">
            Read-only lead quality priority summary
          </h2>
          <p id="lead-quality-intelligence-summary" className="max-w-3xl break-words text-sm leading-6 text-muted">
            Manual lead quality review recommended. Lead quality priority label is advisory only. Review lead data before
            taking action. Governance stop signals must be resolved first.
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

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Lead quality summary">
        <StatCard label="Quality review signals" value={String(getTotal(sections))} helper="Read-only review labels" />
        <StatCard label="Governance stops" value={String(sections[0]?.count ?? 0)} helper="Resolved first" />
        <StatCard label="Incomplete data" value={String(sections[1]?.count ?? 0)} helper="Manual cleanup" />
        <StatCard label="Revenue risk" value={String(sections[9]?.count ?? 0)} helper="Review manually" />
      </div>

      <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
        <h3 className="break-words font-semibold text-blue-950">Human-only lead quality guidance</h3>
        <p className="mt-1 break-words">
          Review governance stops first, then incomplete lead data, missing contact or address, missing seller
          motivation, missing timeline, missing ARV or repair estimates, duplicate lead visibility, stale lead quality,
          low-confidence lead review, and revenue risk. This is advisory text only and does not create enrichment,
          tracing services, external lookups, outbound communication, provider systems, campaigns, persistence,
          polling, runtime activation, autonomous qualification, autonomous routing, or execution controls.
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
