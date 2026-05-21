export type LiveTestReadinessLevel = "blocked" | "planning_only" | "simulation_ready";

export type LiveTestReadinessReasonCode =
  | "runtime_contract_missing"
  | "runtime_contract_blocked"
  | "runtime_contract_not_adapter_only"
  | "sent_must_be_false"
  | "provider_called_must_be_false"
  | "can_send_now_must_be_false"
  | "simulation_only_required"
  | "operator_confirmation_missing"
  | "operator_confirmation_invalid"
  | "audit_persistence_missing"
  | "audit_persistence_unsafe"
  | "audit_persistence_executed_forbidden"
  | "db_write_attempted_forbidden"
  | "execution_policy_blocked"
  | "execution_policy_sent_forbidden"
  | "execution_policy_provider_called_forbidden"
  | "provider_boundary_blocked"
  | "provider_boundary_called_forbidden"
  | "approval_required"
  | "dnc_blocked"
  | "opt_out_blocked"
  | "allowlist_blocked"
  | "kill_switch_blocked"
  | "emergency_stop_active"
  | "simulation_ready_only"
  | "live_test_not_authorized";

export type ReadinessRuntimeContractSignal = {
  ok?: boolean;
  adapterOnly?: boolean;
  sent?: boolean;
  providerCalled?: boolean;
  canSendNow?: boolean;
  simulationOnly?: boolean;
  reasonCodes?: string[];
};

export type ReadinessOperatorConfirmationSignal = {
  operatorConfirmed?: boolean;
  confirmationValid?: boolean;
  state?: string;
  sent?: boolean;
  providerCalled?: boolean;
  canSendNow?: boolean;
  simulationOnly?: boolean;
  reasonCodes?: string[];
};

export type ReadinessAuditPersistenceSignal = {
  persistencePlanned?: boolean;
  persistenceExecuted?: boolean;
  dbWriteAttempted?: boolean;
  readinessState?: string;
  forbiddenFieldsDetected?: string[];
  sent?: boolean;
  providerCalled?: boolean;
  canSendNow?: boolean;
  simulationOnly?: boolean;
  reasonCodes?: string[];
};

export type ReadinessExecutionPolicySignal = {
  allowed?: boolean;
  mode?: string;
  sent?: boolean;
  providerCalled?: boolean;
  dncBlocked?: boolean;
  requiresHumanApproval?: boolean;
  reasonCodes?: string[];
};

export type ReadinessProviderBoundarySignal = {
  ok?: boolean;
  providerMode?: string;
  sent?: boolean;
  providerCalled?: boolean;
  reasonCodes?: string[];
};

export type LiveTestReadinessSummaryInput = {
  runtimeContract?: ReadinessRuntimeContractSignal;
  operatorConfirmation?: ReadinessOperatorConfirmationSignal;
  auditPersistence?: ReadinessAuditPersistenceSignal;
  executionPolicy?: ReadinessExecutionPolicySignal;
  providerBoundary?: ReadinessProviderBoundarySignal;
  approvalStatus?: string;
  doNotContact?: boolean;
  optOutReason?: string | null;
  allowlistAllowed?: boolean;
  killSwitchAllowed?: boolean;
  killSwitchActive?: boolean;
  emergencyStopActive?: boolean;
  simulationOnly?: boolean;
  reasonCodes?: string[];
};

export type LiveTestReadinessSummaryResult = {
  readinessLevel: LiveTestReadinessLevel;
  liveTestReady: false;
  canSendNow: false;
  sent: false;
  providerCalled: false;
  simulationOnly: true;
  reasonCodes: string[];
  blockingFactors: string[];
  advisoryFactors: string[];
  requiredNextHumanActions: string[];
  summary: string;
};

export type LiveTestReadinessSummaryInvariantCheck = {
  passed: boolean;
  reasonCodes: Array<
    | "live_test_ready_must_be_false"
    | "can_send_now_must_be_false"
    | "sent_must_be_false"
    | "provider_called_must_be_false"
    | "simulation_only_required"
  >;
};

const maxListItems = 40;
const maxTextLength = 160;
const maxSummaryLength = 500;

