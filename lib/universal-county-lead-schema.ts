/**
 * Universal County Lead Schema foundation.
 *
 * County-independent public-record lead types for future normalization of
 * county, tax, auction, resale, and public-record lists.
 *
 * Strictly schema metadata only:
 * - no ingestion
 * - no parsing
 * - no scraping
 * - no database writes
 * - no dashboard/API wiring
 */

import type { SourceFormat } from "./source-format-classifier";

export type UniversalCountyLeadSourceCategory =
  | "tax_roll"
  | "tax_delinquency"
  | "tax_resale"
  | "sheriff_sale"
  | "auction"
  | "assessment_roll"
  | "ownership_record"
  | "property_record"
  | "manual_public_record"
  | "unknown";

export type UniversalCountyLeadReviewFlag =
  | "missing_source_identity"
  | "missing_county"
  | "missing_state"
  | "missing_source_format"
  | "missing_parcel_identifier"
  | "missing_property_address"
  | "missing_owner_name"
  | "missing_owner_address"
  | "ambiguous_owner"
  | "ambiguous_property_address"
  | "ambiguous_value_fields"
  | "requires_source_verification"
  | "requires_human_review"
  | "blocked_until_reviewed";

export type UniversalCountyLeadWarningCode =
  | "unknown_source_format"
  | "unknown_source_category"
  | "unverified_source_identity"
  | "partial_identifier_set"
  | "partial_property_address"
  | "partial_owner_address"
  | "value_field_not_verified"
  | "date_field_not_verified"
  | "raw_field_reference_missing"
  | "county_specific_mapping_required"
  | "normalization_not_executed";

export type UniversalCountyLeadConfidenceField =
  | "sourceIdentity"
  | "countyState"
  | "sourceFormat"
  | "parcelIdentifiers"
  | "propertyAddress"
  | "ownerIdentity"
  | "ownerAddress"
  | "taxAuctionListMetadata"
  | "saleResaleMetadata"
  | "assessedValueFields"
  | "legalDescription"
  | "rawFieldReferences";

export interface UniversalCountyLeadSourceIdentity {
  sourceId?: string | null;
  sourceName?: string | null;
  sourceCategory: UniversalCountyLeadSourceCategory;
  sourceFormat: SourceFormat;
  sourceUrl?: string | null;
  sourceFileName?: string | null;
  sourcePublishedDate?: string | null;
  sourceRetrievedDate?: string | null;
  sourceJurisdictionName?: string | null;
}

export interface UniversalCountyLeadJurisdiction {
  countyName: string | null;
  stateCode: string | null;
  stateName?: string | null;
  municipalityName?: string | null;
  taxingAuthorityName?: string | null;
}

export interface UniversalCountyLeadIdentifiers {
  parcelNumber?: string | null;
  accountNumber?: string | null;
  taxId?: string | null;
  propertyId?: string | null;
  geoId?: string | null;
  legalRecordId?: string | null;
  alternateIds?: readonly string[];
}

export interface UniversalCountyLeadAddress {
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  stateCode?: string | null;
  postalCode?: string | null;
  countyName?: string | null;
  fullAddress?: string | null;
}

export interface UniversalCountyLeadOwner {
  ownerName?: string | null;
  ownerType?: "individual" | "entity" | "trust" | "government" | "unknown";
  mailingAddress?: UniversalCountyLeadAddress | null;
  isOutOfStateOwner?: boolean | null;
  isAbsenteeOwner?: boolean | null;
}

export interface UniversalCountyLeadTaxAuctionListMetadata {
  listName?: string | null;
  listYear?: number | null;
  taxYear?: number | null;
  delinquentAmount?: number | null;
  taxesDue?: number | null;
  penaltiesDue?: number | null;
  interestDue?: number | null;
  feesDue?: number | null;
  totalDue?: number | null;
  auctionDate?: string | null;
  auctionStatus?: string | null;
  redemptionDeadline?: string | null;
  caseNumber?: string | null;
}

export interface UniversalCountyLeadSaleResaleMetadata {
  lastSaleDate?: string | null;
  lastSalePrice?: number | null;
  resaleDate?: string | null;
  resaleMinimumBid?: number | null;
  resaleStatus?: string | null;
  deedBook?: string | null;
  deedPage?: string | null;
  documentNumber?: string | null;
}

