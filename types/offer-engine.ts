export type OfferType =
  | "cash_offer"
  | "wholesale_offer"
  | "flip_offer"
  | "rental_hold_offer"
  | "seller_finance_offer"
  | "subject_to_offer"
  | "land_offer"
  | "partnership_offer"
  | "pass_no_offer";

export type OfferRecommendation = {
  offerType: OfferType;
  recommendedOffer?: number;
  maxAllowableOffer?: number;
  walkAwayPrice?: number;
  openingOffer?: number;
  confidence?: number;
  offerStrength?: "strong" | "moderate" | "weak";
  negotiationRoom?: number;
  expectedProfit?: number;
  marginOfSafety?: number;
  terms?: string[];
  rationale?: string[];
  riskAdjustments?: string[];
  requiredVerifications?: string[];
  missingData?: string[];
  complianceWarnings?: string[];
  recommendedNextStep?: string;
};
