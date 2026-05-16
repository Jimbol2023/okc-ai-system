export type PortfolioAction =
  | "wholesale"
  | "flip"
  | "hold"
  | "creative_finance"
  | "package_portfolio"
  | "pass";

export type PortfolioDecision = {
  action: PortfolioAction;
  confidence?: number;
  rationale?: string[];
  risks?: string[];
  assumptions?: string[];
  estimatedReturn?: {
    profit?: number;
    roi?: number;
    irr?: number;
  };
  capitalRequired?: number;
  timelineDays?: number;
  alternativeRank?: {
    action: PortfolioAction;
    score: number;
  }[];
  feasibilityStatus?: "high" | "medium" | "low";
  feasibilityIssues?: string[];
  executionBlockers?: string[];
  capitalFit?: "good" | "tight" | "insufficient";
  timelineRisk?: "low" | "medium" | "high";
};
