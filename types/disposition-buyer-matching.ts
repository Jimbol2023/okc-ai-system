export type DispositionPath =
  | "assign_contract"
  | "double_close"
  | "sell_owned_asset"
  | "package_portfolio"
  | "hold_internal"
  | "pause_review"
  | "do_not_dispose";

export type BuyerType =
  | "cash_buyer"
  | "fix_and_flip_investor"
  | "land_investor"
  | "rental_buyer"
  | "str_buyer"
  | "multifamily_buyer"
  | "commercial_buyer"
  | "builder_developer"
  | "creative_finance_buyer"
  | "institutional_buyer"
  | "unknown";

export type BuyerMatch = {
  buyerId?: string;
  buyerName?: string;
  buyerType: BuyerType;
  matchScore: number;
  reason?: string;
  risks?: string[];
  expectedCloseSpeed?: "fast" | "moderate" | "slow" | "unknown";
  priceFit?: "strong" | "moderate" | "weak" | "unknown";
  fundingReliability?: "strong" | "moderate" | "weak" | "unknown";
};

export type DispositionRecommendation = {
  dispositionPath: DispositionPath;
  targetBuyerType: BuyerType;
  confidence?: number;
  recommendedBuyerMatches?: BuyerMatch[];
  buyerDemandSignal?: "strong" | "moderate" | "weak" | "unknown";
  expectedAssignmentFee?: number;
  expectedExitPrice?: number;
  recommendedMarketingAngle?: string;
  dealPackageChecklist?: string[];
  requiredVerifications?: string[];
  dispositionRisks?: string[];
  stopConditions?: string[];
  complianceWarnings?: string[];
  recommendedNextStep?: string;
};
