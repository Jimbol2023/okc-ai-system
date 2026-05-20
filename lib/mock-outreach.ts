import { evaluateOutreachEligibility, normalizePhoneForOutreach, type OutreachEligibilityResult, type OutreachLead } from "@/lib/outreach-gating";

export type MockOutreachHistoryItem = {
  id: string;
  at: string;
  provider: "mock" | "not_called";
  mode: "simulation" | "live_disabled";
  simulated: boolean;
  blocked: boolean;
  sent: false;
  wouldSend: false;
  providerCalled: false;
  targetPhone?: string | null;
  messagePreview?: string | null;
  reasonCodes: string[];
  reasons: string[];
  missingRequirements: string[];
};

export type MockOutreachResult = MockOutreachHistoryItem & {
  eligibility: OutreachEligibilityResult;
  safetyCopy: string[];
};

export type MockOutreachLead = OutreachLead & {
  id?: string;
};

function createMockOutreachId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `mock-outreach-${Date.now()}`;
}

export function getMockOutreachMessage(lead: MockOutreachLead) {
  return lead.suggestedReply?.trim() || lead.lastFollowUpMessage?.trim() || "";
}

export function simulateMockOutreach(lead: MockOutreachLead): MockOutreachResult {
  const eligibility = evaluateOutreachEligibility(lead);
  const messagePreview = getMockOutreachMessage(lead);
  const targetPhone = normalizePhoneForOutreach(lead.phone) || lead.phone?.trim() || null;
  const at = new Date().toISOString();
  const blocked = eligibility.blocked;

  return {
    id: createMockOutreachId(),
    at,
    provider: blocked ? "not_called" : "mock",
    mode: eligibility.mode,
    simulated: !blocked,
    blocked,
    sent: false,
    wouldSend: false,
    providerCalled: false,
    targetPhone,
    messagePreview: messagePreview || null,
    reasonCodes: eligibility.reasonCodes,
    reasons: eligibility.reasons,
    missingRequirements: eligibility.missingRequirements,
    eligibility,
    safetyCopy: [
      "Mock simulation only.",
      "No SMS or email was sent.",
      "Live outreach remains disabled.",
    ],
  };
}
