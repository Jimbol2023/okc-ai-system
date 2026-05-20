import { evaluateExecutionPolicy, type ExecutionMode } from "@/lib/execution-policy";

export type ProviderMode = "mock" | "disabled" | "future_live_test";

export type ProviderActionCategory = "sms" | "email";

export type ProviderBoundaryReasonCode =
  | "mock_provider_default"
  | "provider_disabled"
  | "dnc_blocked"
  | "approval_required"
  | "provider_call_forbidden"
  | "future_live_test_not_enabled"
  | "future_live_test_placeholder_only";

export type ProviderBoundaryRequest = {
  action: ProviderActionCategory;
  to: string;
  message: string;
  leadId?: string;
  approved?: boolean;
  dncBlocked?: boolean;
  executionMode?: ExecutionMode;
  providerMode?: ProviderMode;
  futureLiveTestExplicitlyEnabled?: boolean;
};

export type ProviderBoundaryResponse = {
  ok: boolean;
  sent: false;
  providerCalled: false;
  providerMode: ProviderMode;
  action: ProviderActionCategory;
  reasonCodes: ProviderBoundaryReasonCode[];
  safetySummary: string;
};

function addReason(reasonCodes: ProviderBoundaryReasonCode[], reasonCode: ProviderBoundaryReasonCode) {
  if (!reasonCodes.includes(reasonCode)) {
    reasonCodes.push(reasonCode);
  }
}

function buildProviderResponse({
  ok,
  providerMode,
  action,
  reasonCodes,
}: {
  ok: boolean;
  providerMode: ProviderMode;
  action: ProviderActionCategory;
  reasonCodes: ProviderBoundaryReasonCode[];
}): ProviderBoundaryResponse {
  return {
    ok,
    sent: false,
    providerCalled: false,
    providerMode,
    action,
    reasonCodes,
    safetySummary:
      "Provider boundary evaluated without side effects. No SMS, email, provider call, network request, or credential access occurred.",
  };
}

export function createMockProviderResponse(
  action: ProviderActionCategory,
  reasonCodes: ProviderBoundaryReasonCode[] = ["mock_provider_default", "provider_call_forbidden"],
): ProviderBoundaryResponse {
  return buildProviderResponse({
    ok: true,
    providerMode: "mock",
    action,
    reasonCodes,
  });
}

export function createDisabledProviderResponse(
  action: ProviderActionCategory,
  reasonCodes: ProviderBoundaryReasonCode[] = ["provider_disabled", "provider_call_forbidden"],
): ProviderBoundaryResponse {
  return buildProviderResponse({
    ok: false,
    providerMode: "disabled",
    action,
    reasonCodes,
  });
}

export function evaluateProviderBoundary(request: ProviderBoundaryRequest): ProviderBoundaryResponse {
  const providerMode = request.providerMode ?? "mock";
  const executionMode = request.executionMode ?? (providerMode === "future_live_test" ? "future_live_test" : "live_disabled");
  const reasonCodes: ProviderBoundaryReasonCode[] = [];
  const policy = evaluateExecutionPolicy({
    action: request.action,
    mode: executionMode,
    hasHumanApproval: request.approved,
    doNotContact: request.dncBlocked,
    requestedProviderCall: providerMode === "future_live_test",
    futureLiveTestExplicitlyEnabled: request.futureLiveTestExplicitlyEnabled,
  });

  if (providerMode === "mock") addReason(reasonCodes, "mock_provider_default");
  if (providerMode === "disabled") addReason(reasonCodes, "provider_disabled");
  if (request.dncBlocked || policy.dncBlocked) addReason(reasonCodes, "dnc_blocked");
  if (!request.approved) addReason(reasonCodes, "approval_required");
  if (providerMode !== "future_live_test") addReason(reasonCodes, "provider_call_forbidden");

  if (providerMode === "future_live_test") {
    addReason(reasonCodes, "future_live_test_placeholder_only");

    if (!request.futureLiveTestExplicitlyEnabled || !policy.allowed) {
      addReason(reasonCodes, "future_live_test_not_enabled");
    }
  }

  return buildProviderResponse({
    ok: providerMode === "mock" && !request.dncBlocked,
    providerMode,
    action: request.action,
    reasonCodes,
  });
}
