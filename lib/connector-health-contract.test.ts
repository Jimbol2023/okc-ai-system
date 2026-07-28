import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { normalizeConnectorHealth } from "./connector-health-contract";
import { createProviderReadinessReport } from "./provider-readiness";

describe("connector health contract", () => {
  it("returns normalized read-only health fields for every connector", () => {
    const health = normalizeConnectorHealth({
      providerReadiness: createProviderReadinessReport(),
    });

    assert.equal(health.length > 0, true);
    for (const connector of health) {
      assert.equal(typeof connector.connectorId, "string");
      assert.equal(typeof connector.displayName, "string");
      assert.equal(typeof connector.connected, "boolean");
      assert.equal(typeof connector.authenticated, "boolean");
      assert.equal(connector.readOnly, true);
      assert.equal(typeof connector.healthy, "boolean");
      assert.equal(Array.isArray(connector.permissions), true);
      assert.equal(connector.liveExecutionAllowed, false);
    }
  });

  it("includes the internal lead database as a read-only reporting connector", () => {
    const health = normalizeConnectorHealth();
    const leadDatabase = health.find((connector) => connector.connectorId === "lead_database");

    assert.ok(leadDatabase);
    assert.equal(leadDatabase.connected, true);
    assert.equal(leadDatabase.authenticated, true);
    assert.equal(leadDatabase.readOnly, true);
    assert.equal(leadDatabase.providerCalled, false);
  });
});
