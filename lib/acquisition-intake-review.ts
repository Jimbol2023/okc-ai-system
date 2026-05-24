import { formatLeadSourceTag, LEAD_SOURCE_TAGS, normalizeLeadSourceTag, type LeadSourceTag } from "./lead-source";
import type { ImportedLeadPreview } from "./list-importer";

export const acquisitionIntakeReviewFlags = {
  providerCalled: false,
  sent: false,
  scrapingTriggered: false,
  hiddenScrapingInfrastructureCreated: false,
  mlsScrapingAllowed: false,
  outreachCreated: false,
  autonomousApprovalAllowed: false,
  autonomousCrmMutationAllowed: false,
  queueCreated: false,
  reminderCreated: false,
  calendarItemCreated: false,
  routingCreated: false,
  assignmentCreated: false,
  auditWritingAllowed: false,
  storageAuthorizedByReview: false,
  routeExecutionAllowed: false,
} as const;

export type AcquisitionIntakeReadiness =
  | "not_ready"
  | "needs_cleanup"
  | "needs_duplicate_review"
  | "ready_for_manual_import_review";

export type AcquisitionIntakeReview = {
  totalRows: number;
  readyRows: number;
  duplicateRows: number;
  invalidRows: number;
  missingSourceRows: number;
  missingContactRows: number;
  missingAddressRows: number;
  sourceMix: Array<{
    source: LeadSourceTag;
    label: string;
    count: number;
  }>;
  sourceClarity: string;
  importConfidence: "none" | "low" | "medium" | "high";
  cleanupNeeds: string[];
  complianceLabels: string[];
  acquisitionReadiness: AcquisitionIntakeReadiness;
  safeNextManualReview: string;
  recommendedNextExactStep: "Review Import Preview Manually";
  advisoryOnly: true;
  readOnly: true;
  flags: typeof acquisitionIntakeReviewFlags;
};

function hasText(value: string) {
  return value.trim().length > 0;
}

function hasContact(lead: ImportedLeadPreview) {
  return hasText(lead.phone) || hasText(lead.email);
}

function isMissingSource(lead: ImportedLeadPreview) {
  return !hasText(lead.source) || normalizeLeadSourceTag(lead.source) === "manual_import";
}

function getReadyRows(leads: ImportedLeadPreview[]) {
  return leads.filter((lead) => !lead.duplicate && lead.validationErrors.length === 0 && hasContact(lead) && hasText(lead.propertyAddress));
}

function getSourceMix(leads: ImportedLeadPreview[]) {
  const sourceCounts = new Map<LeadSourceTag, number>();

  leads.forEach((lead) => {
    const source = normalizeLeadSourceTag(lead.source);
    sourceCounts.set(source, (sourceCounts.get(source) ?? 0) + 1);
  });

  return LEAD_SOURCE_TAGS.filter((source) => sourceCounts.has(source)).map((source) => ({
    source,
    label: formatLeadSourceTag(source),
    count: sourceCounts.get(source) ?? 0,
  }));
}

function getImportConfidence({
  totalRows,
  readyRows,
  duplicateRows,
  invalidRows,
  missingSourceRows,
}: {
  totalRows: number;
  readyRows: number;
  duplicateRows: number;
  invalidRows: number;
  missingSourceRows: number;
}): AcquisitionIntakeReview["importConfidence"] {
  if (totalRows === 0) return "none";

  const cleanRatio = readyRows / totalRows;
  const frictionRatio = (duplicateRows + invalidRows + missingSourceRows) / totalRows;

  if (cleanRatio >= 0.85 && frictionRatio <= 0.1) return "high";
  if (cleanRatio >= 0.6 && frictionRatio <= 0.35) return "medium";
  return "low";
}

