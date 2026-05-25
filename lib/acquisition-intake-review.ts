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
  contactReadyRows: number;
  propertyFirstRows: number;
  blockedCleanupRows: number;
  duplicateRows: number;
  invalidRows: number;
  missingSourceRows: number;
  sourceReviewRows: number;
  highConfidenceSourceRows: number;
  fallbackSourceRows: number;
  unknownSourceRows: number;
  cleanupSourceRows: number;
  unmappedHeaders: string[];
  missingContactRows: number;
  missingAddressRows: number;
  sourceMix: Array<{
    source: LeadSourceTag;
    label: string;
    count: number;
  }>;
  sourceClarity: string;
  importConfidence: "none" | "low" | "medium" | "high";
  readinessLabel: string;
  readinessDetail: string;
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
  return (
    !hasText(lead.source) ||
    normalizeLeadSourceTag(lead.source) === "manual_import" ||
    lead.sourceResolution === "unknown_source" ||
    lead.sourceResolution === "cleanup_needed"
  );
}

function getReadyRows(leads: ImportedLeadPreview[]) {
  return leads.filter(
    (lead) =>
      !lead.duplicate &&
      lead.validationErrors.length === 0 &&
      (lead.importReadiness === "contact_ready" || lead.importReadiness === "property_first_review")
  );
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
  missingAddressRows,
}: {
  totalRows: number;
  readyRows: number;
  duplicateRows: number;
  invalidRows: number;
  missingSourceRows: number;
  missingAddressRows: number;
}): AcquisitionIntakeReadiness {
  if (totalRows === 0) return "not_ready";
  if (invalidRows > 0 || missingSourceRows > 0 || missingAddressRows > 0) return "needs_cleanup";
  if (duplicateRows > 0) return "needs_duplicate_review";
  if (readyRows === 0) return "not_ready";
  return "ready_for_manual_import_review";
}

function getReadinessLabel(readiness: AcquisitionIntakeReadiness) {
  if (readiness === "ready_for_manual_import_review") return "Ready for manual import review";
  if (readiness === "needs_duplicate_review") return "Duplicate review needed";
  if (readiness === "needs_cleanup") return "Cleanup before import";
  return "Not ready";
}

function getReadinessDetail(readiness: AcquisitionIntakeReadiness) {
  if (readiness === "ready_for_manual_import_review") {
    return "Rows look usable for operator-approved import review. This does not authorize outreach or automation.";
  }

  if (readiness === "needs_duplicate_review") {
    return "At least one row may already exist. Review duplicates before deciding what to import.";
  }

  if (readiness === "needs_cleanup") {
    return "Fix missing source, property address, or invalid row issues before import.";
  }

  return "Load a CSV preview with source-labeled records before acquisition intake review.";
}

export function reviewAcquisitionIntake(previewLeads: ImportedLeadPreview[]): AcquisitionIntakeReview {
  const totalRows = previewLeads.length;
  const readyRows = getReadyRows(previewLeads).length;
  const contactReadyRows = previewLeads.filter((lead) => lead.importReadiness === "contact_ready").length;
  const propertyFirstRows = previewLeads.filter((lead) => lead.importReadiness === "property_first_review").length;
  const blockedCleanupRows = previewLeads.filter((lead) => lead.importReadiness === "blocked_cleanup").length;
  const duplicateRows = previewLeads.filter((lead) => lead.duplicate).length;
  const invalidRows = previewLeads.filter((lead) => lead.validationErrors.length > 0).length;
  const missingSourceRows = previewLeads.filter(isMissingSource).length;
  const highConfidenceSourceRows = previewLeads.filter((lead) => lead.sourceResolution === "high_confidence_source").length;
  const fallbackSourceRows = previewLeads.filter((lead) => lead.sourceResolution === "fallback_manual_source").length;
  const unknownSourceRows = previewLeads.filter((lead) => lead.sourceResolution === "unknown_source").length;
  const cleanupSourceRows = previewLeads.filter((lead) => lead.sourceResolution === "cleanup_needed").length;
  const unmappedHeaders = Array.from(new Set(previewLeads.flatMap((lead) => lead.unmappedHeaders))).sort();
  const missingContactRows = previewLeads.filter((lead) => !hasContact(lead)).length;
  const missingAddressRows = previewLeads.filter((lead) => !hasText(lead.propertyAddress)).length;
  const sourceMix = getSourceMix(previewLeads);
  const cleanupNeeds = [
    missingSourceRows > 0 ? `${missingSourceRows} row${missingSourceRows === 1 ? "" : "s"} need source review` : "",
    fallbackSourceRows > 0 ? `${fallbackSourceRows} row${fallbackSourceRows === 1 ? "" : "s"} use default-source fallback` : "",
    unknownSourceRows > 0 ? `${unknownSourceRows} row${unknownSourceRows === 1 ? "" : "s"} have unknown source labels` : "",
    unmappedHeaders.length > 0 ? `${unmappedHeaders.length} unmapped CSV header${unmappedHeaders.length === 1 ? "" : "s"} need review` : "",
    propertyFirstRows > 0 ? `${propertyFirstRows} property-first row${propertyFirstRows === 1 ? "" : "s"} will import blocked for contact cleanup` : "",
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
    missingAddressRows,
  });

  return {
    totalRows,
    readyRows,
    contactReadyRows,
    propertyFirstRows,
    blockedCleanupRows,
    duplicateRows,
    invalidRows,
    missingSourceRows,
    sourceReviewRows: missingSourceRows,
    highConfidenceSourceRows,
    fallbackSourceRows,
    unknownSourceRows,
    cleanupSourceRows,
    unmappedHeaders,
    missingContactRows,
    missingAddressRows,
    sourceMix,
    sourceClarity:
      missingSourceRows > 0
        ? "Some rows need source review because they use a default fallback, an unknown source label, or row cleanup."
        : "All preview rows have source attribution visible for manual review.",
    importConfidence,
    readinessLabel: getReadinessLabel(acquisitionReadiness),
    readinessDetail: getReadinessDetail(acquisitionReadiness),
    cleanupNeeds,
    complianceLabels: [
      "Source-labeled import review only",
      "No scraping, provider calls, outreach, routing, assignment, reminders, or CRM mutation are authorized by this review",
      "Imported and public-list data must stay source-labeled and manually reviewed before any outreach or seller workflow",
    ],
    acquisitionReadiness,
    safeNextManualReview:
      acquisitionReadiness === "ready_for_manual_import_review"
        ? "Review contact-ready and property-first rows, confirm source attribution, then use the existing import button if the operator approves."
        : "Resolve source, duplicate, or property-address cleanup before importing lower-confidence rows.",
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
