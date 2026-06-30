import { selectToolForAction, type ToolDecisionInput } from "@/lib/tool-capability-manager";

export type SafeAutomationMode = "manual" | "assisted" | "safe_auto_internal" | "safe_auto_limited";

export type AutomationDecision = {
  mode: SafeAutomationMode;
  actionKey: string;
  status: "auto_allowed_internal" | "approval_required" | "blocked";
  riskLevel: "low" | "medium" | "high";
  expectedRoi: "low" | "medium" | "high";
  reason: string;
  auditRequired: true;
  providerCalled: false;
  sent: false;
  published: false;
  scheduled: false;
  liveExecutionAllowed: false;
  toolDecision: ReturnType<typeof selectToolForAction>;
};

const safeInternalActions = new Set([
  "create_flyer_brief",
  "create_social_asset_brief",
  "prepare_gbp_post",
  "queue_sms_draft",
  "verify_ownership",
  "score_roi_opportunity",
  "summarize_macro_signal",
  "draft_relationship_follow_up",
]);

const blockedActions = new Set(["publish", "send_sms", "send_message", "activate_connector", "scrape_source", "change_budget"]);

export function evaluateSafeAutomation(input: ToolDecisionInput & { mode?: SafeAutomationMode; expectedRoi?: "low" | "medium" | "high" }): AutomationDecision {
  const mode = input.mode ?? "safe_auto_internal";
  const toolDecision = selectToolForAction(input);

  if (blockedActions.has(input.requestedAction) || toolDecision.decision === "blocked") {
    return {
      mode,
      actionKey: input.requestedAction,
      status: "blocked",
      riskLevel: "high",
      expectedRoi: input.expectedRoi ?? "medium",
      reason: toolDecision.blockedReason
        ? `Blocked by tool capability manager: ${toolDecision.blockedReason}.`
        : "Blocked because this action is not allowed in safe auto mode.",
      auditRequired: true,
      providerCalled: false,
      sent: false,
      published: false,
      scheduled: false,
      liveExecutionAllowed: false,
      toolDecision,
    };
  }

  if (mode === "safe_auto_internal" && safeInternalActions.has(input.requestedAction)) {
    return {
      mode,
      actionKey: input.requestedAction,
      status: "auto_allowed_internal",
      riskLevel: "low",
      expectedRoi: input.expectedRoi ?? "medium",
      reason: "Safe Auto Internal may create internal drafts, briefs, scores, and review queue items only.",
      auditRequired: true,
      providerCalled: false,
      sent: false,
      published: false,
      scheduled: false,
      liveExecutionAllowed: false,
      toolDecision,
    };
  }

  return {
    mode,
    actionKey: input.requestedAction,
    status: "approval_required",
    riskLevel: "medium",
    expectedRoi: input.expectedRoi ?? "medium",
    reason: "Human approval is required before this action can move beyond internal preparation.",
    auditRequired: true,
    providerCalled: false,
    sent: false,
    published: false,
    scheduled: false,
    liveExecutionAllowed: false,
    toolDecision,
  };
}

export function getSafeAutoDefaults() {
  return {
    mode: "safe_auto_internal" as const,
    autoInternalSummaries: true,
    autoRoiScoring: true,
    autoDraftCreation: true,
    autoRelationshipHealthScoring: true,
    autoContentRepurposingFromApprovedSources: true,
    autoMacroSignalSummaries: true,
    autoExternalProviderCalls: false,
    autoPublishing: false,
    autoMessaging: false,
    autoCalling: false,
    autoCalendarInvites: false,
    autoConnectorActivation: false,
    humanApprovalRequiredForExternalActions: true,
    killSwitchEnabled: true,
  };
}
