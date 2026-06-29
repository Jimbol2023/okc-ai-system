import assert from "node:assert/strict";
import test from "node:test";

import { createApiErrorBody, createApiSuccessBody } from "../../lib/api-response";
import { searchGlobalRecords } from "../../lib/global-search";
import { getOpenAiEmbeddingConfig } from "../../lib/openai-embeddings";
import { assertOperationalSafetyCenter, createOperationalSafetyCenterReport } from "../../lib/operational-safety-center";
import { calculateRevenueLeadScore, findDuplicateCandidates, sanitizeAuditMetadata } from "../../lib/revenue-spine";
import {
  assertWorkflowOrchestrationSafety,
  createWorkflowOrchestrationReadinessReport,
} from "../../lib/workflow-orchestration-readiness";
import type { KnowledgeItemRecord } from "../../lib/knowledge";
import type { StoredLead } from "../../lib/leads-storage";

const safetyLead: StoredLead = {
  id: "lead-ci-safety",
  timestamp: "2026-01-01T12:00:00.000Z",
  firstName: "Moses",
  lastName: "Seller",
  email: "seller@example.test",
  phone: "4055551212",
  propertyAddress: "123 Probate Ave",
  city: "Oklahoma City",
  state: "OK",
  zipCode: "73102",
  ownerName: "Estate Owner",
  mailingAddress: "PO Box 1",
  county: "Oklahoma",
  parcelId: "parcel-ci-safety",
  situationDetails: "Inherited property with executor review.",
  source: "referral",
  status: "new",
  notes: [],
  followUps: [],
  analyzer: { arv: "", estimatedRepairs: "", desiredProfit: "20000" },
  distressFlags: {
    taxDelinquent: false,
    inheritedProperty: true,
    vacantProperty: false,
    foreclosureRisk: false,
    majorRepairs: false,
    tiredLandlord: false,
    urgentTimeline: false,
    outOfStateOwner: false,
  },
  opportunityScore: "Medium",
  score: 25,
  priority: "Medium",
  scoreBreakdown: "Inherited lead signal.",
};

const safetyKnowledgeItem: KnowledgeItemRecord = {
  id: "knowledge-ci-safety",
  title: "Probate Seller SOP",
  category: "sop",
  content: "Manual review checklist for inherited property conversations.",
  tags: ["probate", "executor"],
  status: "active",
  source: "manual",
  createdAt: new Date("2026-01-01T12:00:00.000Z"),
  updatedAt: new Date("2026-01-01T12:00:00.000Z"),
};

test("API helpers keep provider execution disabled", () => {
  const success = createApiSuccessBody({ section: "ci-safety" });
  const error = createApiErrorBody("Partial data available.", ["Finance records could not be loaded."]);

  assert.equal(success.ok, true);
  assert.equal(success.providerCalled, false);
  assert.equal(error.ok, false);
  assert.equal(error.providerCalled, false);
  assert.deepEqual(error.dataGaps, ["Finance records could not be loaded."]);
});

test("Operational Safety Center global flags remain false", () => {
  const report = createOperationalSafetyCenterReport();

  assert.doesNotThrow(() => assertOperationalSafetyCenter(report));
  assert.equal(report.globalFlags.providerCalled, false);
  assert.equal(report.globalFlags.outreachSent, false);
  assert.equal(report.globalFlags.workflowTriggered, false);
  assert.equal(report.globalFlags.desktopAutomationAuthorized, false);
  assert.equal(report.globalFlags.terminalCommandAuthorized, false);
  assert.equal(report.globalFlags.fileSystemWriteAuthorized, false);
  assert.equal(report.globalFlags.generatedPropertyFacts, false);
});

test("Workflow orchestration remains readiness-only with n8n preferred", () => {
  const report = createWorkflowOrchestrationReadinessReport();
  const n8n = report.capabilities.find((capability) => capability.id === "n8n");
  const powerAutomate = report.capabilities.find((capability) => capability.id === "microsoft_power_automate_desktop");

  assert.doesNotThrow(() => assertWorkflowOrchestrationSafety(report));
  assert.equal(report.preferredOrchestrator, "n8n");
  assert.equal(n8n?.status, "recommended_readiness_only");
  assert.equal(n8n?.safetyFlags.workflowTriggered, false);
  assert.equal(n8n?.safetyFlags.providerCalled, false);
  assert.equal(powerAutomate?.safetyFlags.desktopAutomationAuthorized, false);
  assert.ok(report.capabilities.every((capability) => capability.safetyFlags.outreachSent === false));
});

