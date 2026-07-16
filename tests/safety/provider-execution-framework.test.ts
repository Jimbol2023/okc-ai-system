import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertProviderExecutionPreviewSafety,
  createDriveDraftPilotReadinessPacket,
  createProviderExecutionPreview,
  isProviderExecutionFrameworkAction,
  listProviderExecutionActionRegistry,
} from "@/lib/controlled-execution-maturity";

const configuredEnv = {
  GOOGLE_DRIVE_DRAFT_PILOT_ENABLED: "true",
  GOOGLE_OAUTH_CLIENT_ID: "google-client-id",
  GOOGLE_OAUTH_CLIENT_SECRET: "google-client-secret",
  GOOGLE_OAUTH_REFRESH_TOKEN: "google-refresh-token",
  GOOGLE_DRIVE_TEST_FOLDER_ID: "drive-test-folder-id",
} as NodeJS.ProcessEnv;

function readyDrivePacket() {
  return createDriveDraftPilotReadinessPacket({
    env: configuredEnv,
    rollbackPlanPresent: true,
    killSwitchConfirmed: true,
    ceoApprovalConfirmed: true,
  });
}

describe("Sprint 8 provider execution framework", () => {
  it("registers only Sprint 10 draft adapter actions with no live writes", () => {
    const registry = listProviderExecutionActionRegistry();
    const actionTypes = registry.map((entry) => entry.actionType).sort();

    assert.deepEqual(actionTypes, [
      "create_calendar_event_draft",
      "create_gmail_draft",
      "create_google_doc_draft",
      "create_drive_doc_draft",
    ].sort());
    assert.ok(registry.every((entry) => entry.mode === "dry_run_no_live_write"));
    assert.ok(registry.every((entry) => entry.productionBlocked === true));
    assert.ok(registry.every((entry) => entry.liveWriteEnabled === false));
    assert.equal(isProviderExecutionFrameworkAction("create_drive_doc_draft"), true);
    assert.equal(isProviderExecutionFrameworkAction("create_gmail_draft"), true);
    assert.equal(isProviderExecutionFrameworkAction("create_calendar_event_draft"), true);
    assert.equal(isProviderExecutionFrameworkAction("create_drive_doc"), false);
    assert.equal(isProviderExecutionFrameworkAction("drive.files.create"), false);
    assert.equal(isProviderExecutionFrameworkAction("send_email"), false);
  });

  it("creates a redacted dry-run provider request preview without provider calls", () => {
    const preview = createProviderExecutionPreview({
      actionType: "create_drive_doc_draft",
      title: "J Capital test document",
      body: "Dry-run body only.",
      targetFolderId: "real-folder-id-that-must-not-render",
      sourceLabel: "sprint-8:test",
      readinessPacket: readyDrivePacket(),
      ceoApprovalConfirmed: true,
      killSwitchConfirmed: true,
      requestedEnvironment: "preview",
    });
    const serialized = JSON.stringify(preview);

    assert.equal(preview.status, "preview_ready");
    assert.equal(preview.ok, true);
    assert.equal(preview.requestPreview.targetFolder, "[redacted:google_drive_test_folder_id]");
    assert.equal(serialized.includes("real-folder-id-that-must-not-render"), false);
    assert.equal(preview.safety.providerCalled, false);
    assert.equal(preview.safety.wouldCallProvider, false);
    assert.equal(preview.safety.liveExecutionAllowed, false);
    assert.equal(preview.safety.productionBlocked, true);
    assert.doesNotThrow(() => assertProviderExecutionPreviewSafety(preview));
  });

  it("blocks preview readiness when the kill switch is not confirmed", () => {
    const preview = createProviderExecutionPreview({
      actionType: "create_drive_doc_draft",
      title: "J Capital test document",
      body: "Dry-run body only.",
      sourceLabel: "sprint-8:test",
      readinessPacket: createDriveDraftPilotReadinessPacket({
        env: configuredEnv,
        rollbackPlanPresent: true,
        killSwitchConfirmed: false,
        ceoApprovalConfirmed: true,
      }),
      ceoApprovalConfirmed: true,
      killSwitchConfirmed: false,
      requestedEnvironment: "preview",
    });

    assert.equal(preview.ok, false);
    assert.equal(preview.status, "blocked");
    assert.match(preview.blockedReasons.join(" "), /Kill switch is not confirmed/);
    assert.equal(preview.killSwitch.confirmed, false);
    assert.equal(preview.safety.providerCalled, false);
  });

  it("blocks Production and never exposes live Google Drive endpoints", () => {
    const preview = createProviderExecutionPreview({
      actionType: "create_drive_doc_draft",
      title: "J Capital production-blocked document",
      body: "Dry-run body only.",
      sourceLabel: "sprint-8:production-test",
      readinessPacket: readyDrivePacket(),
      ceoApprovalConfirmed: true,
      killSwitchConfirmed: true,
      requestedEnvironment: "production",
    });
    const serialized = JSON.stringify(preview);

    assert.equal(preview.ok, false);
    assert.equal(preview.status, "blocked");
    assert.match(preview.blockedReasons.join(" "), /Preview only/);
    assert.match(preview.blockedReasons.join(" "), /Production provider execution is blocked/);
    assert.equal(serialized.includes("https://www.googleapis.com"), false);
    assert.equal(serialized.includes("drive.files.create"), false);
    assert.equal(serialized.includes("\"create_drive_doc\""), false);
  });

  it("creates Gmail and Calendar draft previews without send insert or schedule authority", () => {
    const gmail = createProviderExecutionPreview({
      actionType: "create_gmail_draft",
      title: "Seller follow-up draft",
      body: "Draft body only for CEO review.",
      recipientPreview: "seller@example.com",
      sourceLabel: "sprint-10:gmail-draft",
      ceoApprovalConfirmed: true,
      killSwitchConfirmed: true,
      requestedEnvironment: "preview",
    });
    const calendar = createProviderExecutionPreview({
      actionType: "create_calendar_event_draft",
      title: "Seller appointment draft",
      body: "Calendar draft only for CEO review.",
      attendeePreview: "seller@example.com",
      startTimePreview: "2026-07-10T15:00:00-05:00",
      sourceLabel: "sprint-10:calendar-draft",
      ceoApprovalConfirmed: true,
      killSwitchConfirmed: true,
      requestedEnvironment: "preview",
    });
    const serialized = JSON.stringify([gmail, calendar]);

    assert.equal(gmail.ok, true);
    assert.equal(calendar.ok, true);
    assert.equal(gmail.safety.providerCalled, false);
    assert.equal(calendar.safety.providerCalled, false);
    assert.equal(gmail.safety.sent, false);
    assert.equal(calendar.safety.scheduled, false);
    assert.equal(serialized.includes("drafts.send"), false);
    assert.equal(serialized.includes("calendar.events.insert"), false);
    assert.equal(serialized.includes("https://www.googleapis.com"), false);
  });

  it("redacts secret-like title and body values from preview JSON", () => {
    const preview = createProviderExecutionPreview({
      actionType: "create_drive_doc_draft",
      title: "GOCSPX-super-secret-client-secret",
      body: "Body contains ya29.refresh-token-that-must-not-render",
      sourceLabel: "sprint-8:redaction-test",
      readinessPacket: readyDrivePacket(),
      ceoApprovalConfirmed: true,
      killSwitchConfirmed: true,
      requestedEnvironment: "preview",
    });
    const serialized = JSON.stringify(preview);

    assert.equal(preview.requestPreview.title, "[redacted]");
    assert.equal(preview.requestPreview.bodyPreview, "[redacted]");
    assert.equal(serialized.includes("GOCSPX-super-secret-client-secret"), false);
    assert.equal(serialized.includes("ya29.refresh-token-that-must-not-render"), false);
    assert.equal(preview.safety.rawPayloadRedacted, true);
  });
});
