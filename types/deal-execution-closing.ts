export type ClosingPath =
  | "assignment"
  | "double_close"
  | "direct_purchase"
  | "seller_finance_close"
  | "subject_to_close"
  | "hold_internal"
  | "pause_review"
  | "do_not_close";

export type ClosingReadinessStatus =
  | "ready_to_close"
  | "almost_ready"
  | "review_required"
  | "not_ready"
  | "do_not_close";

export type ClosingChecklistItem = {
  name: string;
  status: "complete" | "missing" | "needs_review" | "not_applicable";
  severity?: "low" | "medium" | "high" | "critical";
  note?: string;
};

export type DealExecutionClosingRecommendation = {
  closingPath: ClosingPath;
  readinessStatus: ClosingReadinessStatus;
  readinessScore: number;
  checklist: ClosingChecklistItem[];
  missingItems?: string[];
  blockerItems?: string[];
  titleRisks?: string[];
  buyerRisks?: string[];
  sellerRisks?: string[];
  fundingRisks?: string[];
  timelineRisks?: string[];
  requiredVerifications?: string[];
  recommendedClosingSequence?: string[];
  complianceWarnings?: string[];
  recommendedNextStep?: string;
};
