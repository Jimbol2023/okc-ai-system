type AiMemoryLoggerInput = Readonly<Record<string, unknown>>;

type AiMemoryLoggerNoopResult = Readonly<{
  logged: false;
  mode: "noop";
  reason: "ai_memory_logger_not_configured";
}>;

const AI_MEMORY_LOGGER_NOOP_RESULT: AiMemoryLoggerNoopResult = {
  logged: false,
  mode: "noop",
  reason: "ai_memory_logger_not_configured",
};

// Fail-closed build-unblock placeholder pending real AI memory persistence implementation.
// Intentionally performs no database writes, provider calls, environment reads, or runtime side effects.
async function resolveNoop(
  _payload: AiMemoryLoggerInput,
): Promise<AiMemoryLoggerNoopResult> {
  return AI_MEMORY_LOGGER_NOOP_RESULT;
}

export async function logApprovalDecisionMemory(
  payload: AiMemoryLoggerInput,
): Promise<AiMemoryLoggerNoopResult> {
  return resolveNoop(payload);
}

export async function logDealOutcomeMemory(
  payload: AiMemoryLoggerInput,
): Promise<AiMemoryLoggerNoopResult> {
  return resolveNoop(payload);
}

export async function logAiMemoryEvent(
  payload: AiMemoryLoggerInput,
): Promise<AiMemoryLoggerNoopResult> {
  return resolveNoop(payload);
}