export interface UniversalCountyLeadAssessedValues {
  assessedLandValue?: number | null;
  assessedImprovementValue?: number | null;
  assessedTotalValue?: number | null;
  marketLandValue?: number | null;
  marketImprovementValue?: number | null;
  marketTotalValue?: number | null;
  taxableValue?: number | null;
  appraisedValue?: number | null;
  valuationYear?: number | null;
}

export interface UniversalCountyLeadLegalDescription {
  legalDescription?: string | null;
  subdivision?: string | null;
  block?: string | null;
  lot?: string | null;
  section?: string | null;
  township?: string | null;
  range?: string | null;
}

export interface UniversalCountyLeadConfidenceMetadata {
  overallConfidence: number;
  completenessScore: number;
  fieldConfidence: Partial<Record<UniversalCountyLeadConfidenceField, number>>;
  requiresHumanReview: boolean;
  reviewFlags: readonly UniversalCountyLeadReviewFlag[];
}

export interface UniversalCountyLeadNormalizationWarning {
  code: UniversalCountyLeadWarningCode;
  field?: string | null;
  message: string;
}

export interface UniversalCountyLeadRawFieldReference {
  normalizedField: string;
  rawFieldName?: string | null;
  rawColumnIndex?: number | null;
  rawPageNumber?: number | null;
  rawValuePreview?: string | null;
}

export interface UniversalCountyLeadRecord {
  source: UniversalCountyLeadSourceIdentity;
  jurisdiction: UniversalCountyLeadJurisdiction;
  identifiers: UniversalCountyLeadIdentifiers;
  propertyAddress?: UniversalCountyLeadAddress | null;
  owner?: UniversalCountyLeadOwner | null;
  taxAuctionListMetadata?: UniversalCountyLeadTaxAuctionListMetadata | null;
  saleResaleMetadata?: UniversalCountyLeadSaleResaleMetadata | null;
  assessedValues?: UniversalCountyLeadAssessedValues | null;
  legalDescription?: UniversalCountyLeadLegalDescription | null;
  confidence: UniversalCountyLeadConfidenceMetadata;
  normalizationWarnings: readonly UniversalCountyLeadNormalizationWarning[];
  rawFieldReferences: readonly UniversalCountyLeadRawFieldReference[];
}

export interface UniversalCountyLeadMinimumFieldValidationInput {
  source?: Partial<UniversalCountyLeadSourceIdentity> | null;
  jurisdiction?: Partial<UniversalCountyLeadJurisdiction> | null;
  identifiers?: Partial<UniversalCountyLeadIdentifiers> | null;
  propertyAddress?: Partial<UniversalCountyLeadAddress> | null;
  owner?: (Omit<Partial<UniversalCountyLeadOwner>, "mailingAddress"> & {
    mailingAddress?: Partial<UniversalCountyLeadAddress> | null;
  }) | null;
}

export interface UniversalCountyLeadMinimumFieldValidationResult {
  isMinimumViable: boolean;
  requiresHumanReview: boolean;
  missingFields: readonly string[];
  warnings: readonly UniversalCountyLeadNormalizationWarning[];
  ingestionBlocked: boolean;
  automationBlocked: boolean;
  normalizationExecuted: false;
  parserExecutionAllowed: false;
}

export const UniversalCountyLeadSchemaVersion = "S2B-UNIVERSAL-COUNTY-LEAD-V1" as const;

export const UniversalCountyLeadRequiredSections = [
  "source",
  "jurisdiction",
  "identifiers",
  "property",
  "owner",
  "tax",
  "auction",
  "resale",
  "values",
  "legal",
  "normalization",
  "review",
  "raw",
] as const;

export const UniversalCountyLeadFailClosedDefaults = {
  humanReviewRequired: true,
  ingestionBlocked: true,
  automationBlocked: true,
  requiresHumanReview: true,
  ingestionBlockedByDefault: true,
  automationBlockedByDefault: true,
  parserExecutionAllowed: false,
  normalizationExecuted: false,
} as const;

export const UniversalCountyLeadMinimumRecommendedFields = [
  "source.sourceName",
  "source.sourceCategory",
  "source.sourceFormat",
  "jurisdiction.countyName",
  "jurisdiction.stateCode",
  "identifiers.parcelNumber",
  "identifiers.accountNumber",
  "propertyAddress.fullAddress",
  "owner.ownerName",
  "owner.mailingAddress.fullAddress",
] as const;

