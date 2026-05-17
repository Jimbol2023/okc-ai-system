import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  createParserStrategyPlan,
  getParserStrategyWarnings,
  summarizeParserStrategyPlans,
} from "./parser-strategy-planner";

const warningCodesFor = (planInput: Parameters<typeof getParserStrategyWarnings>[0]) =>
  getParserStrategyWarnings(planInput).map((warning) => warning.code);

describe("parser strategy planner", () => {
  it("keeps parser plans fail-closed and planning-only", () => {
    const plan = createParserStrategyPlan({ sourceFormat: "csv" });

    assert.equal(plan.ingestionBlocked, true);
    assert.equal(plan.automationBlocked, true);
    assert.equal(plan.parserExecutionAllowed, false);
    assert.equal(plan.parserPlanningOnly, true);
  });

  it("maps CSV sources to structured CSV strategy", () => {
    const plan = createParserStrategyPlan({ sourceFormat: "csv" });

    assert.equal(plan.parserFamily, "csv_structured");
    assert.equal(plan.ocrRequired, false);
  });

  it("maps spreadsheet sources to structured spreadsheet strategy", () => {
    const plan = createParserStrategyPlan({ sourceFormat: "spreadsheet" });

    assert.equal(plan.parserFamily, "spreadsheet_structured");
    assert.equal(plan.ocrRequired, false);
  });

  it("maps HTML table sources to HTML table strategy", () => {
    const plan = createParserStrategyPlan({ sourceFormat: "html_table" });

    assert.equal(plan.parserFamily, "html_table");
    assert.equal(plan.humanReviewRequired, true);
  });

  it("maps PDF sources to text PDF strategy", () => {
    const plan = createParserStrategyPlan({ sourceFormat: "pdf" });

    assert.equal(plan.parserFamily, "text_pdf");
    assert.equal(plan.ocrRequired, true);
  });

  it("keeps scanned image sources OCR-planning gated and human-review required", () => {
    const plan = createParserStrategyPlan({ sourceFormat: "scanned_image" });

    assert.equal(plan.parserFamily, "image_ocr_candidate");
    assert.equal(plan.ocrRequired, true);
    assert.equal(plan.humanReviewRequired, true);
    assert.equal(plan.warnings.some((warning) => warning.code === "ocr_required"), true);
  });

  it("maps unknown source format to unknown review-only strategy", () => {
    const plan = createParserStrategyPlan({ sourceFormat: "unknown" });

    assert.equal(plan.parserFamily, "unknown");
    assert.equal(plan.humanReviewRequired, true);
    assert.equal(plan.warnings.some((warning) => warning.code === "unknown_source_format"), true);
  });

  it("requires human review for low confidence parser strategies", () => {
    const plan = createParserStrategyPlan({
      sourceFormat: "csv",
      parserConfidence: 0.25,
    });

    assert.equal(plan.humanReviewRequired, true);
    assert.equal(plan.warnings.some((warning) => warning.code === "low_parser_confidence"), true);
  });

  it("requires human review for ambiguous parser strategies", () => {
    const plan = createParserStrategyPlan({
      sourceFormat: "csv",
      ambiguityLevel: "medium",
    });

    assert.equal(plan.humanReviewRequired, true);
    assert.equal(plan.warnings.some((warning) => warning.code === "ambiguous_parser_strategy"), true);
  });

  it("returns deterministic warning codes", () => {
    assert.deepEqual(warningCodesFor({ sourceFormat: "unknown" }), [
      "unknown_source_format",
      "low_structured_data_likelihood",
      "low_normalization_readiness",
      "low_parser_confidence",
      "ambiguous_parser_strategy",
      "human_review_required",
      "planning_only_no_execution",
    ]);
  });

  it("summarizes parser strategy plan counts deterministically", () => {
    const csv = createParserStrategyPlan({ sourceFormat: "csv" });
    const pdf = createParserStrategyPlan({ sourceFormat: "pdf" });
    const lowConfidence = createParserStrategyPlan({
      sourceFormat: "csv",
      parserConfidence: 0.2,
    });
    const ambiguous = createParserStrategyPlan({
      sourceFormat: "csv",
      ambiguityLevel: "high",
    });

    const summary = summarizeParserStrategyPlans([csv, pdf, lowConfidence, ambiguous]);

    assert.equal(summary.totalStrategies, 4);
    assert.equal(summary.humanReviewRequiredStrategies, 3);
    assert.equal(summary.ocrRequiredStrategies, 1);
    assert.equal(summary.blockedStrategies, 4);
    assert.equal(summary.lowConfidenceStrategies, 2);
    assert.equal(summary.ambiguousStrategies, 2);
  });
});
