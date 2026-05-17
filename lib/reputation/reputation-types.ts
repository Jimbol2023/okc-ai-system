export type ReputationSeverity = "low" | "moderate" | "elevated" | "critical";

export interface ReputationSignal {
  id: string;
  detectedAt: string;
  sourceSystem: string;
  impactDomains?: string[];
  [key: string]: unknown;
}
