import type { R53ManualRevenueMetricsResult } from "@/lib/r53-manual-revenue-metrics-helper";
import type { StoredLead } from "@/lib/leads-storage";
import { StatCard } from "@/components/shared/stat-card";

type OperatorWorkQueueIntelligenceSummaryProps = {
  leads: StoredLead[];
  metrics: R53ManualRevenueMetricsResult;
};

type WorkloadSection = {
  title: string;
  count: number;
  status: string;
  detail: string;
};

const safetyBadges = ["Read-only", "Advisory-only", "Simulation-only", "No execution controls"];

function getFollowUps(lead: StoredLead) {
  return Array.isArray(lead.followUps) ? lead.followUps : [];
}

function hasPendingFollowUp(lead: StoredLead) {
  return getFollowUps(lead).some((followUp) => followUp.status === "pending");
}

function hasGovernanceStopSignal(lead: StoredLead) {
  return (
    lead.doNotContact === true ||
    lead.requiresHumanApproval === true ||
    lead.approvalStatus === "needs_human_review" ||
    lead.approvalStatus === "rejected"
  );
}

function isOpenWorkflow(lead: StoredLead) {
  return lead.status !== "closed";
}

function hasOverdueReview(lead: StoredLead) {
  const dueAt = lead.nextFollowUpAt ? new Date(lead.nextFollowUpAt) : null;
  const isPastDue = dueAt instanceof Date && !Number.isNaN(dueAt.getTime()) && dueAt.getTime() < Date.now();

  return isOpenWorkflow(lead) && (isPastDue || hasPendingFollowUp(lead));
}

function hasIncompleteWorkflow(lead: StoredLead) {
  return (
    isOpenWorkflow(lead) &&
    (!lead.source?.trim() ||
      !lead.propertyAddress?.trim() ||
      !lead.phone?.trim() ||
      !lead.situationDetails?.trim() ||
      (!lead.nextFollowUpAt && !hasPendingFollowUp(lead)))
  );
}

function hasStaleWorkflow(lead: StoredLead) {
  const createdAt = new Date(lead.timestamp);
  const createdTime = createdAt.getTime();

  return isOpenWorkflow(lead) && !Number.isNaN(createdTime) && Date.now() - createdTime > 1000 * 60 * 60 * 24 * 14;
}

function hasRevenuePriority(lead: StoredLead) {
  return isOpenWorkflow(lead) && (lead.priority === "High" || lead.opportunityScore === "High" || lead.isHot === true);
}

function hasBuyerWorkload(lead: StoredLead) {
  return lead.status === "under_contract" || lead.approvalStatus === "approved_for_outreach";
}

function hasAcquisitionWorkload(lead: StoredLead) {
  return isOpenWorkflow(lead) && (hasPendingFollowUp(lead) || lead.status === "new" || lead.status === "contacted");
}

function hasWorkflowBottleneck(lead: StoredLead) {
  return hasGovernanceStopSignal(lead) || hasIncompleteWorkflow(lead) || hasStaleWorkflow(lead);
}

