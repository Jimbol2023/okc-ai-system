export type FundingApprovalStatus =
  | "approved"
  | "approved_with_conditions"
  | "review_required"
  | "rejected";

export type GuardrailSeverity = "low" | "medium" | "high" | "critical";

export type FundingGuardrail = {
  name: string;
  status: "pass" | "warning" | "fail";
  severity: GuardrailSeverity;
  message: string;
};

export type FundingApprovalReadiness = {
  status: FundingApprovalStatus;
  readinessScore: number;
  guardrails: FundingGuardrail[];
  violatedGuardrails?: FundingGuardrail[];
  requiredFixes?: string[];
  missingDocuments?: string[];
  missingData?: string[];
  fundingConditions?: string[];
  approvalSummary?: string;
  complianceWarnings?: string[];
  recommendedNextStep?: string;
};
