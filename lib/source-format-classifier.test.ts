import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  classifySourceFormat,
  getSourceFormatMetadata,
  isParserPlanningOnly,
  requiresHumanSourceReview,
} from "./source-format-classifier";

describe("source format classifier", () => {
  it("classifies PDF sources from extension and content type", () => {
    const classification = classifySourceFormat({
      filename: "oklahoma-county-tax-resale.pdf",
      declaredContentType: "application/pdf",
    });

    assert.equal(classification.format, "pdf");
    assert.equal(classification.requiresHumanReview, true);
  });

  it("classifies CSV sources from extension and content type", () => {
    const classification = classifySourceFormat({
      filename: "resale-list.csv",
      declaredContentType: "text/csv",
    });

    assert.equal(classification.format, "csv");
    assert.equal(classification.requiresOCR, false);
  });

  it("classifies HTML table sources from content type and label", () => {
    const classification = classifySourceFormat({
      declaredContentType: "text/html",
      sourceLabel: "County web table",
    });

    assert.equal(classification.format, "html_table");
    assert.equal(classification.parserPlanningOnly, true);
  });

  it("classifies scanned image sources from image content type", () => {
    const classification = classifySourceFormat({
      filename: "posted-notice.jpeg",
      declaredContentType: "image/jpeg",
    });

    assert.equal(classification.format, "scanned_image");
    assert.equal(classification.requiresOCR, true);
  });

  it("classifies spreadsheet sources from extension and content type", () => {
    const classification = classifySourceFormat({
      filename: "delinquent-tax-list.xlsx",
      declaredContentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    assert.equal(classification.format, "spreadsheet");
    assert.equal(classification.structuredDataLikelihood, 0.9);
  });

  it("classifies manual-entry sources from safe metadata text", () => {
    const classification = classifySourceFormat({
      sourceLabel: "Manual entry",
      notes: "Operator notes from public counter request.",
    });

    assert.equal(classification.format, "manual_entry");
    assert.equal(classification.requiresHumanReview, true);
  });

  it("classifies mixed sources when metadata signals conflict", () => {
    const classification = classifySourceFormat({
      filename: "tax-resale.pdf",
      notes: "County also publishes a CSV export.",
    });

    assert.equal(classification.format, "mixed_source");
    assert.equal(classification.requiresHumanReview, true);
  });

  it("classifies unknown sources when metadata has no safe signal", () => {
    const classification = classifySourceFormat({
      sourceLabel: "County source pending review",
    });

    assert.equal(classification.format, "unknown");
    assert.equal(classification.confidence, 0);
  });

  it("keeps unknown sources human-review gated", () => {
    const metadata = getSourceFormatMetadata("unknown");

    assert.equal(requiresHumanSourceReview("unknown"), true);
    assert.equal(metadata.requiresHumanReview, true);
  });

  it("keeps mixed sources human-review gated", () => {
    const metadata = getSourceFormatMetadata("mixed_source");

    assert.equal(requiresHumanSourceReview("mixed_source"), true);
    assert.equal(metadata.requiresHumanReview, true);
  });

  it("keeps parser planning-only behavior true for blocked planning formats", () => {
    const classification = getSourceFormatMetadata("mixed_source");

    assert.equal(isParserPlanningOnly(classification), true);
  });

  it("keeps fail-closed ingestion and automation defaults", () => {
    const unknown = getSourceFormatMetadata("unknown");
    const mixed = getSourceFormatMetadata("mixed_source");

    assert.equal(unknown.ingestionBlockedByDefault, true);
    assert.equal(unknown.automationBlockedByDefault, true);
    assert.equal(mixed.ingestionBlockedByDefault, true);
    assert.equal(mixed.automationBlockedByDefault, true);
  });
});
