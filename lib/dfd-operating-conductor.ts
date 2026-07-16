import { getActiveDistressFlags } from "@/lib/distress-flags";
import { listDbLeads } from "@/lib/leads-db";
import type { StoredLead } from "@/lib/leads-storage";
import { getLatestBusinessSnapshots, type BusinessDataSnapshotRecord } from "@/lib/read-only-business-connections";
import { getRevenuePipelineSummary, type RevenuePipelineLead } from "@/lib/revenue-pipeline";

export const dfdOperatingSafetyFlags = {
  readOnly: true,
  advisoryOnly: true,
  providerCalled: false,
  liveExecutionAllowed: false,
  workflowStarted: false,
  sent: false,
  published: false,
  outreachBlocked: true,
  scrapingBlocked: true,
  adsBlocked: true,
  crmMutationBlocked: true,
  gpsTrackingBlocked: true,
  streetViewAutomationBlocked: true,
  skipTracingBlocked: true,
  autonomousLeadCreationBlocked: true,
} as const;

export type DfdWorkRoute = "Revenue AI" | "Acquisitions AI" | "Operations AI" | "Marketing AI" | "SEO AI" | "CEO Draft Workspace";

export type DfdOperatingPriority = {
  id: string;
  leadId: string;
  propertyAddress: string;
  source: string;
  score: number;
  roiRank: number;
  category:
    | "governance_stop"
    | "highest_roi_property_review"
    | "stale_field_observation"
    | "visible_distress"
    | "missing_property_or_owner_data"
    | "duplicate_property_review"
    | "acquisition_bottleneck";
  title: string;
  rationale: string;
  nextInternalAction: string;
  assignedDepartment: DfdWorkRoute;
  sourceRecords: string[];
  dataGaps: string[];
  approvalRequired: true;
  providerCalled: false;
  liveExecutionAllowed: false;
  workflowStarted: false;
};

