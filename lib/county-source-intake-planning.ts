/**
 * County source intake planning intelligence contracts.
 *
 * Planning-only metadata for future county/public-record source intake.
 *
 * Strictly planning metadata only:
 * - no scraping
 * - no fetch calls
 * - no OCR execution
 * - no parser execution
 * - no ingestion execution
 * - no normalization execution
 * - no file uploads
 * - no storage/database writes
 * - no dashboard/API wiring
 */

export type CountySourceAccessType =
  | "downloadable_document"
  | "structured_dataset"
  | "scanned_document"
  | "mixed_source"
  | "unknown_source";

export type CountySourceIntakePathway =
  | "manual_file_upload_future"
  | "structured_export_future"
  | "OCR_pipeline_future"
  | "public_records_manual_research"
  | "unsupported_unknown_source";

export type CountySourceFileDeliveryType =
  | "manual_download_future"
  | "manual_upload_future"
  | "direct_export_future"
  | "email_attachment_future"
  | "physical_scan_required"
  | "unknown_delivery";

export type CountySourceHumanReviewIntensity = "low" | "medium" | "high" | "mandatory";

export type CountySourceIntakeWarningCode =
  | "missing_source_access_type"
  | "unknown_source_access_type"
  | "missing_file_delivery_type"
  | "unknown_file_delivery_type"
  | "scanned_source_requires_future_ocr_planning"
  | "mixed_source_requires_manual_review"
  | "high_intake_friction"
  | "low_future_compatibility"
  | "manual_review_required"
  | "execution_blocked"
  | "planning_only_no_connectivity";

export interface CountySourceIntakePlanningInput {
  sourceAccessType?: CountySourceAccessType | null;
  fileDeliveryType?: CountySourceFileDeliveryType | null;
  knownStructuredExportAvailable?: boolean | null;
  requiresPhysicalRecordsResearch?: boolean | null;
  sourceAmbiguityScore?: number | null;
  manualHandlingBurdenScore?: number | null;
  futureParserCompatibilityScore?: number | null;
}

export interface CountySourceIntakePlanningResult {
  intakePathway: CountySourceIntakePathway;
  sourceAccessType: CountySourceAccessType;
  fileDeliveryType: CountySourceFileDeliveryType;
  intakeFrictionScore: number;
  futureCompatibilityScore: number;
  humanReviewIntensity: CountySourceHumanReviewIntensity;
  warningCodes: readonly CountySourceIntakeWarningCode[];
  ingestionBlocked: true;
  automationBlocked: true;
  executionBlocked: true;
  planningOnly: true;
  failClosed: true;
}

export const CountySourceIntakePlanningVersion = "S5-COUNTY-SOURCE-INTAKE-PLANNING-V1" as const;

export const CountySourceIntakeFailClosedDefaults = {
  ingestionBlocked: true,
  automationBlocked: true,
  executionBlocked: true,
  planningOnly: true,
  failClosed: true,
} as const;

export const CountySourceIntakeWarningCodes: Record<
  Uppercase<CountySourceIntakeWarningCode>,
  CountySourceIntakeWarningCode
> = {
  MISSING_SOURCE_ACCESS_TYPE: "missing_source_access_type",
  UNKNOWN_SOURCE_ACCESS_TYPE: "unknown_source_access_type",
  MISSING_FILE_DELIVERY_TYPE: "missing_file_delivery_type",
  UNKNOWN_FILE_DELIVERY_TYPE: "unknown_file_delivery_type",
  SCANNED_SOURCE_REQUIRES_FUTURE_OCR_PLANNING: "scanned_source_requires_future_ocr_planning",
  MIXED_SOURCE_REQUIRES_MANUAL_REVIEW: "mixed_source_requires_manual_review",
  HIGH_INTAKE_FRICTION: "high_intake_friction",
  LOW_FUTURE_COMPATIBILITY: "low_future_compatibility",
  MANUAL_REVIEW_REQUIRED: "manual_review_required",
  EXECUTION_BLOCKED: "execution_blocked",
  PLANNING_ONLY_NO_CONNECTIVITY: "planning_only_no_connectivity",
} as const;

export const CountySourceIntakeThresholds = {
  highFriction: 0.7,
  lowCompatibility: 0.5,
  highAmbiguity: 0.55,
  highManualBurden: 0.65,
} as const;

const clampScore = (score: number | null | undefined): number => {
  if (typeof score !== "number" || Number.isNaN(score)) {
    return 0;
  }

  return Math.min(1, Math.max(0, score));
};

const resolveSourceAccessType = (
  sourceAccessType: CountySourceIntakePlanningInput["sourceAccessType"],
): CountySourceAccessType => sourceAccessType ?? "unknown_source";

const resolveFileDeliveryType = (
  fileDeliveryType: CountySourceIntakePlanningInput["fileDeliveryType"],
): CountySourceFileDeliveryType => fileDeliveryType ?? "unknown_delivery";

const inferIntakePathway = (
  sourceAccessType: CountySourceAccessType,
  fileDeliveryType: CountySourceFileDeliveryType,
  knownStructuredExportAvailable: boolean,
  requiresPhysicalRecordsResearch: boolean,
): CountySourceIntakePathway => {
  if (sourceAccessType === "unknown_source" || fileDeliveryType === "unknown_delivery") {
    return "unsupported_unknown_source";
  }

  if (requiresPhysicalRecordsResearch || fileDeliveryType === "physical_scan_required") {
    return "public_records_manual_research";
  }

  if (sourceAccessType === "structured_dataset" && knownStructuredExportAvailable) {
    return "structured_export_future";
  }

  if (sourceAccessType === "scanned_document") {
    return "OCR_pipeline_future";
  }

  if (sourceAccessType === "downloadable_document" || fileDeliveryType === "manual_upload_future") {
    return "manual_file_upload_future";
  }

  if (sourceAccessType === "mixed_source") {
    return "public_records_manual_research";
  }

  return "unsupported_unknown_source";
};

