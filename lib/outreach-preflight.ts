import { evaluateLiveSendPermission, type LiveSendPermissionInput, type LiveSendPermissionReason } from "@/lib/outreach-permissions";

export type OutreachPreflightCheck = {
  key: string;
  label: string;
  passed: boolean;
  plannedOnly?: boolean;
};

export type OutreachPreflightResult = {
  allowed: boolean;
  mode: "simulation" | "live";
  providerReady: boolean;
  liveEnabled: boolean;
  emergencyStop: boolean;
  rolloutStage: string;
  blockedReasons: LiveSendPermissionReason[];
  checks: OutreachPreflightCheck[];
  wouldCallProvider: boolean;
  requiresOperatorConfirmation: true;
  simulationFallback: true;
};

export function runLiveOutreachPreflight(input: LiveSendPermissionInput = {}): OutreachPreflightResult {
  const permission = evaluateLiveSendPermission(input);
  const activation = permission.activation;
  const blockedReasons = permission.blockedReasons;
  const hasBlock = (reason: LiveSendPermissionReason) => blockedReasons.includes(reason);

  return {
    allowed: permission.allowed,
    mode: activation.runtimeMode,
    providerReady: activation.providerReady,
    liveEnabled: activation.liveEnabled,
    emergencyStop: activation.emergencyStop,
    rolloutStage: activation.rolloutStage,
    blockedReasons,
    checks: [
      {
        key: "activation_enabled",
        label: "Live activation flag enabled",
        passed: activation.liveEnabled && activation.runtimeMode === "live",
      },
      {
        key: "provider_enabled",
        label: "Provider explicitly enabled",
        passed: activation.providerEnabled,
      },
      {
        key: "provider_ready",
        label: "Provider configuration present",
        passed: activation.providerReady,
      },
      {
        key: "emergency_stop_inactive",
        label: "Emergency stop inactive",
        passed: !activation.emergencyStop,
      },
      {
        key: "operator_confirmation",
        label: "Final operator live-send confirmation",
        passed: !hasBlock("blocked_operator_confirmation_required"),
        plannedOnly: true,
      },
      {
        key: "per_lead_cooldown",
        label: "Per-lead send cooldown",
        passed: false,
        plannedOnly: true,
      },
      {
        key: "duplicate_prevention",
        label: "Duplicate-send prevention",
        passed: false,
        plannedOnly: true,
      },
      {
        key: "per_minute_cap",
        label: "Per-minute send cap",
        passed: false,
        plannedOnly: true,
      },
      {
        key: "operator_quota",
        label: "Operator send quota",
        passed: false,
        plannedOnly: true,
      },
    ],
    wouldCallProvider: false,
    requiresOperatorConfirmation: true,
    simulationFallback: true,
  };
}
