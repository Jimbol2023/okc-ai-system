export type FundingMethod =
  | "cash"
  | "private_money"
  | "hard_money"
  | "bridge_lending"
  | "transactional_funding"
  | "seller_finance"
  | "subject_to"
  | "partnership"
  | "buyer_funded_double_close"
  | "pass_or_wait";

export type FundingRecommendation = {
  primaryMethod: FundingMethod;
  confidence?: number;
  capitalRequired?: number;
  estimatedDownPayment?: number;
  estimatedLoanAmount?: number;
  fundingFit?: "strong" | "moderate" | "weak";
  speedFit?: "fast" | "moderate" | "slow";
  strategyFit?: "strong" | "moderate" | "weak";
  reasons?: string[];
  risks?: string[];
  blockers?: string[];
  backupMethods?: {
    method: FundingMethod;
    score: number;
    reason?: string;
  }[];
  complianceWarnings?: string[];
  recommendedNextStep?: string;
};