function addUnique(list: string[], value: string) {
  const normalizedValue = boundText(value);

  if (normalizedValue && !list.includes(normalizedValue) && list.length < maxListItems) {
    list.push(normalizedValue);
  }
}

function addReason(reasonCodes: string[], reasonCode: LiveTestReadinessReasonCode) {
  addUnique(reasonCodes, reasonCode);
}

function normalizeText(value?: string | null) {
  return value?.trim() ?? "";
}

function boundText(value?: string | null) {
  const normalizedValue = normalizeText(value);

  if (normalizedValue.length <= maxTextLength) return normalizedValue;

  return `${normalizedValue.slice(0, maxTextLength)}...`;
}

function boundSummary(summary: string) {
  if (summary.length <= maxSummaryLength) return summary;

  return `${summary.slice(0, maxSummaryLength)}...`;
}

function collectExternalReasonCodes(reasonCodes: string[] | undefined, target: string[]) {
  for (const reasonCode of reasonCodes ?? []) {
    addUnique(target, reasonCode);
  }
}

function addBlocking(blockingFactors: string[], factor: string) {
  addUnique(blockingFactors, factor);
}

function addAdvisory(advisoryFactors: string[], factor: string) {
  addUnique(advisoryFactors, factor);
}

function addHumanAction(requiredNextHumanActions: string[], action: string) {
  addUnique(requiredNextHumanActions, action);
}

function hasBlockers(blockingFactors: string[]) {
  return blockingFactors.length > 0;
}

export function assertLiveTestReadinessSummaryInvariants(
  result: Pick<LiveTestReadinessSummaryResult, "liveTestReady" | "canSendNow" | "sent" | "providerCalled" | "simulationOnly">,
): LiveTestReadinessSummaryInvariantCheck {
  const reasonCodes: LiveTestReadinessSummaryInvariantCheck["reasonCodes"] = [];

  if (result.liveTestReady !== false) reasonCodes.push("live_test_ready_must_be_false");
  if (result.canSendNow !== false) reasonCodes.push("can_send_now_must_be_false");
  if (result.sent !== false) reasonCodes.push("sent_must_be_false");
  if (result.providerCalled !== false) reasonCodes.push("provider_called_must_be_false");
  if (result.simulationOnly !== true) reasonCodes.push("simulation_only_required");

  return {
    passed: reasonCodes.length === 0,
    reasonCodes,
  };
}

