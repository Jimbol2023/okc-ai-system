import assert from "node:assert/strict";
import test from "node:test";

import {
  assertR65LeadQualityScopeInvariants,
  createR65LeadQualityIntelligenceScopeContract,
  summarizeR65LeadQualityScope,
  type R65ScopeInput,
  type R65ScopeResult,
} from "./r65-lead-quality-intelligence-scope-contract";

const readyInput: R65ScopeInput = {
  r64fLockdownReviewed: true,
  allowedConceptsReviewed: true,
  dataCompletenessReviewed: true,
  duplicateLeadReviewed: true,
  staleLeadReviewed: true,
  readinessReviewed: true,
  revenueRiskReviewed: true,
  governanceBoundaryReviewed: true,
  futureUiReviewed: true,
  accessibilityReviewed: true,
  operatorReviewCompleted: true,
  readOnly: true,
  advisoryOnly: true,
  simulationOnly: true,
  providerCalled: false,
  sent: false,
  persistenceAllowedNow: false,
  pollingAllowed: false,
  runtimeActivationAllowed: false,
  providerActivationAllowed: false,
  uiImplementationAllowedNow: false,
};

function assertSafety(result: R65ScopeResult) {
  assert.equal(result.readOnly, true);
  assert.equal(result.advisoryOnly, true);
  assert.equal(result.simulationOnly, true);
  assert.equal(result.providerCalled, false);
  assert.equal(result.sent, false);
  assert.equal(result.persistenceAllowedNow, false);
  assert.equal(result.pollingAllowed, false);
  assert.equal(result.runtimeActivationAllowed, false);
  assert.equal(result.providerActivationAllowed, false);
  assert.equal(result.approvalGrantsExecution, false);
  assert.equal(result.uiImplementationAllowedNow, false);
  assert.equal(result.enrichmentActivationAllowed, false);
  assert.equal(result.skipTracingAllowed, false);
  assert.equal(assertR65LeadQualityScopeInvariants(result).passed, true);
}

test("R65A defaults to operator review with hard-closed safety flags", () => {
  const result = createR65LeadQualityIntelligenceScopeContract();
  assert.equal(result.phase, "R65A");
  assert.equal(result.scopeStatus, "operator_review_required");
  assert.ok(result.warningCodes.includes("r65a_scope_contract_only"));
  assert.ok(result.warningCodes.includes("r64f_lockdown_review_required"));
  assertSafety(result);
});

test("R65A defines lead quality concepts with governance first", () => {
  const result = createR65LeadQualityIntelligenceScopeContract(readyInput);
  assert.equal(result.scopeStatus, "lead_quality_scope_ready");
  assert.ok(result.allowedIntelligenceConcepts.includes("governance_stop_visibility"));
  assert.ok(result.allowedIntelligenceConcepts.includes("incomplete_lead_data_visibility"));
  assert.ok(result.allowedIntelligenceConcepts.includes("duplicate_lead_visibility"));
  assert.ok(result.allowedIntelligenceConcepts.includes("revenue_risk_visibility"));
  assert.equal(result.rankingConcepts[0]?.concept, "governance_stop_visibility");
  assert.match(result.rankingConcepts[0]?.revenueReason ?? "", /must outrank lead quality score/i);
  assertSafety(result);
});

test("R65A blocks forbidden lead quality semantics and activation paths", () => {
  const result = createR65LeadQualityIntelligenceScopeContract(readyInput);
  assert.ok(result.forbiddenLeadQualitySemantics.includes("auto enrich lead"));
  assert.ok(result.forbiddenLeadQualitySemantics.includes("auto skip trace"));
  assert.ok(result.forbiddenLeadQualitySemantics.includes("auto contact seller"));
  assert.ok(result.forbiddenLeadQualitySemantics.includes("external lookup activation"));
  assert.equal(result.deterministicScope.enrichmentAllowed, false);
  assert.equal(result.deterministicScope.skipTracingAllowed, false);
  assert.equal(result.deterministicScope.externalLookupAllowed, false);
  assertSafety(result);
});

test("R65A rejects unsafe requests while preserving safe output", () => {
  const result = createR65LeadQualityIntelligenceScopeContract({
    ...readyInput,
    uiImplementationRequested: true,
    providerActivationRequested: true,
    enrichmentActivationRequested: true,
    skipTracingRequested: true,
    scrapingRequested: true,
    externalLookupRequested: true,
    outreachExecutionRequested: true,
    autonomousQualificationRequested: true,
    autonomousRoutingRequested: true,
    autoRejectionRequested: true,
    approvalGrantsExecution: true,
    readOnly: false,
    providerCalled: true,
    sent: true,
    uiImplementationAllowedNow: true,
  });
  assert.equal(result.scopeStatus, "lead_quality_scope_blocked");
  assert.ok(result.warningCodes.includes("enrichment_activation_rejected"));
  assert.ok(result.warningCodes.includes("skip_tracing_rejected"));
  assert.ok(result.warningCodes.includes("external_lookup_rejected"));
  assert.ok(result.warningCodes.includes("autonomous_qualification_rejected"));
  assertSafety(result);
});

test("R65A summary is bounded and points to R65B", () => {
  const result = createR65LeadQualityIntelligenceScopeContract({
    ...readyInput,
    extraScopeNotes: ["R65A note".repeat(100)],
  });
  const summary = summarizeR65LeadQualityScope(result);
  assert.equal(result.nextSuggestedPhase, "R65B - Lead Quality Intelligence UI Scope Audit");
  assert.ok(summary.length <= 903);
  assert.match(summary, /cannot authorize UI implementation/i);
  assertSafety(result);
});
