import assert from "node:assert/strict";
import test from "node:test";

import { createApiErrorBody, createApiSuccessBody } from "../../lib/api-response";
import { searchGlobalRecords } from "../../lib/global-search";
import { getOpenAiEmbeddingConfig } from "../../lib/openai-embeddings";
import { assertOperationalSafetyCenter, createOperationalSafetyCenterReport } from "../../lib/operational-safety-center";
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