export type DfdDepartmentWorkRoute = {
  department: DfdWorkRoute;
  work: string;
  sourceLabel: string;
  priorityCount: number;
  approvalRequired: true;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type DfdOperatingReport = {
  ok: true;
  title: "DFD AI Operating Conductor";
  summary: string;
  generatedAt: string;
  totals: {
    storedLeads: number;
    propertyReviewPriorities: number;
    governanceStops: number;
    distressSignals: number;
    staleObservations: number;
    missingPropertyData: number;
    duplicateReviews: number;
    acquisitionBottlenecks: number;
  };
  topPriorities: DfdOperatingPriority[];
  departmentRoutes: DfdDepartmentWorkRoute[];
  connectorEvidence: string[];
  dataGaps: string[];
  draftWorkspaceProof: string[];
  safetyFlags: typeof dfdOperatingSafetyFlags;
  providerCalled: false;
  liveExecutionAllowed: false;
  workflowStarted: false;
  sent: false;
  published: false;
};

function getTime(value?: Date | string | null) {
  if (!value) return 0;
  const time = new Date(value).getTime();

  return Number.isNaN(time) ? 0 : time;
}

function isOpenLead(lead: StoredLead) {
  return lead.status !== "closed";
}

function isGovernanceStop(lead: StoredLead) {
  return Boolean(lead.doNotContact) || lead.approvalStatus === "needs_human_review" || lead.approvalStatus === "rejected";
}

function isStaleObservation(lead: StoredLead) {
  const createdAt = getTime(lead.timestamp);

  return isOpenLead(lead) && createdAt > 0 && Date.now() - createdAt > 1000 * 60 * 60 * 24 * 21;
}

function hasMissingPropertyOrOwnerData(lead: StoredLead) {
  return [
    lead.propertyAddress,
    lead.city,
    lead.state,
    lead.zipCode,
    lead.source,
    lead.ownerName,
    lead.mailingAddress,
    lead.parcelId,
  ].some((value) => !value?.trim());
}

function duplicateAddressCount(lead: StoredLead, leads: StoredLead[]) {
  const address = lead.propertyAddress.trim().toLowerCase();
  if (!address) return 0;

  return leads.filter((candidate) => candidate.propertyAddress.trim().toLowerCase() === address).length;
}

function categoryFor(input: {
  lead: StoredLead;
  pipelineLead: RevenuePipelineLead;
  leads: StoredLead[];
  distressCount: number;
}): DfdOperatingPriority["category"] {
  if (isGovernanceStop(input.lead)) return "governance_stop";
  if (input.pipelineLead.bottlenecks.length > 0) return "acquisition_bottleneck";
  if (duplicateAddressCount(input.lead, input.leads) > 1) return "duplicate_property_review";
  if (hasMissingPropertyOrOwnerData(input.lead)) return "missing_property_or_owner_data";
  if (isStaleObservation(input.lead)) return "stale_field_observation";
  if (input.distressCount > 0) return "visible_distress";

  return "highest_roi_property_review";
}

function departmentFor(category: DfdOperatingPriority["category"]): DfdWorkRoute {
  if (category === "governance_stop" || category === "missing_property_or_owner_data" || category === "duplicate_property_review") return "Operations AI";
  if (category === "acquisition_bottleneck" || category === "highest_roi_property_review" || category === "visible_distress" || category === "stale_field_observation") return "Acquisitions AI";

  return "Revenue AI";
}

function actionFor(category: DfdOperatingPriority["category"], pipelineLead: RevenuePipelineLead) {
  if (category === "governance_stop") return "Resolve governance stop before any seller, owner, or acquisition movement.";
  if (category === "missing_property_or_owner_data") return "Prepare a missing-data cleanup packet for manual review.";
  if (category === "duplicate_property_review") return "Prepare duplicate property review without merging or mutating records.";
  if (category === "stale_field_observation") return "Review whether the stored field observation is still useful before relying on it.";
  if (category === "visible_distress") return "Review stored distress signals and verify property context manually.";
  if (category === "acquisition_bottleneck") return pipelineLead.nextMoneyAction.label;

  return "Prepare high-ROI property review package for CEO approval.";
}

function categoryTitle(category: DfdOperatingPriority["category"]) {
  return category.replaceAll("_", " ");
}

function priorityFromPipelineLead(pipelineLead: RevenuePipelineLead, leads: StoredLead[]): DfdOperatingPriority {
  const lead = pipelineLead.lead;
  const activeDistress = getActiveDistressFlags(lead.distressFlags);
  const category = categoryFor({ lead, pipelineLead, leads, distressCount: activeDistress.length });
  const assignedDepartment = departmentFor(category);
  const governanceBoost = category === "governance_stop" ? 10_000 : 0;

  return {
    id: `dfd-${category}-${lead.id}`,
    leadId: lead.id,
    propertyAddress: lead.propertyAddress || "Property address not captured",
    source: lead.source || "Unknown source",
    score: lead.score ?? 0,
    roiRank: governanceBoost + pipelineLead.monetizationRank + activeDistress.length * 8,
    category,
    title: `${categoryTitle(category)}: ${lead.propertyAddress || lead.id}`,
    rationale: `${pipelineLead.reason}. Stored distress flags: ${activeDistress.length}. DFD AI is ranking internal review only.`,
    nextInternalAction: actionFor(category, pipelineLead),
    assignedDepartment,
    sourceRecords: [
      `lead:${lead.id}`,
      `revenue_bucket:${pipelineLead.bucket}`,
      `next_money_action:${pipelineLead.nextMoneyAction.label}`,
      ...activeDistress.map((flag) => `distress:${flag.label}`),
    ],
    dataGaps: [...pipelineLead.missingValueReasons, ...pipelineLead.bottlenecks].slice(0, 8),
    approvalRequired: true,
    providerCalled: false,
    liveExecutionAllowed: false,
    workflowStarted: false,
  };
}

function connectorEvidenceFromSnapshots(snapshots: BusinessDataSnapshotRecord[]) {
  return snapshots
    .filter((snapshot) => ["gmail", "google_search_console", "google_analytics", "lead_database", "crm", "property_pipeline"].includes(snapshot.connectorId))
    .map((snapshot) => `${snapshot.connectorId}:${snapshot.category}:${snapshot.status}:${snapshot.summary}`)
    .slice(0, 8);
}

function createRoutes(priorities: DfdOperatingPriority[], snapshots: BusinessDataSnapshotRecord[]): DfdDepartmentWorkRoute[] {
  const routes: DfdWorkRoute[] = ["Revenue AI", "Acquisitions AI", "Operations AI", "Marketing AI", "SEO AI", "CEO Draft Workspace"];
  const hasDemandEvidence = snapshots.some((snapshot) => ["google_search_console", "google_analytics"].includes(snapshot.connectorId) && snapshot.status !== "data_gap");

  return routes
    .map((department) => {
      const priorityCount = priorities.filter((priority) => priority.assignedDepartment === department).length;
      const work =
        department === "Revenue AI"
          ? "Use DFD-ranked properties to prepare seller follow-up recommendations for CEO review."
          : department === "Acquisitions AI"
            ? "Prepare property review and offer-readiness packages for the highest ROI properties."
            : department === "Operations AI"
              ? "Clear governance stops, duplicate review, and missing property/owner data."
              : department === "Marketing AI"
                ? hasDemandEvidence
                  ? "Use demand snapshots to support neighborhood or seller-education drafts."
                  : "Wait for Search Console or GA4 evidence before creating marketing work."
                : department === "SEO AI"
                  ? hasDemandEvidence
                    ? "Convert search and traffic demand into approval-only SEO recommendations."
                    : "Record SEO data gap until demand snapshots are available."
                  : "Package DFD priorities into CEO-reviewable internal drafts only.";

      return {
        department,
        work,
        sourceLabel: `dfd_operating_conductor:${department.toLowerCase().replaceAll(" ", "_")}`,
        priorityCount,
        approvalRequired: true as const,
        providerCalled: false as const,
        liveExecutionAllowed: false as const,
      };
    })
    .filter((route) => route.priorityCount > 0 || route.department === "CEO Draft Workspace" || route.department === "Marketing AI" || route.department === "SEO AI");
}

export function createDfdOperatingReportFromInputs({
  leads,
  snapshots,
  generatedAt = new Date().toISOString(),
}: {
  leads: StoredLead[];
  snapshots: BusinessDataSnapshotRecord[];
  generatedAt?: string;
}): DfdOperatingReport {
  const pipeline = getRevenuePipelineSummary(leads);
  const priorities = pipeline.rankedLeads
    .map((pipelineLead) => priorityFromPipelineLead(pipelineLead, leads))
    .sort((a, b) => b.roiRank - a.roiRank || b.score - a.score)
    .slice(0, 8);
  const totals = {
    storedLeads: leads.length,
    propertyReviewPriorities: priorities.length,
    governanceStops: priorities.filter((priority) => priority.category === "governance_stop").length,
    distressSignals: priorities.filter((priority) => priority.category === "visible_distress").length,
    staleObservations: priorities.filter((priority) => priority.category === "stale_field_observation").length,
    missingPropertyData: priorities.filter((priority) => priority.category === "missing_property_or_owner_data").length,
    duplicateReviews: priorities.filter((priority) => priority.category === "duplicate_property_review").length,
    acquisitionBottlenecks: priorities.filter((priority) => priority.category === "acquisition_bottleneck").length,
  };
  const connectorEvidence = connectorEvidenceFromSnapshots(snapshots);
  const dataGaps = [
    leads.length === 0 ? "No stored lead/property data is available for DFD AI to rank." : "",
    connectorEvidence.length === 0 ? "No Tier 1 connector snapshot evidence is available yet." : "",
    ...priorities.flatMap((priority) => priority.dataGaps.map((gap) => `${priority.propertyAddress}: ${gap}`)),
  ].filter(Boolean);

  return {
    ok: true,
    title: "DFD AI Operating Conductor",
    summary:
      priorities.length > 0
        ? `DFD AI ranked ${priorities.length} internal property review priorit${priorities.length === 1 ? "y" : "ies"} from stored lead, CRM, and pipeline data.`
        : "DFD AI has no stored property review priorities yet; add source-labeled lead/property data before operational routing.",
    generatedAt,
    totals,
    topPriorities: priorities,
    departmentRoutes: createRoutes(priorities, snapshots),
    connectorEvidence,
    dataGaps: [...new Set(dataGaps)].slice(0, 12),
    draftWorkspaceProof: priorities.slice(0, 4).map((priority) => `${priority.assignedDepartment}:${priority.title}:${priority.sourceRecords.join("|")}`),
    safetyFlags: dfdOperatingSafetyFlags,
    providerCalled: false,
    liveExecutionAllowed: false,
    workflowStarted: false,
    sent: false,
    published: false,
  };
}

export async function createDfdOperatingReport(): Promise<DfdOperatingReport> {
  const [leads, snapshots] = await Promise.all([listDbLeads(), getLatestBusinessSnapshots(40).catch(() => [])]);

  return createDfdOperatingReportFromInputs({ leads, snapshots });
}
