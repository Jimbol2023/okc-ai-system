import assert from "node:assert/strict";
import { test } from "node:test";

import { evaluateConnectorAction } from "@/lib/connector-platform";
import {
  aiCoreServices,
  classifyFeatureArchitecture,
  realEstateBusinessModule,
  registerBusinessModuleDefinition,
  requiredGovernanceControls,
} from "@/lib/modular-architecture-standard";
import { evaluateSafeAutomation } from "@/lib/safe-auto-mode";

test("AI Core services remain business agnostic and governance controlled", () => {
  const review = classifyFeatureArchitecture({
    featureName: "CRM activity timeline",
    description: "Shared CRM timeline primitive for any business model.",
    reusableAcrossIndustries: true,
    extensionPoints: ["capability", "workflow", "permission", "audit_event"],
  });

  assert.equal(review.recommendedLayer, "ai_core");
  assert.equal(review.recommendedOwner, "AI Core");
  assert.equal(review.reusableAcrossIndustries, true);
  assert.equal(review.pluginCapable, true);
  assert.equal(review.providerCalled, false);
  assert.equal(review.liveExecutionAllowed, false);
  assert.deepEqual(review.governanceControls, requiredGovernanceControls);
  assert.ok(aiCoreServices.includes("CRM primitives"));
  assert.ok(aiCoreServices.includes("Governance"));
});

test("real estate-specific capabilities classify into the Real Estate Business Module", () => {
  const review = classifyFeatureArchitecture({
    featureName: "Deal analyzer",
    description: "Analyze ARV, repair estimates, assignment fee, and property-specific deal risk.",
    businessDomain: "Real Estate",
    reusableAcrossIndustries: false,
    requiresBusinessSpecificSchema: true,
    industrySpecificTerms: ["ARV", "repairs", "assignment fee", "property address"],
    leadLikeRecordCreated: true,
    sourceTrackingPlanned: true,
    extensionPoints: ["capability", "workflow", "permission", "ui_surface", "audit_event", "schema"],
  });

  assert.equal(review.recommendedLayer, "business_module");
  assert.equal(review.recommendedOwner, "Real Estate Module");
  assert.equal(review.requiresSourceTracking, true);
  assert.equal(review.sourceTrackingPlanned, true);
  assert.equal(review.externalActionsBlockedByDefault, true);
  assert.ok(review.assumptions.some((assumption) => /Industry-specific behavior/i.test(assumption)));
});

test("Real Estate module registration inherits AI OS governance boundaries", () => {
  const registration = registerBusinessModuleDefinition(realEstateBusinessModule);

  assert.equal(registration.ok, true);
  assert.equal(registration.layer, "business_module");
  assert.equal(registration.inheritedConstitution, true);
  assert.equal(registration.pluginCapable, true);
  assert.equal(registration.providerCalled, false);
  assert.equal(registration.liveExecutionAllowed, false);
  assert.deepEqual(registration.blockedReasons, []);
});

test("connector-backed features classify as connector plugins and preserve execution gates", () => {
  const review = classifyFeatureArchitecture({
    featureName: "GBP post publisher",
    description: "Prepare and eventually publish approved Google Business Profile posts.",
    reusableAcrossIndustries: true,
    connectorKeys: ["google_business_profile"],
    requestedExternalActions: ["publish"],
    extensionPoints: ["capability", "connector", "permission", "audit_event"],
  });
  const connectorPlan = evaluateConnectorAction({
    connectorId: "google_business_profile",
    actionKey: "external_write",
    module: "Marketing AI",
  });

  assert.equal(review.recommendedLayer, "connector_plugin");
  assert.equal(review.recommendedOwner, "Connector Platform");
  assert.equal(review.approvalRequiredForExternalActions, true);
  assert.equal(review.providerCalled, false);
  assert.equal(review.liveExecutionAllowed, false);
  assert.equal(connectorPlan.decision, "blocked");
  assert.equal(connectorPlan.providerCalled, false);
  assert.equal(connectorPlan.liveExecutionAllowed, false);
});

test("unsafe external actions cannot bypass Safe Auto Mode through modular review", () => {
  const requestedExternalActions = ["send_sms", "publish", "scrape_source", "change_budget", "trigger_workflow"];
  const review = classifyFeatureArchitecture({
    featureName: "Cross-channel growth automation",
    description: "Requested automation bundle that includes external writes.",
    reusableAcrossIndustries: true,
    requestedExternalActions,
    connectorKeys: ["twilio", "google_business_profile"],
  });

  assert.equal(review.externalActionsBlockedByDefault, true);
  assert.equal(review.approvalRequiredForExternalActions, true);

  for (const requestedAction of requestedExternalActions.slice(0, 4)) {
    const decision = evaluateSafeAutomation({
      requestedAction,
      preferredToolKey: requestedAction === "send_sms" ? "twilio" : undefined,
      module: "Architecture Standard Safety Test",
    });

    assert.equal(decision.status, "blocked");
    assert.equal(decision.providerCalled, false);
    assert.equal(decision.sent, false);
    assert.equal(decision.published, false);
    assert.equal(decision.scheduled, false);
    assert.equal(decision.liveExecutionAllowed, false);
  }
});

test("module definitions fail closed when required governance controls are missing", () => {
  const registration = registerBusinessModuleDefinition({
    ...realEstateBusinessModule,
    moduleKey: "unsafe_real_estate_clone",
    governanceControls: {
      ...requiredGovernanceControls,
      auditLogs: false as never,
    },
  });

  assert.equal(registration.ok, false);
  assert.ok(registration.blockedReasons.includes("auditLogs_governance_required"));
  assert.equal(registration.providerCalled, false);
  assert.equal(registration.liveExecutionAllowed, false);
});