const scoreBaseFriction = (
  sourceAccessType: CountySourceAccessType,
  fileDeliveryType: CountySourceFileDeliveryType,
): number => {
  const accessFriction: Record<CountySourceAccessType, number> = {
    structured_dataset: 0.2,
    downloadable_document: 0.45,
    scanned_document: 0.78,
    mixed_source: 0.82,
    unknown_source: 1,
  };
  const deliveryFriction: Record<CountySourceFileDeliveryType, number> = {
    direct_export_future: 0.15,
    manual_download_future: 0.4,
    manual_upload_future: 0.5,
    email_attachment_future: 0.6,
    physical_scan_required: 0.95,
    unknown_delivery: 1,
  };

  return (accessFriction[sourceAccessType] + deliveryFriction[fileDeliveryType]) / 2;
};

const inferHumanReviewIntensity = (
  intakePathway: CountySourceIntakePathway,
  intakeFrictionScore: number,
  sourceAmbiguityScore: number,
): CountySourceHumanReviewIntensity => {
  if (intakePathway === "unsupported_unknown_source" || intakePathway === "public_records_manual_research") {
    return "mandatory";
  }

  if (
    intakePathway === "OCR_pipeline_future" ||
    intakeFrictionScore >= CountySourceIntakeThresholds.highFriction ||
    sourceAmbiguityScore >= CountySourceIntakeThresholds.highAmbiguity
  ) {
    return "high";
  }

  if (intakeFrictionScore >= 0.45) {
    return "medium";
  }

  return "low";
};

const inferFutureCompatibilityScore = (
  intakePathway: CountySourceIntakePathway,
  sourceAccessType: CountySourceAccessType,
  explicitCompatibility: number,
  intakeFrictionScore: number,
): number => {
  if (explicitCompatibility > 0) {
    return clampScore(explicitCompatibility);
  }

  if (intakePathway === "structured_export_future") {
    return 0.9;
  }

  if (sourceAccessType === "downloadable_document") {
    return clampScore(0.65 - intakeFrictionScore * 0.2);
  }

  if (intakePathway === "OCR_pipeline_future") {
    return 0.35;
  }

  if (intakePathway === "public_records_manual_research") {
    return 0.2;
  }

  return 0;
};

export function planCountySourceIntake(
  input: CountySourceIntakePlanningInput,
): CountySourceIntakePlanningResult {
  const sourceAccessType = resolveSourceAccessType(input.sourceAccessType);
  const fileDeliveryType = resolveFileDeliveryType(input.fileDeliveryType);
  const knownStructuredExportAvailable = input.knownStructuredExportAvailable === true;
  const requiresPhysicalRecordsResearch = input.requiresPhysicalRecordsResearch === true;
  const sourceAmbiguityScore = clampScore(input.sourceAmbiguityScore);
  const manualHandlingBurdenScore = clampScore(input.manualHandlingBurdenScore);
  const pathway = inferIntakePathway(
    sourceAccessType,
    fileDeliveryType,
    knownStructuredExportAvailable,
    requiresPhysicalRecordsResearch,
  );
  const baseFriction = scoreBaseFriction(sourceAccessType, fileDeliveryType);
  const intakeFrictionScore = clampScore(
    baseFriction * 0.55 + sourceAmbiguityScore * 0.2 + manualHandlingBurdenScore * 0.25,
  );
  const futureCompatibilityScore = inferFutureCompatibilityScore(
    pathway,
    sourceAccessType,
    clampScore(input.futureParserCompatibilityScore),
    intakeFrictionScore,
  );
  const humanReviewIntensity = inferHumanReviewIntensity(pathway, intakeFrictionScore, sourceAmbiguityScore);
  const warningCodes: CountySourceIntakeWarningCode[] = [];

  if (!input.sourceAccessType) {
    warningCodes.push("missing_source_access_type");
  }

  if (sourceAccessType === "unknown_source") {
    warningCodes.push("unknown_source_access_type");
  }

  if (!input.fileDeliveryType) {
    warningCodes.push("missing_file_delivery_type");
  }

  if (fileDeliveryType === "unknown_delivery") {
    warningCodes.push("unknown_file_delivery_type");
  }

  if (sourceAccessType === "scanned_document") {
    warningCodes.push("scanned_source_requires_future_ocr_planning");
  }

  if (sourceAccessType === "mixed_source" || sourceAmbiguityScore >= CountySourceIntakeThresholds.highAmbiguity) {
    warningCodes.push("mixed_source_requires_manual_review");
  }

  if (intakeFrictionScore >= CountySourceIntakeThresholds.highFriction) {
    warningCodes.push("high_intake_friction");
  }

  if (futureCompatibilityScore < CountySourceIntakeThresholds.lowCompatibility) {
    warningCodes.push("low_future_compatibility");
  }

  warningCodes.push("manual_review_required");
  warningCodes.push("execution_blocked");
  warningCodes.push("planning_only_no_connectivity");

  return {
    intakePathway: pathway,
    sourceAccessType,
    fileDeliveryType,
    intakeFrictionScore,
    futureCompatibilityScore,
    humanReviewIntensity,
    warningCodes,
    ingestionBlocked: CountySourceIntakeFailClosedDefaults.ingestionBlocked,
    automationBlocked: CountySourceIntakeFailClosedDefaults.automationBlocked,
    executionBlocked: CountySourceIntakeFailClosedDefaults.executionBlocked,
    planningOnly: CountySourceIntakeFailClosedDefaults.planningOnly,
    failClosed: CountySourceIntakeFailClosedDefaults.failClosed,
  };
}
