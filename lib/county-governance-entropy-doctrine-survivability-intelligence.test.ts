import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountyGovernanceEntropyDoctrineSurvivability,
  type CountyGovernanceEntropyDoctrineSurvivabilityInput,
} from "./county-governance-entropy-doctrine-survivability-intelligence";

function expect<T>(actual: T): {
  toBe(expected: T): void;
  toContain(expected: unknown): void;
  toEqual(expected: unknown): void;
} {
  return {
    toBe(expected: T): void {
      assert.equal(actual, expected);
    },
    toContain(expected: unknown): void {
      assert.ok(Array.isArray(actual) && actual.includes(expected as never));
    },
    toEqual(expected: unknown): void {
      assert.deepEqual(actual, expected);
    },
  };
}

const institutionalInput: CountyGovernanceEntropyDoctrineSurvivabilityInput = {
  doctrineSurvivabilityLevel: "institutional",
  survivabilitySustainabilityLevel: "self_sustaining",
  survivabilityEntropyBurdenLevel: "none",
  survivabilityAmplificationRiskLevel: "none",
  recursiveSurvivabilityDependencyLevel: "none",
  survivabilitySequencingCoherenceLevel: "institutional",
  survivabilityFragmentationPressureLevel: "none",
  survivabilityExplainabilityLevel: "institutional",
  failClosedSurvivabilityIntegrityLevel: "institutional",
  survivabilityCollapseExposureLevel: "none",
  longHorizonDoctrineSurvivabilityLevel: "institutional",
  survivabilityOperationalViabilityLevel: "institutional",
  doctrineResilienceExhaustionLevel: "none",
  survivabilitySaturationLevel: "none",
  survivabilityReversibilityLevel: "reversible",
  survivabilityCycleCount: 1,
  stabilizationDependencyCycleCount: 0,
  entropyAmplificationEventCount: 0,
  sequencingInstabilityEventCount: 0,
  fragmentationEventCount: 0,
  explainabilityDegradationCount: 0,
  failClosedDegradationCount: 0,
  recursiveDependencyGrowthCount: 0,
  saturationEventCount: 0,
};

