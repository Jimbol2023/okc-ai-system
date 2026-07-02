import assert from "node:assert/strict";
import { test } from "node:test";

import { createCorePlatformRegistryReport } from "@/lib/core-platform-registry";

test("Core Platform Registry organizes AI Core without live execution", () => {
  const report = createCorePlatformRegistryReport();

  assert.equal(report.ok, true);
  assert.equal(report.providerCalled, false);
  assert.equal(report.liveExecutionAllowed, false);
  assert.ok(report.corePlatforms.length >= 10);
  assert.ok(report.corePlatforms.some((platform) => platform.key === "security"));
  assert.ok(report.corePlatforms.some((platform) => platform.key === "creative_growth_studio"));
  assert.ok(report.corePlatforms.some((platform) => platform.key === "document_intelligence"));
  assert.ok(report.corePlatforms.some((platform) => platform.key === "connector_platform"));
  assert.ok(report.corePlatforms.every((platform) => platform.providerCalled === false));
  assert.ok(report.corePlatforms.every((platform) => platform.liveExecutionAllowed === false));
});

test("Core platforms preserve required governance controls", () => {
  const report = createCorePlatformRegistryReport();

  for (const platform of report.corePlatforms) {
    assert.equal(platform.governance.safeAutoMode, true);
    assert.equal(platform.governance.featureFlags, true);
    assert.equal(platform.governance.approvals, true);
    assert.equal(platform.governance.auditLogs, true);
    assert.equal(platform.governance.aiPermissions, true);
    assert.equal(platform.governance.connectorHealth, true);
    assert.equal(platform.governance.securityReview, true);
    assert.ok(platform.highRoiReason.length > 0);
  }
});

test("Module Marketplace installs Real Estate and keeps future modules planning-only", () => {
  const report = createCorePlatformRegistryReport();
  const realEstate = report.businessModules.find((module) => module.moduleKey === "real_estate");
  const ecommerce = report.businessModules.find((module) => module.moduleKey === "ecommerce");
  const futureModules = report.businessModules.filter((module) => module.moduleKey !== "real_estate");

  assert.ok(realEstate);
  assert.equal(realEstate.status, "installed");
  assert.equal(realEstate.safetyStatus, "governed");
  assert.equal(realEstate.sourceTrackingRequired, true);
  assert.ok(realEstate.capabilities.includes("deal analyzer"));
  assert.ok(ecommerce);
  assert.equal(ecommerce.status, "planned");
  assert.ok(futureModules.every((module) => module.status === "planned" || module.status === "disabled"));
  assert.ok(futureModules.every((module) => module.safetyStatus === "planning_only"));
});

test("Business modules declare connectors permissions and blocked external execution", () => {
  const report = createCorePlatformRegistryReport();

  for (const module of report.businessModules) {
    assert.ok(module.capabilities.length > 0);
    assert.ok(module.requiredPermissions.length > 0);
    assert.ok(module.extensionPoints.includes("capability"));
    assert.ok(module.extensionPoints.includes("permission"));
    assert.ok(module.extensionPoints.includes("audit_event"));
    assert.equal(module.approvalRequiredForExternalActions, true);
    assert.equal(module.providerCalled, false);
    assert.equal(module.liveExecutionAllowed, false);
  }
});

test("Registry recommends high-ROI sequencing before live connectors", () => {
  const report = createCorePlatformRegistryReport();

  assert.ok(report.nextHighRoiMoves.some((move) => /Persist audit/i.test(move)));
  assert.ok(report.nextHighRoiMoves.some((move) => /Approval Center/i.test(move)));
  assert.ok(report.nextHighRoiMoves.some((move) => /tenant/i.test(move)));
  assert.ok(report.nextHighRoiMoves.some((move) => /credential vault/i.test(move)));
});

test("Core Provider Registry includes LinkedIn as configured planning metadata only", () => {
  const report = createCorePlatformRegistryReport();
  const linkedin = report.providerRegistry.find((provider) => provider.providerId === "linkedin_company_page");

  assert.ok(linkedin);
  assert.equal(linkedin.displayName, "LinkedIn");
  assert.equal(linkedin.publicProfileUrl, "https://www.linkedin.com/company/109661667/");
  assert.equal(linkedin.status, "configured");
  assert.equal(linkedin.readiness, "Configured / Not Connected");
  assert.equal(linkedin.providerCalled, false);
  assert.equal(linkedin.liveExecutionAllowed, false);
  assert.equal(linkedin.authenticationRequired, true);
  assert.deepEqual(linkedin.supportedCapabilities, ["company_posts", "image_posts", "article_posts", "analytics (future)"]);
  assert.ok(linkedin.permissionsRequired.every((permission) => /planning|future|approval/i.test(permission)));
});
