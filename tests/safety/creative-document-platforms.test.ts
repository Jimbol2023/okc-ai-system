import assert from "node:assert/strict";
import { test } from "node:test";

import {
  createCreativeStudioPlatformReport,
  creativeReputationSafetyRules,
  reviewCreativeStudioRequest,
} from "@/lib/ai-creative-growth-studio";
import {
  createDocumentIntelligencePlatformReport,
  documentSafetyRules,
  reviewDocumentWorkflow,
} from "@/lib/document-intelligence-platform";

test("Creative Studio is reusable AI Core with reputation-safe defaults", () => {
  const report = createCreativeStudioPlatformReport();

  assert.equal(report.layer, "ai_core");
  assert.equal(report.reusableAcrossBusinessModules, true);
  assert.equal(report.approvalRequiredForExternalActions, true);
  assert.equal(report.auditRequired, true);
  assert.equal(report.providerCalled, false);
  assert.equal(report.liveExecutionAllowed, false);
  assert.ok(report.agents.some((agent) => agent.role === "creative_qa"));
  assert.ok(creativeReputationSafetyRules.some((rule) => /No fake reviews/i.test(rule)));
  assert.ok(creativeReputationSafetyRules.some((rule) => /No spam/i.test(rule)));
});

test("Creative review blocks publishing and keeps source labels and approvals", () => {
  const review = reviewCreativeStudioRequest({
    requestType: "content_factory",
    businessModule: "E-commerce",
    brandKey: "retail_brand",
    targetChannel: "instagram",
    desiredAssetType: "product launch carousel",
    sourceLabels: ["approved_product_brief", "brand_guidelines"],
    connectorKeys: ["canva", "meta"],
    externalActionIntent: "publish",
    complianceSensitivity: "high_reputation_risk",
  });

  assert.equal(review.architecture.recommendedLayer, "connector_plugin");
  assert.equal(review.providerCalled, false);
  assert.equal(review.liveExecutionAllowed, false);
  assert.equal(review.externalActionsBlocked, true);
  assert.equal(review.auditRequired, true);
  assert.equal(review.safeAutoDecision.status, "blocked");
  assert.equal(review.securityDecision.action, "block");
  assert.deepEqual(review.sourceLabels, ["approved_product_brief", "brand_guidelines"]);
  assert.ok(review.approvalRequirements.some((requirement) => /Human approval/i.test(requirement)));
  assert.ok(review.reputationSafetyRules.some((rule) => /dark patterns/i.test(rule)));
  assert.ok(review.connectorPlans.every((plan) => plan.providerCalled === false));
  assert.ok(review.connectorPlans.every((plan) => plan.liveExecutionAllowed === false));
});

test("Document Intelligence is reusable AI Core with productivity connector readiness", () => {
  const report = createDocumentIntelligencePlatformReport();

  assert.equal(report.layer, "ai_core");
  assert.equal(report.reusableAcrossBusinessModules, true);
  assert.equal(report.approvalRequiredForExternalActions, true);
  assert.equal(report.auditRequired, true);
  assert.equal(report.providerCalled, false);
  assert.equal(report.liveExecutionAllowed, false);
  assert.ok(report.connectorFamilies.some((family) => family.suite === "microsoft_365"));
  assert.ok(report.connectorFamilies.some((family) => family.suite === "google_workspace"));
  assert.ok(documentSafetyRules.some((rule) => /No document may be sent/i.test(rule)));
});

test("Document workflow review blocks public sharing and protects sensitive data", () => {
  const review = reviewDocumentWorkflow({
    workflowType: "productivity_workflow",
    businessModule: "Consulting",
    documentType: "proposal",
    templateKey: "consulting_proposal_v1",
    sourceRecordLabels: ["crm_opportunity", "executive_ai_summary", "approved_case_study"],
    targetSuite: "google_workspace",
    connectorKeys: ["google_workspace", "canva"],
    requestedTransformations: ["proposal_to_pdf", "proposal_to_slide_deck"],
    externalActionIntent: "share_publicly",
    containsSensitiveData: true,
  });

  assert.equal(review.architecture.recommendedLayer, "connector_plugin");
  assert.equal(review.providerCalled, false);
  assert.equal(review.liveExecutionAllowed, false);
  assert.equal(review.externalActionsBlocked, true);
  assert.equal(review.auditRequired, true);
  assert.equal(review.safeAutoDecision.status, "blocked");
  assert.equal(review.securityDecision.action, "block");
  assert.deepEqual(review.sourceRecordLabels, ["crm_opportunity", "executive_ai_summary", "approved_case_study"]);
  assert.ok(review.approvalRequirements.some((requirement) => /Security review/i.test(requirement)));
  assert.ok(review.templateRequirements.some((requirement) => /Template key/i.test(requirement)));
  assert.ok(review.connectorPlans.every((plan) => plan.providerCalled === false));
  assert.ok(review.connectorPlans.every((plan) => plan.liveExecutionAllowed === false));
});

test("Internal creative and document preparation can proceed only as governed prep", () => {
  const creative = reviewCreativeStudioRequest({
    requestType: "brand_system",
    sourceLabels: ["operator_brand_brief"],
    externalActionIntent: "create_social_asset_brief",
  });
  const document = reviewDocumentWorkflow({
    workflowType: "generate_document",
    documentType: "knowledge_document",
    sourceRecordLabels: ["approved_sop"],
    externalActionIntent: "create_flyer_brief",
  });

  assert.equal(creative.safeAutoDecision.status, "auto_allowed_internal");
  assert.equal(document.safeAutoDecision.status, "auto_allowed_internal");
  assert.equal(creative.providerCalled, false);
  assert.equal(document.providerCalled, false);
  assert.equal(creative.liveExecutionAllowed, false);
  assert.equal(document.liveExecutionAllowed, false);
  assert.equal(creative.auditRequired, true);
  assert.equal(document.auditRequired, true);
});