describe("evaluateCountyGovernanceEntropyDoctrineSurvivability", () => {
  it("returns doctrine_survivability_unverified when input is missing", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineSurvivability();

    expect(result.doctrineSurvivabilityClassification).toBe("doctrine_survivability_unverified");
    expect(result.warningCodes).toContain("S26_DOCTRINE_SURVIVABILITY_UNVERIFIED");
  });

  it("classifies institutional doctrine survivability", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineSurvivability(institutionalInput);

    expect(result.doctrineSurvivabilityClassification).toBe("institutional_doctrine_survivability");
    expect(result.sustainableSurvivabilityDetected).toBe(true);
  });

  it("classifies durable doctrine survivability", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineSurvivability({
      ...institutionalInput,
      doctrineSurvivabilityLevel: "durable",
      survivabilitySustainabilityLevel: "sustainable",
      survivabilitySequencingCoherenceLevel: "durable",
      longHorizonDoctrineSurvivabilityLevel: "durable",
      survivabilityOperationalViabilityLevel: "strong",
      survivabilityExplainabilityLevel: "strong",
      failClosedSurvivabilityIntegrityLevel: "durable",
    });

    expect(result.doctrineSurvivabilityClassification).toBe("durable_doctrine_survivability");
  });

  it("classifies temporary doctrine survivability", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineSurvivability({
      ...institutionalInput,
      doctrineSurvivabilityLevel: "temporary",
      survivabilitySustainabilityLevel: "strained",
      survivabilitySequencingCoherenceLevel: "stable",
      longHorizonDoctrineSurvivabilityLevel: "recovering",
      survivabilityOperationalViabilityLevel: "viable",
    });

    expect(result.doctrineSurvivabilityClassification).toBe("temporary_doctrine_survivability");
  });

  it("classifies entropy-burdened survivability", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineSurvivability({
      ...institutionalInput,
      survivabilityEntropyBurdenLevel: "high",
      survivabilityOperationalViabilityLevel: "strong",
    });

    expect(result.doctrineSurvivabilityClassification).toBe("entropy_burdened_survivability");
    expect(result.warningCodes).toContain("S26_ENTROPY_BURDENED_SURVIVABILITY");
  });

  it("classifies survivability fragmentation", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineSurvivability({
      ...institutionalInput,
      survivabilityFragmentationPressureLevel: "high",
    });

    expect(result.doctrineSurvivabilityClassification).toBe("survivability_fragmentation");
    expect(result.warningCodes).toContain("S26_SURVIVABILITY_FRAGMENTATION");
  });

  it("classifies survivability sequencing instability", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineSurvivability({
      ...institutionalInput,
      survivabilitySequencingCoherenceLevel: "fragile",
    });

    expect(result.doctrineSurvivabilityClassification).toBe("survivability_sequencing_instability");
    expect(result.warningCodes).toContain("S26_SURVIVABILITY_SEQUENCING_INSTABILITY");
  });

  it("classifies survivability amplification instability", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineSurvivability({
      ...institutionalInput,
      survivabilityAmplificationRiskLevel: "high",
    });

    expect(result.doctrineSurvivabilityClassification).toBe("survivability_amplification_instability");
    expect(result.warningCodes).toContain("S26_SURVIVABILITY_AMPLIFIES_ENTROPY");
  });

  it("classifies recursive survivability dependency", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineSurvivability({
      ...institutionalInput,
      recursiveSurvivabilityDependencyLevel: "high",
    });

    expect(result.doctrineSurvivabilityClassification).toBe("recursive_survivability_dependency");
    expect(result.warningCodes).toContain("S26_RECURSIVE_SURVIVABILITY_DEPENDENCY");
  });

  it("classifies probabilistically unstable survivability", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineSurvivability({
      ...institutionalInput,
      survivabilityCollapseExposureLevel: "high",
      survivabilityOperationalViabilityLevel: "institutional",
      failClosedSurvivabilityIntegrityLevel: "institutional",
    });

    expect(result.doctrineSurvivabilityClassification).toBe("probabilistically_unstable_survivability");
    expect(result.warningCodes).toContain("S26_PROBABILISTIC_SURVIVABILITY_INSTABILITY");
  });

  it("classifies operationally nonviable survivability", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineSurvivability({
      ...institutionalInput,
      survivabilityOperationalViabilityLevel: "nonviable",
    });

    expect(result.doctrineSurvivabilityClassification).toBe("operationally_nonviable_survivability");
    expect(result.warningCodes).toContain("S26_OPERATIONALLY_NONVIABLE_SURVIVABILITY");
  });

  it("classifies fail-closed survivability degradation", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineSurvivability({
      ...institutionalInput,
      failClosedSurvivabilityIntegrityLevel: "absent",
      survivabilityCollapseExposureLevel: "none",
    });

    expect(result.doctrineSurvivabilityClassification).toBe("fail_closed_survivability_degradation");
    expect(result.warningCodes).toContain("S26_FAIL_CLOSED_SURVIVABILITY_DEGRADATION");
  });

  it("prioritizes irreversible survivability degradation", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineSurvivability({
      ...institutionalInput,
      survivabilityReversibilityLevel: "irreversible",
      survivabilityOperationalViabilityLevel: "nonviable",
      failClosedSurvivabilityIntegrityLevel: "absent",
    });

    expect(result.doctrineSurvivabilityClassification).toBe("irreversible_survivability_degradation");
    expect(result.warningCodes).toContain("S26_IRREVERSIBLE_SURVIVABILITY_DEGRADATION");
  });

  it("warns when explainability degrades", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineSurvivability({
      ...institutionalInput,
      survivabilityExplainabilityLevel: "opaque",
    });

    expect(result.warningCodes).toContain("S26_SURVIVABILITY_EXPLAINABILITY_DEGRADATION");
  });

  it("warns when long-horizon survivability is weak", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineSurvivability({
      ...institutionalInput,
      doctrineSurvivabilityLevel: "stable",
      longHorizonDoctrineSurvivabilityLevel: "unproven",
      survivabilityOperationalViabilityLevel: "viable",
      failClosedSurvivabilityIntegrityLevel: "durable",
    });

    expect(result.warningCodes).toContain("S26_LONG_HORIZON_SURVIVABILITY_WEAK");
  });

  it("warns when survivability saturation is present", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineSurvivability({
      ...institutionalInput,
      survivabilitySaturationLevel: "high",
    });

    expect(result.warningCodes).toContain("S26_SURVIVABILITY_SATURATION");
  });

  it("warns when collapse exposure is present", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineSurvivability({
      ...institutionalInput,
      survivabilityCollapseExposureLevel: "high",
    });

    expect(result.warningCodes).toContain("S26_SURVIVABILITY_COLLAPSE_EXPOSURE");
  });

  it("returns deterministic repeatable results", () => {
    const first = evaluateCountyGovernanceEntropyDoctrineSurvivability({
      ...institutionalInput,
      recursiveSurvivabilityDependencyLevel: "moderate",
      survivabilityEntropyBurdenLevel: "low",
    });
    const second = evaluateCountyGovernanceEntropyDoctrineSurvivability({
      ...institutionalInput,
      recursiveSurvivabilityDependencyLevel: "moderate",
      survivabilityEntropyBurdenLevel: "low",
    });

    expect(second).toEqual(first);
  });

  it("always preserves immutable fail-closed flags", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineSurvivability(institutionalInput);

    expect(result.ingestionBlocked).toBe(true);
    expect(result.automationBlocked).toBe(true);
    expect(result.executionBlocked).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.failClosed).toBe(true);
  });
});
