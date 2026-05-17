import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  type CountyCapabilityProfile,
  createCountyCapabilityProfile,
  findCountyCapabilityProfile,
  getOklahomaCountyCapabilityRegistry,
  summarizeCountyCapabilityRegistry,
} from "./county-capability-registry";

const baseCapabilityProfile: Omit<
  CountyCapabilityProfile,
  "warnings" | "ingestionBlocked" | "automationBlocked" | "parserExecutionAllowed" | "capabilityPlanningOnly"
> = {
  countyName: "Test County",
  state: "OK",
  supportedSourceFormats: ["csv", "spreadsheet", "html_table"],
  knownSourceCategories: ["assessor", "treasurer", "GIS"],
  sourceAvailability: [
    {
      category: "assessor",
      availability: "known",
      supportedFormats: ["csv"],
      updateFrequencyEstimate: "monthly",
      confidence: 0.9,
      humanReviewRequired: false,
    },
  ],
  parserFamilies: ["csv_structured", "spreadsheet_structured", "html_table"],
  parserFeasibility: 0.9,
  ocrFeasibility: 0.6,
  updateFrequencyEstimate: "monthly",
  normalizationReadiness: 0.85,
  humanReviewIntensity: "low",
  ambiguityRisk: "low",
  confidence: 0.9,
};

describe("county capability registry", () => {
  it("keeps county capability profiles fail-closed and planning-only", () => {
    const profile = createCountyCapabilityProfile(baseCapabilityProfile);

    assert.equal(profile.ingestionBlocked, true);
    assert.equal(profile.automationBlocked, true);
    assert.equal(profile.parserExecutionAllowed, false);
    assert.equal(profile.capabilityPlanningOnly, true);
  });

  it("includes target Oklahoma county capability profiles", () => {
    const registry = getOklahomaCountyCapabilityRegistry();
    const countyNames = new Set(registry.map((profile) => profile.countyName));

    for (const countyName of [
      "Oklahoma County",
      "Canadian County",
      "Cleveland County",
      "Logan County",
      "Pottawatomie County",
      "Payne County",
      "Grady County",
      "Lincoln County",
      "Tulsa County",
      "Comanche County",
    ]) {
      assert.equal(countyNames.has(countyName), true);
    }
  });

  it("finds county profiles deterministically", () => {
    const profile = findCountyCapabilityProfile("Oklahoma", "ok");

    assert.equal(profile?.countyName, "Oklahoma County");
    assert.equal(profile?.state, "OK");
  });

  it("returns null for unknown county lookup", () => {
    assert.equal(findCountyCapabilityProfile("Unknown County"), null);
  });

  it("returns deterministic warning codes for missing metadata", () => {
    const profile = createCountyCapabilityProfile({
      ...baseCapabilityProfile,
      countyName: "",
      state: "" as "OK",
      supportedSourceFormats: [],
      knownSourceCategories: [],
    });

    const warningCodes = profile.warnings.map((warning) => warning.code);

    assert.equal(warningCodes.includes("missing_county"), true);
    assert.equal(warningCodes.includes("missing_state"), true);
    assert.equal(warningCodes.includes("missing_supported_source_formats"), true);
    assert.equal(warningCodes.includes("missing_source_categories"), true);
  });

  it("keeps OCR-heavy or ambiguous county profiles human-review gated", () => {
    const cleveland = findCountyCapabilityProfile("Cleveland County");

    assert.equal(cleveland?.warnings.some((warning) => warning.code === "ocr_feasibility_uncertain"), true);
    assert.equal(cleveland?.warnings.some((warning) => warning.code === "high_human_review_intensity"), true);
    assert.equal(cleveland?.warnings.some((warning) => warning.code === "high_ambiguity_or_risk"), true);
  });

  it("summarizes registry counts deterministically", () => {
    const summary = summarizeCountyCapabilityRegistry(getOklahomaCountyCapabilityRegistry());

    assert.equal(summary.totalCounties, 10);
    assert.equal(summary.humanReviewRequiredCounties, 10);
    assert.equal(summary.ingestionBlockedCounties, 10);
    assert.equal(summary.automationBlockedCounties, 10);
    assert.equal(summary.parserBlockedCounties, 10);
    assert.equal(summary.ocrFeasibleCounties, 1);
    assert.equal(summary.highRiskCounties, 4);
  });
});