const UNIVERSAL_COUNTY_LEAD_FIELD_WARNING_MESSAGES: Record<string, string> = {
  "jurisdiction.countyName": "County is required before this record can be considered minimum viable.",
  "jurisdiction.stateCode": "State is required before this record can be considered minimum viable.",
  "source.sourceFormat": "Source format is required before this record can be considered minimum viable.",
  "identifiers.parcelNumber|identifiers.accountNumber":
    "Parcel number or account number is required before this record can be considered minimum viable.",
  "propertyAddress.fullAddress":
    "Property address is required before this record can be considered minimum viable.",
  "owner.ownerName|owner.mailingAddress.fullAddress":
    "Owner name or owner mailing address is required before this record can be considered minimum viable.",
};

const hasDeterministicValue = (value: unknown): boolean => {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  return value !== null && value !== undefined;
};

const createMinimumFieldWarning = (
  field: string,
  code: UniversalCountyLeadWarningCode,
): UniversalCountyLeadNormalizationWarning => ({
  code,
  field,
  message: UNIVERSAL_COUNTY_LEAD_FIELD_WARNING_MESSAGES[field],
});

export function getMissingUniversalCountyLeadFields(
  input: UniversalCountyLeadMinimumFieldValidationInput | null | undefined,
): readonly string[] {
  const missingFields: string[] = [];

  if (!hasDeterministicValue(input?.jurisdiction?.countyName)) {
    missingFields.push("jurisdiction.countyName");
  }

  if (!hasDeterministicValue(input?.jurisdiction?.stateCode)) {
    missingFields.push("jurisdiction.stateCode");
  }

  if (!hasDeterministicValue(input?.source?.sourceFormat) || input?.source?.sourceFormat === "unknown") {
    missingFields.push("source.sourceFormat");
  }

  if (
    !hasDeterministicValue(input?.identifiers?.parcelNumber) &&
    !hasDeterministicValue(input?.identifiers?.accountNumber)
  ) {
    missingFields.push("identifiers.parcelNumber|identifiers.accountNumber");
  }

  if (!hasDeterministicValue(input?.propertyAddress?.fullAddress)) {
    missingFields.push("propertyAddress.fullAddress");
  }

  if (
    !hasDeterministicValue(input?.owner?.ownerName) &&
    !hasDeterministicValue(input?.owner?.mailingAddress?.fullAddress)
  ) {
    missingFields.push("owner.ownerName|owner.mailingAddress.fullAddress");
  }

  return missingFields;
}

export function validateUniversalCountyLeadMinimumFields(
  input: UniversalCountyLeadMinimumFieldValidationInput | null | undefined,
): UniversalCountyLeadMinimumFieldValidationResult {
  const missingFields = getMissingUniversalCountyLeadFields(input);
  const isMinimumViable = missingFields.length === 0;

  const warnings = missingFields.map((field) => {
    if (field === "source.sourceFormat") {
      return createMinimumFieldWarning(field, "unknown_source_format");
    }

    if (field === "identifiers.parcelNumber|identifiers.accountNumber") {
      return createMinimumFieldWarning(field, "partial_identifier_set");
    }

    if (field === "propertyAddress.fullAddress") {
      return createMinimumFieldWarning(field, "partial_property_address");
    }

    if (field === "owner.ownerName|owner.mailingAddress.fullAddress") {
      return createMinimumFieldWarning(field, "partial_owner_address");
    }

    return createMinimumFieldWarning(field, "county_specific_mapping_required");
  });

  return {
    isMinimumViable,
    requiresHumanReview: !isMinimumViable,
    missingFields,
    warnings,
    ingestionBlocked: !isMinimumViable,
    automationBlocked: !isMinimumViable,
    normalizationExecuted: UniversalCountyLeadFailClosedDefaults.normalizationExecuted,
    parserExecutionAllowed: UniversalCountyLeadFailClosedDefaults.parserExecutionAllowed,
  };
}

export function requiresUniversalCountyLeadHumanReview(
  input: UniversalCountyLeadMinimumFieldValidationInput | null | undefined,
): boolean {
  return validateUniversalCountyLeadMinimumFields(input).requiresHumanReview;
}