test("Global search stays internal and does not generate property facts", () => {
  const response = searchGlobalRecords({
    query: "probate",
    leads: [safetyLead],
    knowledgeItems: [safetyKnowledgeItem],
    docReferences: [],
    marketingDrafts: [
      {
        id: "draft-ci-safety",
        channel: "facebook",
        topic: "Probate education campaign",
        sourceLabel: "manual",
        status: "pending_approval",
        draftCopy: "Educational content for inherited property owners.",
        assetNotes: null,
      },
    ],
  });

  assert.equal(response.ok, true);
  assert.equal(response.providerCalled, false);
  assert.equal(response.outreachSent, false);
  assert.equal(response.generatedPropertyFacts, false);
  assert.ok(response.resultCounts.sop >= 1);
  assert.ok(response.resultCounts.property >= 1);
  assert.ok(response.resultCounts.marketing >= 1);
  assert.ok(response.results.every((result) => result.providerCalled === false));
  assert.ok(response.results.every((result) => result.generatedPropertyFacts === false));
});

test("OpenAI semantic search defaults to disabled without provider calls", () => {
  const config = getOpenAiEmbeddingConfig({
    OPENAI_EMBEDDINGS_ENABLED: "false",
    OPENAI_EMBEDDING_MODEL: "text-embedding-3-small",
  } as NodeJS.ProcessEnv);

  assert.equal(config.enabled, false);
  assert.equal(config.model, "text-embedding-3-small");
  assert.equal(config.reason, "openai_embeddings_disabled");
});

test("Revenue lead scoring labels missing data without inventing property facts", () => {
  const score = calculateRevenueLeadScore({
    ...safetyLead,
    ownerName: "",
    parcelId: "",
    county: "",
    situationDetails: "",
    lastSellerReply: null,
    lastContactedAt: null,
    nextFollowUpAt: null,
    doNotContact: false,
    approvalStatus: "pending_review",
    isHot: false,
  });

  assert.equal(score.dataUsed.includes("stored lead source"), true);
  assert.equal(score.assumptions.includes("Owner identity is not verified in the current record."), true);
  assert.equal(score.missingData.includes("owner name"), true);
  assert.equal(score.missingData.includes("parcel or county reference"), true);
  assert.match(score.explanation, /Advisory acquisition score/i);
  assert.doesNotMatch(score.explanation, /verified ARV|guaranteed return/i);
});

test("Revenue dedupe warns instead of silently merging risky records", () => {
  const duplicateLead = {
    ...safetyLead,
    id: "lead-ci-safety-duplicate",
    phone: safetyLead.phone,
    email: "other@example.test",
  };

  const candidates = findDuplicateCandidates(safetyLead, [duplicateLead]);

  assert.equal(candidates.length, 1);
  assert.equal(candidates[0].reason, "matching parcel ID");
  assert.equal(candidates[0].confidence, 96);
  assert.deepEqual(candidates[0].matchedReasons, [
    "matching parcel ID",
    "matching phone",
    "matching owner and address",
    "matching property address",
  ]);
  assert.deepEqual(candidates[0].matchedFields, [
    "parcelId",
    "phone",
    "ownerName+propertyAddress",
    "propertyAddress",
  ]);
});

test("Revenue audit metadata redacts secrets and communication bodies", () => {
  const sanitized = sanitizeAuditMetadata({
    source: "website",
    apiToken: "secret-token",
    providerResponse: { raw: "should not be stored" },
    smsBody: "message body",
    safeCount: 2,
  });

  assert.equal(sanitized.source, "website");
  assert.equal(sanitized.apiToken, "[redacted]");
  assert.equal(sanitized.providerResponse, "[redacted]");
  assert.equal(sanitized.smsBody, "[redacted]");
  assert.equal(sanitized.safeCount, 2);
});
