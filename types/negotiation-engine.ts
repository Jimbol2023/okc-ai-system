export type NegotiationPosture =
  | "soft_consultative"
  | "firm_investor"
  | "problem_solver"
  | "urgent_deadline"
  | "data_driven"
  | "pause_review";

export type NegotiationStatus =
  | "ready_to_negotiate"
  | "negotiate_with_conditions"
  | "review_required"
  | "do_not_negotiate";

export type SellerObjection = {
  objection: string;
  likelyReason?: string;
  responseStrategy?: string;
  sampleResponse?: string;
  riskLevel?: "low" | "medium" | "high";
};

export type NegotiationRecommendation = {
  status: NegotiationStatus;
  posture: NegotiationPosture;
  openingPosition?: string;
  targetOutcome?: string;
  walkAwayTrigger?: string;
  safeConcessions?: string[];
  unsafeConcessions?: string[];
  likelyObjections?: SellerObjection[];
  talkingPoints?: string[];
  negotiationRisks?: string[];
  requiredVerifications?: string[];
  complianceWarnings?: string[];
  recommendedNextStep?: string;
};
