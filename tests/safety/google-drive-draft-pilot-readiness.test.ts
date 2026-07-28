import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertDriveDraftPilotReadinessSafety,
  createDriveDraftPilotReadinessPacket,
} from "@/lib/controlled-execution-maturity";

const configuredEnv = {
  GOOGLE_DRIVE_DRAFT_PILOT_ENABLED: "true",
  GOOGLE_OAUTH_CLIENT_ID: "google-client-id",
  GOOGLE_OAUTH_CLIENT_SECRET: "google-client-secret",
  GOOGLE_OAUTH_REFRESH_TOKEN: "google-refresh-token",
  GOOGLE_DRIVE_TEST_FOLDER_ID: "drive-test-folder-id",
} as NodeJS.ProcessEnv;

describe("Sprint 7F-Prep Google Drive draft pilot readiness", () => {
  it("keeps the packet blocked when the Drive test folder is missing", () => {
    const packet = createDriveDraftPilotReadinessPacket({
      env: {
        GOOGLE_DRIVE_DRAFT_PILOT_ENABLED: "true",
        GOOGLE_OAUTH_CLIENT_ID: "google-client-id",
        GOOGLE_OAUTH_CLIENT_SECRET: "google-client-secret",
        GOOGLE_OAUTH_REFRESH_TOKEN: "google-refresh-token",
      } as NodeJS.ProcessEnv,
    });

    assert.equal(packet.connector, "google_drive");
    assert.equal(packet.candidateAction, "create_drive_doc_draft");
    assert.equal(packet.status, "missing_config");
    assert.ok(packet.missingConfig.includes("GOOGLE_DRIVE_TEST_FOLDER_ID"));
    assert.equal(packet.pilotFlagConfigured, true);
    assert.equal(packet.recommendedPilot, null);
    assert.equal(packet.providerCalled, false);
    assert.equal(packet.liveExecutionAllowed, false);
  });

  it("blocks placeholder credentials and never treats them as configured", () => {
    const packet = createDriveDraftPilotReadinessPacket({
      env: {
        GOOGLE_DRIVE_DRAFT_PILOT_ENABLED: "true",
        GOOGLE_OAUTH_CLIENT_ID: "replace-with-client-id",
        GOOGLE_OAUTH_CLIENT_SECRET: "your-client-secret",
        GOOGLE_OAUTH_REFRESH_TOKEN: "replace-with-refresh-token",
        GOOGLE_DRIVE_TEST_FOLDER_ID: "drive-test-folder-id",
      } as NodeJS.ProcessEnv,
    });

    assert.equal(packet.status, "missing_config");
    assert.deepEqual(
      packet.requiredConfigKeys.map((check) => [check.key, check.classification]),
      [
        ["GOOGLE_DRIVE_DRAFT_PILOT_ENABLED", "configured"],
        ["GOOGLE_OAUTH_CLIENT_ID", "placeholder"],
        ["GOOGLE_OAUTH_CLIENT_SECRET", "placeholder"],
        ["GOOGLE_OAUTH_REFRESH_TOKEN", "placeholder"],
        ["GOOGLE_DRIVE_TEST_FOLDER_ID", "configured"],
      ],
    );
  });

  it("requires the exact Preview pilot feature flag used by the executor", () => {
    const packet = createDriveDraftPilotReadinessPacket({
      env: {
        GOOGLE_DRIVE_DRAFT_PILOT_ENABLED: "false",
        GOOGLE_OAUTH_CLIENT_ID: "google-client-id",
        GOOGLE_OAUTH_CLIENT_SECRET: "google-client-secret",
        GOOGLE_OAUTH_REFRESH_TOKEN: "google-refresh-token",
        GOOGLE_DRIVE_TEST_FOLDER_ID: "drive-test-folder-id",
      } as NodeJS.ProcessEnv,
      rollbackPlanPresent: true,
      killSwitchConfirmed: true,
      ceoApprovalConfirmed: true,
    });

    assert.equal(packet.status, "missing_config");
    assert.equal(packet.pilotFlagConfigured, false);
    assert.ok(packet.missingConfig.includes("GOOGLE_DRIVE_DRAFT_PILOT_ENABLED"));
    assert.equal(packet.recommendedPilot, null);
    assert.equal(packet.providerCalled, false);
  });

  it("does not expose raw secret-like values in serialized JSON", () => {
    const packet = createDriveDraftPilotReadinessPacket({
      env: {
        GOOGLE_DRIVE_DRAFT_PILOT_ENABLED: "true",
        GOOGLE_OAUTH_CLIENT_ID: "visible-client-id",
        GOOGLE_OAUTH_CLIENT_SECRET: "GOCSPX-super-secret-client-secret",
        GOOGLE_OAUTH_REFRESH_TOKEN: "ya29.refresh-token-that-must-not-render",
        GOOGLE_DRIVE_TEST_FOLDER_ID: "drive-test-folder-id",
      } as NodeJS.ProcessEnv,
    });
    const serialized = JSON.stringify(packet);

    assert.equal(serialized.includes("GOCSPX-super-secret-client-secret"), false);
    assert.equal(serialized.includes("ya29.refresh-token-that-must-not-render"), false);
    assert.equal(serialized.includes("drive-test-folder-id"), false);
    assert.equal(packet.requiredConfigKeys.some((check) => check.key === "GOOGLE_OAUTH_CLIENT_SECRET"), true);
  });

  it("lists only the Drive draft pilot action and not generic Drive execution", () => {
    const packet = createDriveDraftPilotReadinessPacket({ env: configuredEnv });
    const serialized = JSON.stringify(packet);

    assert.equal(packet.candidateAction, "create_drive_doc_draft");
    assert.equal(serialized.includes("\"create_drive_doc\""), false);
    assert.equal(serialized.includes("drive.files.create"), false);
  });

  it("requires Preview-only, Production-blocked, CEO approval, and kill switch controls", () => {
    const packet = createDriveDraftPilotReadinessPacket({
      env: configuredEnv,
      rollbackPlanPresent: true,
      killSwitchConfirmed: false,
      ceoApprovalConfirmed: false,
      previewOnly: false,
      productionBlocked: false,
    });

    assert.equal(packet.previewOnly, true);
    assert.equal(packet.productionBlocked, true);
    assert.equal(packet.ceoApprovalRequired, true);
    assert.equal(packet.ceoApprovalConfirmed, false);
    assert.equal(packet.killSwitchConfirmed, false);
    assert.equal(packet.status, "needs_approval");
    assert.match(packet.blockedReasons.join(" "), /Kill switch is not confirmed/);
    assert.match(packet.blockedReasons.join(" "), /CEO approval is not confirmed/);
    assert.match(packet.blockedReasons.join(" "), /Preview-only/);
    assert.match(packet.blockedReasons.join(" "), /Production/);
  });

  it("confirms audit and memory paths while remaining readiness-only", () => {
    const packet = createDriveDraftPilotReadinessPacket({
      env: configuredEnv,
      rollbackPlanPresent: true,
      killSwitchConfirmed: true,
      ceoApprovalConfirmed: true,
    });

    assert.equal(packet.auditPathConfirmed, true);
    assert.equal(packet.memoryPathConfirmed, true);
    assert.equal(packet.pilotFlagConfigured, true);
    assert.equal(packet.requiredScope.currentReadOnlyScope, "https://www.googleapis.com/auth/drive.metadata.readonly");
    assert.equal(packet.requiredScope.futureDraftWriteScope, "https://www.googleapis.com/auth/drive.file");
    assert.equal(packet.requiredScope.scopeChangeAuthorizedThisSprint, false);
    assert.equal(packet.providerCalled, false);
    assert.equal(packet.liveExecutionAllowed, false);
    assert.equal(packet.status, "ready");
    assert.equal(packet.recommendedPilot, "create_drive_doc_draft");
    assert.doesNotThrow(() => assertDriveDraftPilotReadinessSafety(packet));
  });
});