export function summarizeLiveTestReadiness(result: LiveTestReadinessSummaryResult) {
  const invariantCheck = assertLiveTestReadinessSummaryInvariants(result);

  return boundSummary(
    `Live-test readiness is ${result.readinessLevel}. ` +
      `${result.blockingFactors.length} blocking factors, ${result.advisoryFactors.length} advisory factors, and ` +
      `${result.requiredNextHumanActions.length} required human actions are present. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "Live sending remains unavailable; no SMS, email, provider call, DB write, env read, or automation execution is authorized.",
  );
}

export function createLiveTestReadinessSummary(input: LiveTestReadinessSummaryInput = {}): LiveTestReadinessSummaryResult {
  const reasonCodes: string[] = [];
  const blockingFactors: string[] = [];
  const advisoryFactors: string[] = [];
  const requiredNextHumanActions: string[] = [];
  const runtime = input.runtimeContract;
  const operatorConfirmation = input.operatorConfirmation;
  const auditPersistence = input.auditPersistence;
  const executionPolicy = input.executionPolicy;
  const providerBoundary = input.providerBoundary;
  const approvalStatus = normalizeText(input.approvalStatus);

  collectExternalReasonCodes(input.reasonCodes, reasonCodes);
  collectExternalReasonCodes(runtime?.reasonCodes, reasonCodes);
  collectExternalReasonCodes(operatorConfirmation?.reasonCodes, reasonCodes);
  collectExternalReasonCodes(auditPersistence?.reasonCodes, reasonCodes);
  collectExternalReasonCodes(executionPolicy?.reasonCodes, reasonCodes);
  collectExternalReasonCodes(providerBoundary?.reasonCodes, reasonCodes);

  if (!runtime) {
    addReason(reasonCodes, "runtime_contract_missing");
    addBlocking(blockingFactors, "Runtime contract preview is missing.");
    addHumanAction(requiredNextHumanActions, "Create a fresh simulation-only runtime contract preview.");
  } else {
    if (runtime.ok !== true) {
      addReason(reasonCodes, "runtime_contract_blocked");
      addBlocking(blockingFactors, "Runtime contract is blocked.");
    }
    if (runtime.adapterOnly !== true) {
      addReason(reasonCodes, "runtime_contract_not_adapter_only");
      addBlocking(blockingFactors, "Runtime contract is not adapter-only.");
    }
    if (runtime.sent === true) {
      addReason(reasonCodes, "sent_must_be_false");
      addBlocking(blockingFactors, "Runtime contract indicates a send occurred.");
    }
    if (runtime.providerCalled === true) {
      addReason(reasonCodes, "provider_called_must_be_false");
      addBlocking(blockingFactors, "Runtime contract indicates a provider call occurred.");
    }
    if (runtime.canSendNow === true) {
      addReason(reasonCodes, "can_send_now_must_be_false");
      addBlocking(blockingFactors, "Runtime contract indicates immediate send permission.");
    }
    if (runtime.simulationOnly !== true) {
      addReason(reasonCodes, "simulation_only_required");
      addBlocking(blockingFactors, "Runtime contract is not simulation-only.");
    }
  }

  if (!operatorConfirmation?.confirmationValid) {
    addReason(reasonCodes, operatorConfirmation ? "operator_confirmation_invalid" : "operator_confirmation_missing");
    addBlocking(blockingFactors, "Valid operator confirmation for the exact simulated action is missing.");
    addHumanAction(requiredNextHumanActions, "Confirm the exact simulated action after reviewing all gates.");
  }
  if (operatorConfirmation?.sent === true) {
    addReason(reasonCodes, "sent_must_be_false");
    addBlocking(blockingFactors, "Operator confirmation signal indicates a send occurred.");
  }
  if (operatorConfirmation?.providerCalled === true) {
    addReason(reasonCodes, "provider_called_must_be_false");
    addBlocking(blockingFactors, "Operator confirmation signal indicates provider execution.");
  }
  if (operatorConfirmation?.canSendNow === true || operatorConfirmation?.simulationOnly === false) {
    addReason(reasonCodes, "simulation_only_required");
    addBlocking(blockingFactors, "Operator confirmation signal violates simulation-only readiness.");
  }

  if (!auditPersistence) {
    addReason(reasonCodes, "audit_persistence_missing");
    addBlocking(blockingFactors, "Audit persistence planning signal is missing.");
    addHumanAction(requiredNextHumanActions, "Prepare a safe non-secret audit persistence plan.");
  } else {
    if (auditPersistence.persistenceExecuted === true) {
      addReason(reasonCodes, "audit_persistence_executed_forbidden");
      addBlocking(blockingFactors, "Audit persistence was executed during a planning-only phase.");
    }
    if (auditPersistence.dbWriteAttempted === true) {
      addReason(reasonCodes, "db_write_attempted_forbidden");
      addBlocking(blockingFactors, "Audit persistence attempted a DB write.");
    }
    if (
      auditPersistence.readinessState !== "ready_for_future_persistence" ||
      auditPersistence.forbiddenFieldsDetected?.length
    ) {
      addReason(reasonCodes, "audit_persistence_unsafe");
      addBlocking(blockingFactors, "Audit persistence plan is not safe for future persistence.");
      addHumanAction(requiredNextHumanActions, "Resolve audit persistence safety blockers before any live-test scope.");
    }
    if (auditPersistence.sent === true || auditPersistence.providerCalled === true || auditPersistence.canSendNow === true) {
      addReason(reasonCodes, "audit_persistence_unsafe");
      addBlocking(blockingFactors, "Audit persistence signal contains execution flags.");
    }
    if (auditPersistence.simulationOnly !== true) {
      addReason(reasonCodes, "simulation_only_required");
      addBlocking(blockingFactors, "Audit persistence signal is not simulation-only.");
    }
  }

  if (executionPolicy) {
    if (executionPolicy.allowed !== true) {
      addReason(reasonCodes, "execution_policy_blocked");
      addBlocking(blockingFactors, "Execution policy is not allowing the simulation path.");
    }
    if (executionPolicy.sent === true) {
      addReason(reasonCodes, "execution_policy_sent_forbidden");
      addBlocking(blockingFactors, "Execution policy signal indicates a send occurred.");
    }
    if (executionPolicy.providerCalled === true) {
      addReason(reasonCodes, "execution_policy_provider_called_forbidden");
      addBlocking(blockingFactors, "Execution policy signal indicates provider execution.");
    }
    if (executionPolicy.dncBlocked === true) {
      addReason(reasonCodes, "dnc_blocked");
      addBlocking(blockingFactors, "Execution policy indicates DNC is blocking outreach.");
    }
    if (executionPolicy.requiresHumanApproval === true) {
      addReason(reasonCodes, "approval_required");
      addHumanAction(requiredNextHumanActions, "Complete human approval review.");
    }
  } else {
    addAdvisory(advisoryFactors, "Execution policy signal was not supplied.");
  }

  if (providerBoundary) {
    if (providerBoundary.ok !== true) {
      addReason(reasonCodes, "provider_boundary_blocked");
      addBlocking(blockingFactors, "Provider boundary is blocked or disabled.");
    }
    if (providerBoundary.providerCalled === true || providerBoundary.sent === true) {
      addReason(reasonCodes, "provider_boundary_called_forbidden");
      addBlocking(blockingFactors, "Provider boundary indicates execution occurred.");
    }
  } else {
    addAdvisory(advisoryFactors, "Provider boundary signal was not supplied.");
  }

  if (input.doNotContact === true) {
    addReason(reasonCodes, "dnc_blocked");
    addBlocking(blockingFactors, "Lead is marked Do Not Contact.");
  }
  if (normalizeText(input.optOutReason)) {
    addReason(reasonCodes, "opt_out_blocked");
    addBlocking(blockingFactors, "Lead has an opt-out reason.");
  }
  if (approvalStatus !== "approved_for_outreach") {
    addReason(reasonCodes, "approval_required");
    addBlocking(blockingFactors, "Approval status is not approved_for_outreach.");
    addHumanAction(requiredNextHumanActions, "Approve the simulated outreach context before further planning.");
  }
  if (input.allowlistAllowed !== true) {
    addReason(reasonCodes, "allowlist_blocked");
    addBlocking(blockingFactors, "Recipient is not allowlist-approved.");
    addHumanAction(requiredNextHumanActions, "Verify recipient allowlist status.");
  }
  if (input.killSwitchAllowed !== true || input.killSwitchActive === true) {
    addReason(reasonCodes, "kill_switch_blocked");
    addBlocking(blockingFactors, "Kill-switch policy is blocking readiness.");
  }
  if (input.emergencyStopActive === true) {
    addReason(reasonCodes, "emergency_stop_active");
    addBlocking(blockingFactors, "Emergency stop is active.");
  }
  if (input.simulationOnly !== true) {
    addReason(reasonCodes, "simulation_only_required");
    addBlocking(blockingFactors, "Top-level readiness input is not simulation-only.");
  }

  addReason(reasonCodes, "live_test_not_authorized");
  addReason(reasonCodes, "simulation_ready_only");
  addAdvisory(advisoryFactors, "Best possible R47F outcome is simulation_ready; liveTestReady remains false.");

  const readinessLevel: LiveTestReadinessLevel = hasBlockers(blockingFactors)
    ? "blocked"
    : requiredNextHumanActions.length > 0
      ? "planning_only"
      : "simulation_ready";
  const result: LiveTestReadinessSummaryResult = {
    readinessLevel,
    liveTestReady: false,
    canSendNow: false,
    sent: false,
    providerCalled: false,
    simulationOnly: true,
    reasonCodes,
    blockingFactors,
    advisoryFactors,
    requiredNextHumanActions,
    summary: "Live-test readiness summary contract only. Live execution remains unavailable.",
  };

  return {
    ...result,
    summary: summarizeLiveTestReadiness(result),
  };
}
