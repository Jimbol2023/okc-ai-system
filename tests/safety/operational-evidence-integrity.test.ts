import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

import { evaluateOperationalEvidence, operationalEvidenceFromLead } from "../../lib/operational-evidence-guard";

const legitimateEvidence = {
  tenantId: "tenant-okc",
  source: "public_seller_website",
  sourceType: "inbound_website_form",
  sourceReference: "submission-2026-08-24-001",
  observedAt: "2026-08-24T15:00:00.000Z",
  evidenceState: "real" as const,
  verificationState: "unverified" as const,
  identityValues: ["Human-submitted seller inquiry", "Oklahoma City, OK"],
};

test("provenance-complete legitimate operational evidence passes", () => {
  assert.deepEqual(evaluateOperationalEvidence(legitimateEvidence).reasonCodes, []);
  assert.equal(evaluateOperationalEvidence(legitimateEvidence).allowed, true);
});

test("JSONPlaceholder providers and known demo identities fail closed", () => {
  for (const evidence of [
    { ...legitimateEvidence, source: "https://jsonplaceholder.typicode.com/users" },
    { ...legitimateEvidence, identityValues: ["Leanne Graham", "Kulas Light"] },
  ]) {
    const decision = evaluateOperationalEvidence(evidence);
    assert.equal(decision.allowed, false);
    assert.ok(decision.reasonCodes.some((reason) => reason === "known_demo_provider" || reason === "known_demo_identity"));
  }
});

test("synthetic addresses and generated/demo leads fail closed", () => {
  for (const evidence of [
    { ...legitimateEvidence, identityValues: ["Victor Plains"] },
    { ...legitimateEvidence, source: "ai-generated", evidenceState: "synthetic" as const },
    { ...legitimateEvidence, sourceType: "demo_provider", evidenceState: "demo" as const },
  ]) {
    assert.equal(evaluateOperationalEvidence(evidence).allowed, false);
  }
});

test("missing required provenance and unapproved certification fail closed", () => {
  const missing = evaluateOperationalEvidence({ ...legitimateEvidence, sourceReference: "", sourceType: "", observedAt: null });
  assert.equal(missing.allowed, false);
  assert.ok(missing.reasonCodes.includes("source_reference_missing"));
  assert.ok(missing.reasonCodes.includes("source_type_missing"));
  assert.ok(missing.reasonCodes.includes("observation_timestamp_missing_or_invalid"));

  const certification = evaluateOperationalEvidence({ ...legitimateEvidence, evidenceState: "certification", certificationApproved: false });
  assert.equal(certification.allowed, false);
  assert.ok(certification.reasonCodes.includes("certification_not_approved"));
});

test("stored leads without revenue provenance cannot reach operational effects", () => {
  const decision = evaluateOperationalEvidence(operationalEvidenceFromLead({
    tenantId: "tenant-okc",
    source: "manual",
    createdAt: new Date(),
    name: "Unproven Owner",
    propertyAddress: "Unproven address",
    revenueLeadSources: [],
  }));
  assert.equal(decision.allowed, false);
  assert.ok(decision.reasonCodes.includes("source_type_missing"));
  assert.ok(decision.reasonCodes.includes("source_reference_missing"));
  assert.equal(decision.providerCalled, false);
  assert.equal(decision.providerWrite, false);
  assert.equal(decision.outreach, false);
  assert.equal(decision.crmMutated, false);
  assert.equal(decision.liveExecutionAllowed, false);
});

test("automation cannot persist, create ROI work, or trigger outreach", () => {
  const source = readFileSync(resolve(process.cwd(), "lib/automation-agent.ts"), "utf8");
  for (const forbidden of [
    "generateLeads",
    "fetchRealLeads",
    "createDbLead",
    "revenueTask.create",
    "propertyOpportunity.upsert",
    "propertyCandidate",
    "sendSms",
    "twilio",
    "fetch(",
    ".update(",
    ".create(",
  ]) {
    assert.equal(source.includes(forbidden), false, `automation contains forbidden operational capability: ${forbidden}`);
  }
  assert.match(source, /processedFollowUpCount:\s*0/);
  assert.match(source, /smsSentCount:\s*0/);
});

test("outreach routes guard operational evidence before effects", () => {
  const liveRoute = readFileSync(resolve(process.cwd(), "app/api/send-sms/route.ts"), "utf8");
  assert.ok(liveRoute.indexOf("const evidenceDecision = evaluateOperationalEvidence") < liveRoute.indexOf("const liveResult = await executeControlledLiveSms"));
  const mockRoute = readFileSync(resolve(process.cwd(), "app/api/leads/[leadId]/mock-outreach/route.ts"), "utf8");
  assert.ok(mockRoute.indexOf("const evidenceDecision = evaluateOperationalEvidence") < mockRoute.indexOf("const updatedLead = await prisma.lead.update"));
  assert.match(mockRoute, /crmMutated:\s*false/);
});
