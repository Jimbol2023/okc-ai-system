import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createDepartmentArtifact } from "./department-artifact-engine";

describe("department artifact engine", () => {
  it("creates structured marketing artifacts for CEO Draft Workspace", () => {
    const artifact = createDepartmentArtifact({
      output: "GBP post draft",
      ownerDepartment: "Marketing AI",
      directiveTitle: "Campaign 001 Inherited Property in Oklahoma",
      businessGoal: "generate_revenue",
      expectedBusinessValue: "Create seller trust and generate qualified lead replies.",
      sourceLabel: "executive_directive:campaign-001",
    });

    assert.equal(artifact.artifactType, "gbp_post_draft");
    assert.equal(artifact.sourceConnectors.includes("google_business_profile"), true);
    assert.equal(artifact.body.includes("Execution boundary:"), true);
    assert.equal(artifact.assumptions.some((assumption) => assumption.includes("data gap")), true);
    assert.equal(artifact.confidence > 0, true);
  });

  it("creates explicit SEO artifacts instead of generic placeholder work", () => {
    const artifact = createDepartmentArtifact({
      output: "missing metadata list",
      ownerDepartment: "SEO AI",
      directiveTitle: "Content Refresh Review",
      businessGoal: "increase_brand_value",
      sourceLabel: "executive_directive:content-refresh",
    });

    assert.equal(artifact.artifactType, "missing_metadata");
    assert.equal(artifact.sourceConnectors.includes("google_search_console"), true);
    assert.equal(artifact.body.includes("Missing field"), true);
  });

  it("routes finance-like outputs into read-only finance artifacts with data-gap assumptions", () => {
    const artifact = createDepartmentArtifact({
      output: "cash position summary",
      ownerDepartment: "Finance AI",
      directiveTitle: "Daily Finance Review",
      businessGoal: "reduce_risk",
      sourceLabel: "executive_directive:finance",
    });

    assert.equal(artifact.artifactType, "cash_position_summary");
    assert.equal(artifact.sourceConnectors.includes("finance_entries"), true);
    assert.equal(artifact.body.includes("does not publish, send, scrape, mutate CRM records"), true);
  });
});
