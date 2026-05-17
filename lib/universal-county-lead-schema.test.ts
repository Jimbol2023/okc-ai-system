import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  UniversalCountyLeadFailClosedDefaults,
  type UniversalCountyLeadMinimumFieldValidationInput,
  UniversalCountyLeadMinimumRecommendedFields,
  UniversalCountyLeadRequiredSections,
  UniversalCountyLeadSchemaVersion,
  validateUniversalCountyLeadMinimumFields,
} from "./universal-county-lead-schema";

const completeCountyLeadInput: UniversalCountyLeadMinimumFieldValidationInput = {
  source: {
    sourceFormat: "csv",
  },
  jurisdiction: {
    countyName: "Oklahoma",
    stateCode: "OK",
  },
  identifiers: {
    parcelNumber: "R123456789",
  },
  propertyAddress: {
    fullAddress: "100 N Broadway Ave, Oklahoma City, OK",
  },
  owner: {
    ownerName: "Example Owner",
    mailingAddress: {
      fullAddress: "PO Box 100, Oklahoma City, OK",
    },
  },
};

const validateWithOverride = (
  override: UniversalCountyLeadMinimumFieldValidationInput,
) =>
  validateUniversalCountyLeadMinimumFields({
    ...completeCountyLeadInput,
    ...override,
  });

const warningCodesFor = (input: UniversalCountyLeadMinimumFieldValidationInput) =>
  validateWithOverride(input).warnings.map((warning) => warning.code);

