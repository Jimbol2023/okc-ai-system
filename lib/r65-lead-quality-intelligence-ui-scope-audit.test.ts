import assert from "node:assert/strict";
import test from "node:test";

import { createR65LeadQualityUiScopeAudit, type R65UiScopeInput, type R65UiScopeResult } from "./r65-lead-quality-intelligence-ui-scope-audit";

const readyInput: R65UiScopeInput = {
  r65aScopeReviewed: true,
  uiSurfaceReviewed: true,
  dataCompletenessReviewed: true,
  duplicateLeadReviewed: true,
  staleLeadReviewed: true,
  leadConfidenceReviewed: true,
  acquisitionReadinessReviewed: true,
  dispositionReadinessReviewed: true,
  wordingReviewed: true,
  governanceBoundaryReviewed: true,
  accessibilityReviewed: true,
  dangerousPatternsReviewed: true,
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

function assertSafety(result: R65UiScopeResult) {
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
}

test("R65B defaults to operator review and remains audit only", () => {
  const result = createR65LeadQualityUiScopeAudit();
  assert.equal(result.phase, "R65B");
  assert.equal(result.scopeStatus, "operator_review_required");
  assert.ok(result.warningCodes.includes("r65b_ui_scope_audit_only"));
  assertSafety(result);
});

test("R65B defines future read-only lead quality sections", () => {
  const result = createR65LeadQualityUiScopeAudit(readyInput);
  assert.equal(result.scopeStatus, "ui_scope_ready_for_later_implementation");
  assert.ok(result.allowedFutureUiSections.includes("incomplete_lead_data_visibility"));
  assert.ok(result.allowedFutureUiSections.includes("duplicate_lead_visibility"));
  assert.match(result.dataCompletenessVisibility.join(" "), /missing phone/i);
  assert.match(result.staleLeadVisibility.join(" "), /cannot auto launch follow-up/i);
  assert.match(result.readinessVisibility.join(" "), /cannot activate providers/i);
  assertSafety(result);
});

test("R65B rejects enrichment, skip tracing, provider, outreach, and execution requests", () => {
  const result = createR65LeadQualityUiScopeAudit({
    ...readyInput,
    uiImplementationRequested: true,
    enrichmentActivationRequested: true,
    skipTracingRequested: true,
    providerActivationRequested: true,
    externalLookupRequested: true,
    outreachExecutionRequested: true,
    autonomousQualificationRequested: true,
    approvalGrantsExecution: true,
    readOnly: false,
    providerCalled: true,
    sent: true,
    uiImplementationAllowedNow: true,
  });
  assert.equal(result.scopeStatus, "ui_scope_blocked");
  assert.ok(result.warningCodes.includes("enrichment_activation_rejected"));
  assert.ok(result.warningCodes.includes("skip_tracing_rejected"));
  assert.ok(result.warningCodes.includes("external_lookup_rejected"));
  assertSafety(result);
});
