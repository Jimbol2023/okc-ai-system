import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertGovernedProviderDraftPreviewSafety,
  assertProviderDraftPayloadValidationSafety,
  assertProviderDraftPreviewSafety,
  createGovernedProviderDraftPreview,
  createProviderDraftPreview,
  isProviderDraftAction,
  listProviderDraftActionRegistry,
  listProviderDraftCapabilities,
  validateAndNormalizeProviderDraftPayload,
} from "@/lib/provider-draft-adapters";

describe("Sprint 10 provider draft adapters", () => {
  it("registers exactly the approved draft planning actions", () => {
    const registry = listProviderDraftActionRegistry();

    assert.deepEqual(
      registry.map((entry) => entry.actionType).sort(),
      [
        "create_calendar_event_draft",
        "create_drive_doc_draft",
        "create_gmail_draft",
        "create_google_doc_draft",
      ].sort(),
    );
    assert.ok(registry.every((entry) => entry.liveWriteEnabled === false));
    assert.ok(registry.every((entry) => entry.productionBlocked === true));
    assert.equal(isProviderDraftAction("send_email"), false);
    assert.equal(isProviderDraftAction("create_drive_doc"), false);
    assert.equal(isProviderDraftAction("drive.files.create"), false);
  });

  it("exposes versioned provider capability metadata derived from the registry", () => {
    const registry = listProviderDraftActionRegistry();
    const capabilities = listProviderDraftCapabilities();

    assert.equal(capabilities.length, registry.length);
    assert.deepEqual(capabilities.map((item) => item.actionType).sort(), registry.map((item) => item.actionType).sort());
    assert.ok(capabilities.every((item) => item.capabilitySchemaVersion === "sprint-10b-v1"));
    assert.ok(capabilities.every((item) => item.providerCalled === false));
    assert.ok(capabilities.every((item) => item.liveExecutionAllowed === false));
    assert.ok(capabilities.every((item) => item.liveWriteEnabled === false));
    assert.ok(capabilities.every((item) => item.productionBlocked === true));
    assert.ok(capabilities.every((item) => item.redactionPolicy === "provider_draft_preview_redaction_v1"));
    assert.ok(capabilities.every((item) => item.futureSprintMapping.includes("10B_metadata_only")));
    assert.ok(capabilities.every((item) => item.futureSprintMapping.includes("10C_payload_validation")));
    assert.ok(capabilities.every((item) => item.futureSprintMapping.includes("10D_preview_integration")));
  });

  it("maps capabilities to departments AI employees and human review categories", () => {
    const byAction = new Map(listProviderDraftCapabilities().map((item) => [item.actionType, item]));

    assert.equal(byAction.get("create_gmail_draft")?.ownerDepartment, "Revenue Operations");
    assert.equal(byAction.get("create_gmail_draft")?.aiEmployeeOwner, "Executive Assistant AI");
    assert.ok(byAction.get("create_gmail_draft")?.humanReviewCategories.includes("recipient_review"));
    assert.equal(byAction.get("create_calendar_event_draft")?.ownerDepartment, "Operations");
    assert.ok(byAction.get("create_calendar_event_draft")?.humanReviewCategories.includes("attendee_time_review"));
    assert.equal(byAction.get("create_drive_doc_draft")?.aiEmployeeOwner, "AI COO");
    assert.ok(byAction.get("create_google_doc_draft")?.humanReviewCategories.includes("document_title_body_review"));
  });

  it("uses the blocked operation taxonomy for every provider capability", () => {
    const requiredBlockedOperations = [
      "provider_write",
      "send",
      "insert",
      "update",
      "patch",
      "delete",
      "publish",
      "schedule",
      "upload",
      "share",
      "oauth_scope_change",
      "provider_endpoint_call",
    ];

    for (const capability of listProviderDraftCapabilities()) {
      for (const operation of requiredBlockedOperations) {
        assert.ok(capability.forbiddenOperations.includes(operation as never), `${capability.actionType} missing ${operation}`);
      }
      assert.ok(capability.fallbackInstruction.length > 20);
      assert.ok(capability.auditReadinessLabel.endsWith("_required"));
      assert.ok(capability.memoryReadinessLabel.endsWith("_required"));
    }
  });

  it("does not expose raw provider endpoints or secrets in capability summaries", () => {
    const serialized = JSON.stringify(listProviderDraftCapabilities());

    assert.equal(serialized.includes("https://www.googleapis.com"), false);
    assert.equal(serialized.includes("gmail.googleapis.com"), false);
    assert.equal(serialized.includes("drive.files.create"), false);
    assert.equal(serialized.includes("calendar.events.insert"), false);
    assert.equal(serialized.includes("drafts.send"), false);
    assert.equal(serialized.includes("GOCSPX-"), false);
    assert.equal(serialized.includes("ya29."), false);
    assert.equal(serialized.includes("Bearer "), false);
  });

  it("validates and normalizes Sprint 10C draft payloads before preview", () => {
    const validation = validateAndNormalizeProviderDraftPayload({
      actionType: "create_gmail_draft",
      title: " Seller follow-up ",
      body: " Draft body for CEO review.\n\nNo send authority. ",
      recipientPreview: "seller@example.com",
      sourceLabel: " sprint-10c:gmail ",
    });

    assert.equal(validation.payloadSchemaVersion, "sprint-10c-v1");
    assert.equal(validation.ok, true);
    assert.equal(validation.status, "valid");
    assert.equal(validation.normalizedPayload?.title, "Seller follow-up");
    assert.equal(validation.normalizedPayload?.body, "Draft body for CEO review. No send authority.");
    assert.equal(validation.normalizedPayload?.providerCalled, false);
    assert.equal(validation.normalizedPayload?.liveExecutionAllowed, false);
    assert.ok(validation.requiredFields.includes("recipientPreview"));
    assert.doesNotThrow(() => assertProviderDraftPayloadValidationSafety(validation));
  });

  it("blocks unsupported and incomplete payloads without provider execution", () => {
    const unsupported = validateAndNormalizeProviderDraftPayload({
      actionType: "send_email",
      title: "Blocked",
      body: "Blocked body.",
      sourceLabel: "sprint-10c:blocked",
    });
    const missingCalendarFields = validateAndNormalizeProviderDraftPayload({
      actionType: "create_calendar_event_draft",
      title: "Appointment",
      body: "Missing attendee and time.",
      sourceLabel: "sprint-10c:calendar",
    });

    assert.equal(unsupported.ok, false);
    assert.equal(unsupported.status, "invalid_action");
    assert.equal(unsupported.normalizedPayload, null);
    assert.equal(unsupported.providerCalled, false);
    assert.equal(missingCalendarFields.ok, false);
    assert.equal(missingCalendarFields.status, "invalid");
    assert.match(missingCalendarFields.blockedReasons.join(" "), /attendeePreview/);
    assert.match(missingCalendarFields.blockedReasons.join(" "), /startTimePreview/);
    assert.equal(missingCalendarFields.liveExecutionAllowed, false);
  });

  it("redacts secret-like values during Sprint 10C payload normalization", () => {
    const validation = validateAndNormalizeProviderDraftPayload({
      actionType: "create_google_doc_draft",
      title: "GOCSPX-super-secret-client-secret",
      body: "Bearer abc https://www.googleapis.com/docs/v1/documents ya29.refresh-token",
      sourceLabel: "sprint-10c:redaction",
    });
    const serialized = JSON.stringify(validation);

    assert.equal(validation.ok, false);
    assert.ok(validation.redactedFields.includes("title"));
    assert.ok(validation.redactedFields.includes("body"));
    assert.equal(validation.normalizedPayload?.title, "[redacted]");
    assert.equal(validation.normalizedPayload?.body, "[redacted]");
    assert.equal(serialized.includes("GOCSPX-super-secret-client-secret"), false);
    assert.equal(serialized.includes("https://www.googleapis.com"), false);
    assert.doesNotThrow(() => assertProviderDraftPayloadValidationSafety(validation));
  });

  it("creates Sprint 10D governed previews from normalized payloads only", () => {
    const governed = createGovernedProviderDraftPreview({
      actionType: "create_calendar_event_draft",
      title: "Seller appointment draft",
      body: "Calendar draft only for CEO review.",
      attendeePreview: "seller@example.com",
      startTimePreview: "2026-07-10T15:00:00-05:00",
      sourceLabel: "sprint-10d:calendar",
      ceoApprovalConfirmed: true,
      killSwitchConfirmed: true,
      requestedEnvironment: "preview",
    });

    assert.equal(governed.previewIntegrationVersion, "sprint-10d-v1");
    assert.equal(governed.ok, true);
    assert.equal(governed.status, "preview_ready");
    assert.equal(governed.validation.ok, true);
    assert.equal(governed.preview?.safety.providerCalled, false);
    assert.equal(governed.integration.providerCalled, false);
    assert.equal(governed.integration.liveExecutionAllowed, false);
    assert.equal(governed.integration.autonomousExecution, false);
    assert.equal(governed.integration.noProviderRouteCreated, true);
    assert.equal(governed.integration.noOAuthChange, true);
    assert.equal(governed.integration.noDeployment, true);
    assert.doesNotThrow(() => assertGovernedProviderDraftPreviewSafety(governed));
  });

  it("keeps Sprint 10D production previews blocked and provider-call free", () => {
    const governed = createGovernedProviderDraftPreview({
      actionType: "create_gmail_draft",
      title: "Seller follow-up",
      body: "Draft body only.",
      recipientPreview: "seller@example.com",
      sourceLabel: "sprint-10d:production-block",
      ceoApprovalConfirmed: true,
      killSwitchConfirmed: true,
      requestedEnvironment: "production",
    });

    assert.equal(governed.ok, false);
    assert.equal(governed.status, "blocked");
    assert.match(governed.preview?.blockedReasons.join(" ") ?? "", /Production provider execution is blocked/);
    assert.equal(governed.integration.providerCalled, false);
    assert.equal(governed.preview?.safety.wouldCallProvider, false);
    assert.doesNotThrow(() => assertGovernedProviderDraftPreviewSafety(governed));
  });

  it("redacts secret-like values and provider endpoints from previews", () => {
    const preview = createProviderDraftPreview({
      actionType: "create_google_doc_draft",
      title: "GOCSPX-super-secret-client-secret",
      body: "Bearer abc https://www.googleapis.com/drive/v3/files ya29.refresh-token-that-must-not-render",
      sourceLabel: "sprint-10:redaction",
      ceoApprovalConfirmed: true,
      killSwitchConfirmed: true,
      requestedEnvironment: "preview",
    });
    const serialized = JSON.stringify(preview);

    assert.equal(preview.ok, false);
    assert.equal(preview.requestPreview.title, "[redacted]");
    assert.equal(preview.requestPreview.bodyPreview, "[redacted]");
    assert.match(preview.blockedReasons.join(" "), /redacted/i);
    assert.equal(serialized.includes("GOCSPX-super-secret-client-secret"), false);
    assert.equal(serialized.includes("ya29.refresh-token-that-must-not-render"), false);
    assert.equal(serialized.includes("https://www.googleapis.com"), false);
  });

  it("blocks Production for every adapter without provider execution", () => {
    for (const action of listProviderDraftActionRegistry().map((entry) => entry.actionType)) {
      const preview = createProviderDraftPreview({
        actionType: action,
        title: "Production blocked draft",
        body: "Draft body only.",
        targetConfigured: action === "create_drive_doc_draft",
        sourceLabel: `sprint-10:${action}`,
        ceoApprovalConfirmed: true,
        killSwitchConfirmed: true,
        requestedEnvironment: "production",
      });

      assert.equal(preview.ok, false);
      assert.equal(preview.safety.providerCalled, false);
      assert.equal(preview.safety.liveExecutionAllowed, false);
      assert.match(preview.blockedReasons.join(" "), /Production provider execution is blocked/);
    }
  });

  it("keeps Gmail and Calendar as draft previews only", () => {
    const gmail = createProviderDraftPreview({
      actionType: "create_gmail_draft",
      title: "Gmail draft",
      body: "Draft message only.",
      recipientPreview: "seller@example.com",
      sourceLabel: "sprint-10:gmail",
      ceoApprovalConfirmed: true,
      killSwitchConfirmed: true,
      requestedEnvironment: "preview",
    });
    const calendar = createProviderDraftPreview({
      actionType: "create_calendar_event_draft",
      title: "Calendar draft",
      body: "Draft event only.",
      attendeePreview: "seller@example.com",
      startTimePreview: "2026-07-10T15:00:00-05:00",
      sourceLabel: "sprint-10:calendar",
      ceoApprovalConfirmed: true,
      killSwitchConfirmed: true,
      requestedEnvironment: "preview",
    });
    const serialized = JSON.stringify([gmail, calendar]);

    assert.equal(gmail.ok, true);
    assert.equal(calendar.ok, true);
    assert.equal(gmail.safety.sent, false);
    assert.equal(calendar.safety.scheduled, false);
    assert.equal(gmail.safety.providerCalled, false);
    assert.equal(calendar.safety.liveExecutionAllowed, false);
    assert.equal(serialized.includes("drafts.send"), false);
    assert.equal(serialized.includes("calendar.events.insert"), false);
    assert.doesNotThrow(() => assertProviderDraftPreviewSafety(gmail));
    assert.doesNotThrow(() => assertProviderDraftPreviewSafety(calendar));
  });
});
