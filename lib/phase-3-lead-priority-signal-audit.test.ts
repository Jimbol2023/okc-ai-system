import {
  assertPhase3LeadPrioritySignalAuditSafe,
  getPhase3LeadPrioritySignalAudit,
  getPhase3LeadPrioritySignalAuditSummary,
  phase3LeadPrioritySignalAuditFlags,
  phase3PrioritySignalFamilies,
} from "./phase-3-lead-priority-signal-audit";

describe("phase 3B lead priority signal audit", () => {
  it("pins Phase 3B fields and audits all repo-grounded priority signal families", () => {
    const result = getPhase3LeadPrioritySignalAudit();

    expect(result.phase).toBe("Phase 3: Lead Prioritization Engine");
    expect(result.phaseStep).toBe("Phase 3B — Lead Priority Signal Audit");
    expect(result.previousStep).toBe("Phase 3A — Lead Prioritization Engine Scope");
    expect(result.phaseDecision).toBe("signal_audit_only");
    expect(result.signalFamilies).toEqual(phase3PrioritySignalFamilies);
    expect(result.signalFamilies).toEqual([
      "score",
      "priority",
      "status",
      "source",
      "payload",
      "notes",
      "follow_up_fields",
      "reply_fields",
      "dnc_fields",
      "approval_fields",
      "distress_flags",
      "seller_call_signals",
      "duplicate_contact_safety_indicators",
    ]);
  });

  it("keeps decisions blocked boundaries safe and hands off to Phase 3C", () => {
    const result = getPhase3LeadPrioritySignalAudit();

    expect(result.implementationDecision).toBe("not_authorized");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.automationDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.scorePersistenceDecision).toBe("not_authorized");
    expect(result.crmMutationDecision).toBe("not_authorized");
    expect(result.routingDecision).toBe("not_authorized");
    expect(result.queueAssignmentDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("Phase 3C — Advisory Prioritization Policy");
    expect(result.auditPurpose.join(" ")).toMatch(/hidden scoring/i);
    expect(result.aiOperatorLeverageBoundary.join(" ")).toMatch(/do not invent property facts/i);
    expect(result.humanOwnershipBoundary.join(" ")).toMatch(/final signal importance judgment/i);
    expect(result.flags.signalAuditOnly).toBe(true);
    expect(result.flags.scorePersistenceEnabled).toBe(false);
    expect(result.flags.crmMutationEnabled).toBe(false);
    expect(result.flags.routingEnabled).toBe(false);
  });

  it("summarizes signal audit and blocked execution", () => {
    const summary = getPhase3LeadPrioritySignalAuditSummary();

    expect(summary).toMatch(/Phase 3B/i);
    expect(summary).toMatch(/score, priority, status, source, payload, notes/i);
    expect(summary).toMatch(/DNC/i);
    expect(summary).toMatch(/duplicate\/contact-safety/i);
    expect(summary).toMatch(/No score persistence/i);
    expect(summary).toMatch(/Phase 3C — Advisory Prioritization Policy/i);
  });

  it("throws on missing signals blocked flag missing boundaries and unsafe wording", () => {
    const result = getPhase3LeadPrioritySignalAudit();

    expect(() => assertPhase3LeadPrioritySignalAuditSafe({ ...result, signalFamilies: phase3PrioritySignalFamilies.slice(0, -1) })).toThrow(/signal families/i);
    expect(() => assertPhase3LeadPrioritySignalAuditSafe({ ...result, flags: { ...phase3LeadPrioritySignalAuditFlags, crmMutationEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase3LeadPrioritySignalAuditSafe({ ...result, aiOperatorLeverageBoundary: [] })).toThrow(/AI boundary/i);
    expect(() => assertPhase3LeadPrioritySignalAuditSafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase3LeadPrioritySignalAuditSafe({ ...result, auditPurpose: ["CRM mutation is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
