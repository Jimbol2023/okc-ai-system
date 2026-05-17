import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  type CountyFieldMappingCandidate,
  createCountyFieldMappingPlan,
  getCountyFieldMappingWarnings,
  summarizeCountyFieldMappingPlans,
} from "./county-field-mapping-planner";

const completeMappingCandidate: CountyFieldMappingCandidate = {
  sourceFieldName: "Parcel",
  normalizedTargetFieldPath: "identifiers.parcelNumber",
  county: "Oklahoma",
  state: "OK",
  sourceFormat: "csv",
  confidence: 0.95,
  requirement: "required",
  ambiguityLevel: "none",
};

const warningCodesFor = (candidate: CountyFieldMappingCandidate) =>
  getCountyFieldMappingWarnings({
    ...completeMappingCandidate,
    ...candidate,
  }).map((warning) => warning.code);

describe("county field mapping planner", () => {
  it("keeps mapping plans fail-closed and planning-only", () => {
    const plan = createCountyFieldMappingPlan(completeMappingCandidate);

    assert.equal(plan.ingestionBlocked, true);
    assert.equal(plan.automationBlocked, true);
    assert.equal(plan.parserExecutionAllowed, false);
    assert.equal(plan.mappingPlanningOnly, true);
  });

  it("returns a warning when source field name is missing", () => {
    assert.equal(warningCodesFor({ sourceFieldName: "" }).includes("missing_source_field_name"), true);
  });

  it("returns a warning when target field path is missing", () => {
    assert.equal(warningCodesFor({ normalizedTargetFieldPath: null }).includes("missing_target_field_path"), true);
  });

  it("returns warnings when county, state, and source format metadata are missing", () => {
    const warningCodes = warningCodesFor({
      county: "",
      state: "",
      sourceFormat: "unknown",
    });

    assert.equal(warningCodes.includes("missing_county"), true);
    assert.equal(warningCodes.includes("missing_state"), true);
    assert.equal(warningCodes.includes("unknown_source_format"), true);
  });

  it("requires human review for low confidence mappings", () => {
    const plan = createCountyFieldMappingPlan({
      ...completeMappingCandidate,
      confidence: 0.4,
    });

    assert.equal(plan.humanReviewRequired, true);
    assert.equal(plan.warnings.some((warning) => warning.code === "low_confidence_mapping"), true);
  });

  it("requires human review for ambiguous mappings", () => {
    const plan = createCountyFieldMappingPlan({
      ...completeMappingCandidate,
      ambiguityLevel: "medium",
    });

    assert.equal(plan.humanReviewRequired, true);
    assert.equal(plan.warnings.some((warning) => warning.code === "ambiguous_mapping"), true);
  });

  it("does not require human review for high-confidence complete mappings unless warnings exist", () => {
    const plan = createCountyFieldMappingPlan(completeMappingCandidate);

    assert.equal(plan.humanReviewRequired, false);
    assert.deepEqual(
      plan.warnings.map((warning) => warning.code),
      ["planning_only_no_execution"],
    );
  });

  it("returns deterministic warning codes", () => {
    assert.deepEqual(
      warningCodesFor({
        sourceFieldName: "",
        normalizedTargetFieldPath: null,
        county: "",
        state: "",
        sourceFormat: "unknown",
        confidence: 0.2,
        ambiguityLevel: "high",
      }),
      [
        "missing_source_field_name",
        "missing_target_field_path",
        "missing_county",
        "missing_state",
        "unknown_source_format",
        "low_confidence_mapping",
        "ambiguous_mapping",
        "required_mapping_needs_review",
        "planning_only_no_execution",
      ],
    );
  });

  it("summarizes mapping counts deterministically", () => {
    const complete = createCountyFieldMappingPlan(completeMappingCandidate);
    const ambiguous = createCountyFieldMappingPlan({
      ...completeMappingCandidate,
      sourceFieldName: "Owner",
      normalizedTargetFieldPath: "owner.ownerName",
      requirement: "optional",
      ambiguityLevel: "low",
    });
    const lowConfidence = createCountyFieldMappingPlan({
      ...completeMappingCandidate,
      sourceFieldName: "Address",
      normalizedTargetFieldPath: "propertyAddress.fullAddress",
      confidence: 0.25,
    });

    const summary = summarizeCountyFieldMappingPlans([complete, ambiguous, lowConfidence]);

    assert.equal(summary.totalMappings, 3);
    assert.equal(summary.humanReviewRequiredMappings, 2);
    assert.equal(summary.blockedMappings, 3);
    assert.equal(summary.ambiguousMappings, 1);
    assert.equal(summary.lowConfidenceMappings, 1);
  });
});