function getWorkloadSections(leads: StoredLead[], metrics: R53ManualRevenueMetricsResult): WorkloadSection[] {
  const values = metrics.metricValues;
  const governanceStopCount =
    values.governance_blocked_count || values.dnc_opt_out_blocked_leads || leads.filter(hasGovernanceStopSignal).length;
  const overdueCount = values.manual_follow_ups_overdue || leads.filter(hasOverdueReview).length;
  const incompleteCount = values.missing_critical_data_count || leads.filter(hasIncompleteWorkflow).length;
  const staleCount = leads.filter(hasStaleWorkflow).length;
  const bottleneckCount = leads.filter(hasWorkflowBottleneck).length;
  const revenuePriorityCount = leads.filter(hasRevenuePriority).length;
  const queuePressureCount =
    values.leads_needing_review + values.manual_follow_ups_due + values.human_review_required_count + overdueCount;

  return [
    {
      title: "Governance stop visibility",
      count: governanceStopCount,
      status: "Governance stop signals must be resolved first.",
      detail: "Stop signals outrank urgency, workload pressure, stale workflow pressure, revenue priority, and operational momentum.",
    },
    {
      title: "Highest-priority operator review",
      count: revenuePriorityCount + overdueCount + bottleneckCount,
      status: "Manual review may be beneficial.",
      detail: "Priority labels help focus human review and do not execute, contact, activate, automate, launch, send, or route.",
    },
    {
      title: "Overdue operational review",
      count: overdueCount,
      status: "Operator attention may be warranted.",
      detail: "Overdue review visibility is advisory only and does not auto dial, send, or escalate.",
    },
    {
      title: "Workflow bottleneck visibility",
      count: bottleneckCount,
      status: "Workflow review may deserve prioritization.",
      detail: "Bottleneck labels cannot assign tasks, mutate workflow state, persist, poll, or execute workflows.",
    },
    {
      title: "Stale workflow visibility",
      count: staleCount,
      status: "Manual review may be beneficial.",
      detail: "Stale workflow visibility does not launch campaigns, send messages, or activate providers.",
    },
    {
      title: "Revenue-priority workload review",
      count: revenuePriorityCount,
      status: "Operational priority label is advisory only.",
      detail: "High-value review priority means operator attention may be warranted, not automated action.",
    },
    {
      title: "Queue pressure visibility",
      count: queuePressureCount,
      status: "Queue pressure is visibility only.",
      detail: "Queue pressure is not an execution queue and cannot auto assign, auto approve, or auto route.",
    },
    {
      title: "Buyer-review workload visibility",
      count: leads.filter(hasBuyerWorkload).length,
      status: "Manual review may be beneficial.",
      detail: "Buyer-review workload visibility does not contact buyers or release packages.",
    },
    {
      title: "Acquisition follow-up workload",
      count: leads.filter(hasAcquisitionWorkload).length,
      status: "Operator attention may be warranted.",
      detail: "Acquisition workload visibility does not contact sellers, send SMS, send email, or dial.",
    },
    {
      title: "Incomplete workflow visibility",
      count: incompleteCount,
      status: "Workflow review may deserve prioritization.",
      detail: "Incomplete workflow labels require human verification and cannot invent lead or property facts.",
    },
  ];
}

function getTotal(sections: WorkloadSection[]) {
  return sections.reduce((total, section) => total + section.count, 0);
}

export function OperatorWorkQueueIntelligenceSummary({
  leads,
  metrics,
}: OperatorWorkQueueIntelligenceSummaryProps) {
  const sections = getWorkloadSections(leads, metrics);

  return (
    <section
      aria-labelledby="operator-work-queue-intelligence-heading"
      aria-describedby="operator-work-queue-intelligence-summary"
      className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6"
    >
      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">
            Operator work queue intelligence
          </p>
          <h2 id="operator-work-queue-intelligence-heading" className="break-words text-xl font-semibold text-primary">
            Read-only workload priority summary
          </h2>
          <p id="operator-work-queue-intelligence-summary" className="max-w-3xl break-words text-sm leading-6 text-muted">
            Manual review may be beneficial. Operator attention may be warranted. Operational priority label is advisory
            only. Governance stop signals must be resolved first.
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

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Operator work queue summary">
        <StatCard label="Workload signals" value={String(getTotal(sections))} helper="Read-only review labels" />
        <StatCard label="Governance stops" value={String(sections[0]?.count ?? 0)} helper="Resolved first" />
        <StatCard label="Queue pressure" value={String(sections[6]?.count ?? 0)} helper="Visibility only" />
        <StatCard label="Workflow bottlenecks" value={String(sections[3]?.count ?? 0)} helper="Manual review only" />
      </div>

      <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
        <h3 className="break-words font-semibold text-blue-950">Manual-review guidance</h3>
        <p className="mt-1 break-words">
          Review governance stops first, then workload pressure, overdue operational review, stale workflows, workflow
          bottlenecks, revenue-priority workload, buyer-review workload, acquisition follow-up workload, and incomplete
          workflows. This is advisory text only and does not create outbound communication, provider activation,
          campaign execution, persistence, polling, runtime activation, autonomous routing, approval execution, or
          workflow execution controls.
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
