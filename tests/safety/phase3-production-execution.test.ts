import assert from "node:assert/strict";
import { test } from "node:test";

import { isFeatureEnabled } from "@/lib/feature-flags";
import {
  createMobileCommandCenter,
  createSocialExecutionPlan,
  createVerticalSliceSimulation,
  decideUnifiedApproval,
  getAutomationPolicies,
  getConnectorMarketplace,
  getLearningOutcomes,
  getSocialOpsDrafts,
  getUnifiedApprovalQueue,
  prepareConnectorWizardAction,
} from "@/lib/phase3-production-execution";

test("Phase 3 feature flags enable internal foundations without live execution", () => {
  assert.equal(isFeatureEnabled("connector_marketplace"), true);
  assert.equal(isFeatureEnabled("connector_installation_wizard"), true);
  assert.equal(isFeatureEnabled("unified_approval_center"), true);
  assert.equal(isFeatureEnabled("social_media_ops"), true);
  assert.equal(isFeatureEnabled("mobile_command_center"), true);
  assert.equal(isFeatureEnabled("safe_auto_limited"), false);
});

test("connector marketplace and wizard do not expose secrets or enable live providers", () => {
  const marketplace = getConnectorMarketplace();
  const enablePlan = prepareConnectorWizardAction("google_business_profile", "enable");

  assert.equal(marketplace.providerCalled, false);
  assert.equal(marketplace.liveExecutionAllowed, false);
  assert.ok(marketplace.connectors.every((connector) => connector.secretRendered === false));
  assert.equal(enablePlan.setupWizard.credentialReferenceOnly, true);
  assert.equal(enablePlan.providerCalled, false);
  assert.equal(enablePlan.liveExecutionAllowed, false);
});

test("unified approvals create audit-ready decisions without bypassing Safe Auto Mode", () => {
  const queue = getUnifiedApprovalQueue();
  const decision = decideUnifiedApproval({ approvalId: queue.items[0].id, decision: "approve", note: "Reviewed for test." });

  assert.equal(queue.providerCalled, false);
  assert.equal(queue.liveExecutionAllowed, false);
  assert.equal(decision.ok, true);
  if (!decision.ok) throw new Error("Expected approval decision to succeed.");
  assert.equal(decision.approval.auditLogged, true);
  assert.equal(decision.approval.approvalDoesNotBypassSafeAuto, true);
  assert.equal(decision.providerCalled, false);
  assert.equal(decision.sent, false);
  assert.equal(decision.published, false);
});

test("social operations drafts preserve provenance and never publish or schedule", () => {
  const drafts = getSocialOpsDrafts();

  assert.equal(drafts.providerCalled, false);
  assert.equal(drafts.liveExecutionAllowed, false);
  assert.ok(drafts.drafts.every((draft) => draft.sourceLabel.length > 0));
  assert.ok(drafts.drafts.every((draft) => draft.assumptions.length > 0));
  assert.ok(drafts.drafts.every((draft) => draft.providerCalled === false));
  assert.ok(drafts.drafts.every((draft) => draft.published === false));
  assert.ok(drafts.drafts.every((draft) => draft.scheduled === false));
});

test("social execution plans are connector-gated and no live execution occurs", () => {
  const plan = createSocialExecutionPlan({ draftId: "gbp-educational-owner-options" });

  assert.equal(plan.ok, true);
  assert.equal(plan.providerCalled, false);
  assert.equal(plan.published, false);
  assert.equal(plan.scheduled, false);
  assert.equal(plan.liveExecutionAllowed, false);
  assert.equal(plan.connectorPlan.providerCalled, false);
  assert.equal(plan.connectorPlan.liveExecutionAllowed, false);
});

test("mobile command center aggregates operational panels safely", () => {
  const commandCenter = createMobileCommandCenter();

  assert.equal(commandCenter.ok, true);
  assert.equal(commandCenter.pwaReady, true);
  assert.equal(commandCenter.providerCalled, false);
  assert.equal(commandCenter.sent, false);
  assert.equal(commandCenter.published, false);
  assert.equal(commandCenter.liveExecutionAllowed, false);
  assert.ok(commandCenter.panels.approvalCenter.length > 0);
  assert.ok(commandCenter.panels.notifications.length > 0);
});

test("automation and learning foundations are safe and explainable", () => {
  const policies = getAutomationPolicies();
  const outcomes = getLearningOutcomes();

  assert.ok(policies.policies.every((policy) => policy.safeAutoCompatible));
  assert.ok(policies.policies.every((policy) => policy.externalExecutionAllowed === false));
  assert.equal(outcomes.autonomousSelfModification, false);
  assert.ok(outcomes.outcomes.every((outcome) => outcome.explainabilityNote.length > 0));
  assert.ok(outcomes.outcomes.every((outcome) => outcome.autonomousSelfModification === false));
});

test("vertical slice preserves seller lead source and blocks external execution", () => {
  const simulation = createVerticalSliceSimulation();

  assert.equal(simulation.lead.source, "website_form");
  assert.equal(simulation.lead.sourcePreserved, true);
  assert.equal(simulation.followUpTask.providerCalled, false);
  assert.equal(simulation.followUpTask.sent, false);
  assert.equal(simulation.providerCalled, false);
  assert.equal(simulation.sent, false);
  assert.equal(simulation.published, false);
  assert.equal(simulation.liveExecutionAllowed, false);
  assert.ok(simulation.auditTrail.includes("lead_source_preserved"));
  assert.ok(simulation.auditTrail.includes("execution_blocked_until_policy_enabled"));
});
