import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  type CountySourceIntakePlanningInput,
  planCountySourceIntake,
} from "./county-source-intake-planning";

const structuredExportInput: CountySourceIntakePlanningInput = {
  sourceAccessType: "structured_dataset",
  fileDeliveryType: "direct_export_future",
  knownStructuredExportAvailable: true,
};

const assertFailClosed = (input: CountySourceIntakePlanningInput) => {
  const result = planCountySourceIntake(input);

  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.failClosed, true);
};

describe("county source intake planning", () => {
  it("plans structured export future pathway", () => {
    const result = planCountySourceIntake(structuredExportInput);

    assert.equal(result.intakePathway, "structured_export_future");
    assert.equal(result.sourceAccessType, "structured_dataset");
    assert.equal(result.fileDeliveryType, "direct_export_future");
    assert.equal(result.humanReviewIntensity, "low");
  });

  it("plans manual file upload future pathway", () => {
    const result = planCountySourceIntake({
      sourceAccessType: "downloadable_document",
      fileDeliveryType: "manual_upload_future",
    });

    assert.equal(result.intakePathway, "manual_file_upload_future");
    assert.equal(result.humanReviewIntensity, "medium");
  });

  it("plans OCR pipeline future pathway without executing OCR", () => {
    const result = planCountySourceIntake({
      sourceAccessType: "scanned_document",
      fileDeliveryType: "manual_upload_future",
    });

    assert.equal(result.intakePathway, "OCR_pipeline_future");
    assert.equal(result.humanReviewIntensity, "high");
    assert.equal(result.warningCodes.includes("scanned_source_requires_future_ocr_planning"), true);
  });

  it("plans public records manual research pathway", () => {
    const result = planCountySourceIntake({
      sourceAccessType: "mixed_source",
      fileDeliveryType: "physical_scan_required",
      requiresPhysicalRecordsResearch: true,
    });

    assert.equal(result.intakePathway, "public_records_manual_research");
    assert.equal(result.humanReviewIntensity, "mandatory");
  });

  it("plans unsupported unknown source pathway for missing metadata", () => {
    const result = planCountySourceIntake({});

    assert.equal(result.intakePathway, "unsupported_unknown_source");
    assert.equal(result.sourceAccessType, "unknown_source");
    assert.equal(result.fileDeliveryType, "unknown_delivery");
    assert.equal(result.humanReviewIntensity, "mandatory");
  });

  it("returns deterministic warning codes for unsupported unknown source", () => {
    const result = planCountySourceIntake({});

    assert.deepEqual(result.warningCodes, [
      "missing_source_access_type",
      "unknown_source_access_type",
      "missing_file_delivery_type",
      "unknown_file_delivery_type",
      "high_intake_friction",
      "low_future_compatibility",
      "manual_review_required",
      "execution_blocked",
      "planning_only_no_connectivity",
    ]);
  });

  it("always preserves fail-closed flags", () => {
    for (const input of [
      structuredExportInput,
      {
        sourceAccessType: "downloadable_document",
        fileDeliveryType: "manual_upload_future",
      },
      {
        sourceAccessType: "scanned_document",
        fileDeliveryType: "manual_upload_future",
      },
      {
        sourceAccessType: "mixed_source",
        fileDeliveryType: "physical_scan_required",
        requiresPhysicalRecordsResearch: true,
      },
      {},
    ]) {
      assertFailClosed(input);
    }
  });
});
