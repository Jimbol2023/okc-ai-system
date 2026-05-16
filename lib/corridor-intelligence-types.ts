export type CorridorCategory =
  | "logistics"
  | "commuter"
  | "economic_growth"
  | "luxury"
  | "development"
  | "industrial"
  | "rental_growth"
  | "distress"
  | "tax_opportunity"
  | "institutional"
  | "mixed"
  | "unknown";

export type CorridorStrengthLevel = "weak" | "emerging" | "moderate" | "strong" | "elite";

export type CorridorContinuityLevel = "fragmented" | "partial" | "connected" | "highly_connected" | "unknown";

export type CorridorDurabilityLevel = "fragile" | "cyclical" | "stable" | "durable" | "institutional_grade";

export type CorridorWarningSeverity = "low" | "medium" | "high";

export type CorridorScoreBreakdown = {
  connectivityScore: number;
  durabilityScore: number;
  expansionScore: number;
  institutionalScore: number;
  logisticsScore: number;
  luxuryScore: number;
  developmentScore: number;
};

export type CorridorWarning = {
  code: string;
  severity: CorridorWarningSeverity;
  message: string;
  category?: CorridorCategory;
  requiresHumanReview?: boolean;
};

export type CorridorConfidenceSummary = {
  confidenceScore: number;
  confidenceLevel: "low" | "moderate" | "high";
  dataQualityScore: number;
  missingData: string[];
  assumptions: string[];
  reasoning: string;
};

export type CorridorExplainability = {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  continuity: string[];
  risks: string[];
  warnings: CorridorWarning[];
  confidence: CorridorConfidenceSummary;
};