function getReadiness({
  totalRows,
  readyRows,
  duplicateRows,
  invalidRows,
  missingSourceRows,
  missingContactRows,
  missingAddressRows,
}: {
  totalRows: number;
  readyRows: number;
  duplicateRows: number;
  invalidRows: number;
  missingSourceRows: number;
  missingContactRows: number;
  missingAddressRows: number;
}): AcquisitionIntakeReadiness {
  if (totalRows === 0 || readyRows === 0) return "not_ready";
  if (invalidRows > 0 || missingSourceRows > 0 || missingContactRows > 0 || missingAddressRows > 0) return "needs_cleanup";
  if (duplicateRows > 0) return "needs_duplicate_review";
  return "ready_for_manual_import_review";
}

export function reviewAcquisitionIntake(previewLeads: ImportedLeadPreview[]): AcquisitionIntakeReview {
  const totalRows = previewLeads.length;
  const readyRows = getReadyRows(previewLeads).length;
  const duplicateRows = previewLeads.filter((lead) => lead.duplicate).length;
  const invalidRows = previewLeads.filter((lead) => lead.validationErrors.length > 0).length;
  const missingSourceRows = previewLeads.filter(isMissingSource).length;
  const missingContactRows = previewLeads.filter((lead) => !hasContact(lead)).length;
  const missingAddressRows = previewLeads.filter((lead) => !hasText(lead.propertyAddress)).length;
  const sourceMix = getSourceMix(previewLeads);
  const cleanupNeeds = [
    missingSourceRows > 0 ? `${missingSourceRows} row${missingSourceRows === 1 ? "" : "s"} need source review` : "",
    missingContactRows > 0 ? `${missingContactRows} row${missingContactRows === 1 ? "" : "s"} need seller contact data` : "",
    missingAddressRows > 0 ? `${missingAddressRows} row${missingAddressRows === 1 ? "" : "s"} need property address data` : "",
    invalidRows > 0 ? `${invalidRows} invalid row${invalidRows === 1 ? "" : "s"} need cleanup` : "",
    duplicateRows > 0 ? `${duplicateRows} duplicate row${duplicateRows === 1 ? "" : "s"} need review` : "",
  ].filter(Boolean);
  const importConfidence = getImportConfidence({
    totalRows,
    readyRows,
    duplicateRows,
    invalidRows,
    missingSourceRows,
  });
  const acquisitionReadiness = getReadiness({
    totalRows,
    readyRows,
    duplicateRows,
    invalidRows,
    missingSourceRows,
    missingContactRows,
    missingAddressRows,
  });

  return {
    totalRows,
    readyRows,
    duplicateRows,
    invalidRows,
    missingSourceRows,
    missingContactRows,
    missingAddressRows,
    sourceMix,
    sourceClarity:
      missingSourceRows > 0
        ? "Some rows are missing specific acquisition source attribution or fell back to manual import."
        : "All preview rows have source attribution visible for manual review.",
    importConfidence,
    cleanupNeeds,
    complianceLabels: [
      "Source-labeled import review only",
      "No scraping, provider calls, outreach, routing, assignment, reminders, or CRM mutation are authorized by this review",
      "Public-list and imported data must be manually reviewed before any seller workflow",
    ],
    acquisitionReadiness,
    safeNextManualReview:
      acquisitionReadiness === "ready_for_manual_import_review"
        ? "Review the ready rows, confirm source attribution, then use the existing import button if the operator approves."
        : "Resolve source, duplicate, contact, or property-address cleanup before importing lower-confidence rows.",
    recommendedNextExactStep: "Review Import Preview Manually",
    advisoryOnly: true,
    readOnly: true,
    flags: acquisitionIntakeReviewFlags,
  };
}

export function createAcquisitionIntakeReviewSummary() {
  return {
    phase: "A1 Acquisition Intake Review Layer" as const,
    acquisitionIntakeReviewReady: true,
    recommendedNextExactStep: "Review Import Preview Manually" as const,
    deferred: [
      "public-record connectors",
      "virtual D4D",
      "territory scoring",
      "route planning",
      "MLS or RESO integration",
    ],
    advisoryOnly: true,
    readOnly: true,
    flags: acquisitionIntakeReviewFlags,
  };
}
