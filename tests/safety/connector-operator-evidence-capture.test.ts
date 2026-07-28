import assert from "node:assert/strict";
import { test } from "node:test";

import { createAiEmployeeToolboxReadinessFromInputs } from "@/lib/ai-employee-toolbox-readiness";
import { createAiWorkforceReportFromInputs } from "@/lib/ai-workforce";
import { createConnectorActivationGateFromInputs } from "@/lib/connector-activation-gate";
import { createConnectorActivationReportFromInputs } from "@/lib/connector-activation-report";
import { createConnectorCredentialScopeVerificationFromInputs } from "@/lib/connector-credential-scope-verification";
import {
  assertConnectorOperatorEvidenceSafety,
  createConnectorOperatorEvidencePacketFromInputs,
} from "@/lib/connector-operator-evidence-capture";

const generatedAt = "2026-07-09T16:00:00.000Z";

function verification() {
  const workforce = createAiWorkforceReportFromInputs({ generatedAt });
  const activation = createConnectorActivationReportFromInputs({ snapshots: [], leads: [], env: {} });
  const toolbox = createAiEmployeeToolboxReadinessFromInputs({ workforce, connectorActivationReport: activation, generatedAt });
  const gate = createConnectorActivationGateFromInputs({ toolbox, connectorActivationReport: activation, generatedAt });

  return createConnectorCredentialScopeVerificationFromInputs({ gate, env: {}, generatedAt });
}

test("operator runbook includes the Sprint 6 Google connector set", () => {
  const packet = createConnectorOperatorEvidencePacketFromInputs({ verification: verification() });
  const connectorIds = packet.runbookSteps.map((step) => step.connectorId).sort();

  assert.deepEqual(connectorIds, ["gmail", "google_analytics", "google_business_profile", "google_calendar", "google_drive", "google_search_console", "youtube"]);
  assert.ok(packet.runbookSteps.every((step) => step.requiredScopes.length > 0));
  assert.equal(packet.safety.reportOnly, true);
});

test("operator evidence preview accepts valid scope URLs and marks missing scopes", () => {
  const packet = createConnectorOperatorEvidencePacketFromInputs({
    verification: verification(),
    evidence: {
      grantedScopes: ["https://www.googleapis.com/auth/gmail.readonly", "https://www.googleapis.com/auth/drive.metadata.readonly"],
      operatorInitials: "mj",
      note: "Manually copied from consent result.",
      generatedAt,
    },
  });

  assert.equal(packet.operatorInitials, "MJ");
  assert.equal(packet.summary.acceptedScopes, 2);
  assert.ok(packet.summary.missingScopes > 0);
  assert.ok(packet.scopeEvidence.some((item) => item.scope === "https://www.googleapis.com/auth/gmail.readonly" && item.status === "accepted_for_report"));
});

test("secret-like evidence is rejected or redacted and never rendered", () => {
  const packet = createConnectorOperatorEvidencePacketFromInputs({
    verification: verification(),
    evidence: {
      grantedScopes: ["ya29.secret-token", "Bearer abc", "https://www.googleapis.com/auth/gmail.readonly"],
      note: "refresh_token=secret",
    },
  });
  const serialized = JSON.stringify(packet);

  assert.equal(serialized.includes("ya29.secret-token"), false);
  assert.equal(serialized.includes("Bearer abc"), false);
  assert.equal(serialized.includes("refresh_token=secret"), false);
  assert.ok(packet.summary.rejectedItems >= 2);
  assert.equal(assertConnectorOperatorEvidenceSafety(packet), true);
});

test("operator evidence remains report-only with no persistence or execution", () => {
  const packet = createConnectorOperatorEvidencePacketFromInputs({ verification: verification() });

  assert.equal(packet.providerCalled, false);
  assert.equal(packet.liveExecutionAllowed, false);
  assert.equal(packet.safety.persistenceAttempted, false);
  assert.equal(packet.safety.dbWriteAttempted, false);
  assert.equal(packet.safety.auditWriteAttempted, false);
  assert.equal(packet.safety.memoryWriteAttempted, false);
  assert.equal(packet.safety.connectorActivationImplied, false);
});
