export type CapitalStackMethod =
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

export type CapitalStackScenario = {
  method: CapitalStackMethod;
  score: number;
  estimatedProfit?: number;
  cashRequired?: number;
  estimatedLoanAmount?: number;
  estimatedDownPayment?: number;
  interestRate?: number;
  points?: number;
  monthlyCarryingCost?: number;
  totalFinancingCost?: number;
  timelineDays?: number;
  riskLevel?: "low" | "medium" | "high";
  speedFit?: "fast" | "moderate" | "slow";
  cashPreservation?: "strong" | "moderate" | "weak";
  feasibility?: "high" | "medium" | "low";
  reasons?: string[];
  risks?: string[];
};

export type FundingSensitivityResult = {
  bestMethod: CapitalStackMethod;
  bestReason?: string;
  scenarios: CapitalStackScenario[];
  sensitivityAlerts?: string[];
  stressTests?: {
    interestRateIncrease?: string;
    repairCostIncrease?: string;
    timelineDelay?: string;
    lowerExitPrice?: string;
  };
  avoidMethods?: {
    method: CapitalStackMethod;
    reason: string;
  }[];
  complianceWarnings?: string[];
  recommendedNextStep?: string;
};
