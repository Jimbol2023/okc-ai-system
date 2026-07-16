import assert from "node:assert/strict";
import { test } from "node:test";

import { getEnterpriseConnector } from "@/lib/connector-platform";
import {
  certifyUniversalConnectorManifest,
  createUeipPortfolioReport,
  createUniversalConnectorManifest,
  evaluateUeipGatewayRequest,
} from "@/lib/universal-enterprise-integration-platform";

function gmailManifest() {
  const connector = getEnterpriseConnector("gmail");
  assert.ok(connector);
  return createUniversalConnectorManifest(connector, {
    supportedTenantIds: ["tenant-a"],
    compatibleBusinessModules: ["ai_core", "real_estate"],
  });
}

test("UEIP converts existing connectors into certified universal manifests without secrets", () => {
  const report = createUeipPortfolioReport();
  assert.ok(report.connectorCount > 0);
  assert.equal(report.certifiedCount, report.connectorCount);
  assert.equal(report.safety.credentialsExposed, false);
  assert.equal(report.safety.providerCalled, false);
  assert.equal(report.safety.liveExecutionAllowed, false);

  for (const manifest of report.manifests) {
    assert.equal(certifyUniversalConnectorManifest(manifest).certified, true);
    assert.equal(manifest.authentication.secretValuesExposed, false);
    assert.ok(!JSON.stringify(manifest).toLowerCase().includes("access_token"));
    assert.ok(manifest.capabilities.every((capability) => capability.liveExecutionAllowed === false));
  }
});

test("UEIP blocks cross-tenant connector access before provider execution", () => {
  const decision = evaluateUeipGatewayRequest(
    {
      tenantId: "tenant-b",
      actorId: "operator-1",
      businessModule: "real_estate",
      connectorId: "gmail",
      capabilityKey: "gmail.inbox.read",
      environment: "preview",
    },
    { manifest: gmailManifest() },
  );

  assert.equal(decision.decision, "blocked");
  assert.deepEqual(decision.reasonCodes, ["tenant_not_authorized"]);
  assert.equal(decision.providerCalled, false);
  assert.equal(decision.liveExecutionAllowed, false);
});

test("UEIP fails closed when connector health or credential scopes are insufficient", () => {
  const manifest = gmailManifest();
  const capabilityKey = manifest.capabilities.find((capability) => capability.operation === "read")?.capabilityKey;
  assert.ok(capabilityKey);

  const unhealthy = evaluateUeipGatewayRequest(
    {
      tenantId: "tenant-a",
      actorId: "operator-1",
      businessModule: "real_estate",
      connectorId: "gmail",
      capabilityKey,
      environment: "preview",
      connectorHealth: "unavailable",
    },
    { manifest },
  );
  assert.deepEqual(unhealthy.reasonCodes, ["connector_unhealthy_fail_closed"]);

  const missingScope = evaluateUeipGatewayRequest(
    {
      tenantId: "tenant-a",
      actorId: "operator-1",
      businessModule: "real_estate",
      connectorId: "gmail",
      capabilityKey,
      environment: "preview",
      connectorHealth: "healthy",
      credentialScopes: [],
      featureFlagsVerified: true,
    },
    { manifest },
  );
  assert.deepEqual(missingScope.reasonCodes, ["credential_scope_insufficient"]);
});

test("UEIP permits only a governed read plan and never performs the provider call", () => {
  const manifest = gmailManifest();
  const capability = manifest.capabilities.find((candidate) => candidate.operation === "read");
  assert.ok(capability);

  const decision = evaluateUeipGatewayRequest(
    {
      tenantId: "tenant-a",
      actorId: "operator-1",
      aiEmployee: "Daily Briefing Analyst AI",
      businessModule: "real_estate",
      connectorId: "gmail",
      capabilityKey: capability.capabilityKey,
      environment: "preview",
      connectorHealth: "healthy",
      credentialScopes: capability.requiredScopes,
      featureFlagsVerified: true,
    },
    { manifest },
  );

  assert.equal(decision.decision, "allow_read_plan");
  assert.equal(decision.auditRequired, true);
  assert.equal(decision.traceRequired, true);
  assert.equal(decision.providerCalled, false);
  assert.equal(decision.liveExecutionAllowed, false);
});

test("UEIP blocks writes even when an approval id is supplied unless controlled-write lifecycle is authorized", () => {
  const manifest = gmailManifest();
  const blockedWrite = manifest.capabilities.find((capability) => capability.operation === "write");
  assert.ok(blockedWrite);

  const decision = evaluateUeipGatewayRequest(
    {
      tenantId: "tenant-a",
      actorId: "operator-1",
      businessModule: "real_estate",
      connectorId: "gmail",
      capabilityKey: blockedWrite.capabilityKey,
      environment: "preview",
      approvalId: "approval-1",
      exactApprovedCapability: blockedWrite.capabilityKey,
      connectorHealth: "healthy",
      credentialScopes: blockedWrite.requiredScopes,
      featureFlagsVerified: true,
    },
    { manifest },
  );

  assert.equal(decision.decision, "blocked");
  assert.equal(decision.providerCalled, false);
  assert.equal(decision.liveExecutionAllowed, false);
});
