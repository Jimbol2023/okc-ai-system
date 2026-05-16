/**
 * Phase R Survivability Intelligence Contract
 * Type-only, readonly data interfaces for survivability intelligence cluster
 */

export interface SurvivabilityScore {
  readonly riskScore: number;
  readonly resilienceScore: number;
  readonly recoveryPotential: number;
  readonly knowledgeMaturityScore: number;
  readonly complianceScore: number;
  readonly keyPersonDependencyScore: number;

  readonly economicShockExposure?: number;
  readonly portfolioRiskBalance?: number;
  readonly territoryDefenseScore?: number;
  readonly founderDependencyScore?: number;
  readonly institutionalCapitalFlowScore?: number;
}

export interface SurvivabilityConfidence {
  readonly confidenceLevel: number; // 0 to 1
  readonly dataCompleteness: number; // 0 to 100 percentage
  readonly sourceReliability: 'low' | 'medium' | 'high';
  readonly updateTimestamp: string; // ISO 8601
  readonly uncertaintyMargin: number;
}

export interface SurvivabilityExplainability {
  readonly primaryDrivers: readonly string[];
  readonly historicalContext: string;
  readonly calculationMethod: string;
  readonly dataSources: readonly string[];
  readonly scoreComponents: Readonly<Record<string, number>>;
}

export interface SurvivabilityWarningRisk {
  readonly warningFlags: readonly string[];
  readonly riskEvents: readonly string[];
  readonly criticalDependencies: readonly string[];
  readonly alertLevel: 'green' | 'yellow' | 'red';
}

export interface SurvivabilitySafetyGovernance {
  readonly reviewStatus: 'audited' | 'pending' | 'approved' | 'rejected';
  readonly reviewerComments: string;
  readonly complianceCheckDate: string; // ISO 8601
  readonly auditTrailId: string;

  readonly readOnly: true;
  readonly executionAuthorized: false;
  readonly databaseWriteAuthorized: false;
  readonly providerActivationAuthorized: false;
  readonly outreachAuthorized: false;
  readonly autonomousActionAuthorized: false;
}

export interface SurvivabilityAggregationMetadata {
  readonly moduleName: string;
  readonly moduleVersion: string;
  readonly aggregationLevel: 'primitive' | 'category' | 'composite' | 'executiveDashboard';
  readonly parentModules?: readonly string[];
  readonly recordId: string;
}

export interface PhaseRSurvivabilityIntelligenceRecord {
  readonly score: SurvivabilityScore;
  readonly confidence: SurvivabilityConfidence;
  readonly explainability: SurvivabilityExplainability;
  readonly warningRisk: SurvivabilityWarningRisk;
  readonly safetyGovernance: SurvivabilitySafetyGovernance;
  readonly aggregationMetadata: SurvivabilityAggregationMetadata;
}