describe("universal county lead schema", () => {
  it("keeps the schema version stable", () => {
    assert.equal(UniversalCountyLeadSchemaVersion, "S2B-UNIVERSAL-COUNTY-LEAD-V1");
  });

  it("declares all core schema sections", () => {
    const expectedSections = [
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
    ];

    for (const section of expectedSections) {
      assert.equal(UniversalCountyLeadRequiredSections.includes(section), true);
    }
  });

  it("preserves fail-closed defaults", () => {
    assert.equal(UniversalCountyLeadFailClosedDefaults.humanReviewRequired, true);
    assert.equal(UniversalCountyLeadFailClosedDefaults.ingestionBlocked, true);
    assert.equal(UniversalCountyLeadFailClosedDefaults.automationBlocked, true);
    assert.equal(UniversalCountyLeadFailClosedDefaults.parserExecutionAllowed, false);
    assert.equal(UniversalCountyLeadFailClosedDefaults.normalizationExecuted, false);
  });

  it("keeps minimum recommended fields for deterministic county lead review", () => {
    const minimumFields = new Set(UniversalCountyLeadMinimumRecommendedFields);

    assert.equal(minimumFields.has("jurisdiction.countyName"), true);
    assert.equal(minimumFields.has("jurisdiction.stateCode"), true);
    assert.equal(
      minimumFields.has("identifiers.parcelNumber") || minimumFields.has("identifiers.accountNumber"),
      true,
    );
    assert.equal(minimumFields.has("propertyAddress.fullAddress"), true);
    assert.equal(
      minimumFields.has("owner.ownerName") || minimumFields.has("owner.mailingAddress.fullAddress"),
      true,
    );
    assert.equal(minimumFields.has("source.sourceFormat"), true);
  });

  it("accepts a complete minimum viable record without human review", () => {
    const result = validateUniversalCountyLeadMinimumFields(completeCountyLeadInput);

    assert.equal(result.isMinimumViable, true);
    assert.equal(result.requiresHumanReview, false);
    assert.deepEqual(result.missingFields, []);
  });

  it("does not emit missing-field warning codes for a complete minimum viable record", () => {
    const result = validateUniversalCountyLeadMinimumFields(completeCountyLeadInput);

    assert.deepEqual(result.warnings.map((warning) => warning.code), []);
  });

  it("requires human review when county is missing", () => {
    const result = validateWithOverride({
      jurisdiction: {
        countyName: "",
        stateCode: "OK",
      },
    });

    assert.equal(result.requiresHumanReview, true);
    assert.equal(result.missingFields.includes("jurisdiction.countyName"), true);
  });

  it("returns the expected warning code when county is missing", () => {
    assert.deepEqual(
      warningCodesFor({
        jurisdiction: {
          countyName: "",
          stateCode: "OK",
        },
      }),
      ["county_specific_mapping_required"],
    );
  });

  it("requires human review when state is missing", () => {
    const result = validateWithOverride({
      jurisdiction: {
        countyName: "Oklahoma",
        stateCode: "",
      },
    });

    assert.equal(result.requiresHumanReview, true);
    assert.equal(result.missingFields.includes("jurisdiction.stateCode"), true);
  });

  it("returns the expected warning code when state is missing", () => {
    assert.deepEqual(
      warningCodesFor({
        jurisdiction: {
          countyName: "Oklahoma",
          stateCode: "",
        },
      }),
      ["county_specific_mapping_required"],
    );
  });

  it("requires human review when source format is missing", () => {
    const result = validateWithOverride({
      source: {},
    });

    assert.equal(result.requiresHumanReview, true);
    assert.equal(result.missingFields.includes("source.sourceFormat"), true);
  });

  it("returns the expected warning code when source format is missing", () => {
    assert.deepEqual(warningCodesFor({ source: {} }), ["unknown_source_format"]);
  });

  it("requires human review when parcel and account identifiers are missing", () => {
    const result = validateWithOverride({
      identifiers: {},
    });

    assert.equal(result.requiresHumanReview, true);
    assert.equal(result.missingFields.includes("identifiers.parcelNumber|identifiers.accountNumber"), true);
  });

  it("returns the expected warning code when parcel and account identifiers are missing", () => {
    assert.deepEqual(warningCodesFor({ identifiers: {} }), ["partial_identifier_set"]);
  });

  it("requires human review when property address is missing", () => {
    const result = validateWithOverride({
      propertyAddress: {
        fullAddress: "",
      },
    });

    assert.equal(result.requiresHumanReview, true);
    assert.equal(result.missingFields.includes("propertyAddress.fullAddress"), true);
  });

  it("returns the expected warning code when property address is missing", () => {
    assert.deepEqual(
      warningCodesFor({
        propertyAddress: {
          fullAddress: "",
        },
      }),
      ["partial_property_address"],
    );
  });

  it("requires human review when owner name and owner mailing address are missing", () => {
    const result = validateWithOverride({
      owner: {},
    });

    assert.equal(result.requiresHumanReview, true);
    assert.equal(result.missingFields.includes("owner.ownerName|owner.mailingAddress.fullAddress"), true);
  });

  it("returns the expected warning code when owner name and owner mailing address are missing", () => {
    assert.deepEqual(warningCodesFor({ owner: {} }), ["partial_owner_address"]);
  });

  it("accepts owner name alone as owner identity", () => {
    const result = validateWithOverride({
      owner: {
        ownerName: "Example Owner",
      },
    });

    assert.equal(result.isMinimumViable, true);
    assert.equal(result.requiresHumanReview, false);
  });

  it("accepts owner mailing address alone as owner identity", () => {
    const result = validateWithOverride({
      owner: {
        mailingAddress: {
          fullAddress: "PO Box 100, Oklahoma City, OK",
        },
      },
    });

    assert.equal(result.isMinimumViable, true);
    assert.equal(result.requiresHumanReview, false);
  });

  it("keeps incomplete records fail-closed", () => {
    const result = validateUniversalCountyLeadMinimumFields({});

    assert.equal(result.requiresHumanReview, true);
    assert.equal(result.ingestionBlocked, true);
    assert.equal(result.automationBlocked, true);
    assert.equal(result.normalizationExecuted, false);
    assert.equal(result.parserExecutionAllowed, false);
  });
});
