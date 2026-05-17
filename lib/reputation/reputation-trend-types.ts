export interface ReputationTrendResult {
  trendDirection: string;
  explainability: {
    majorDrivers: readonly string[];
  };
}
