export interface ReputationGovernanceLineageNode {
  id: string;
  label: string;
  relatedGovernanceDomains: string[];
  relatedBusinessUnits: string[];
}

export interface ReputationGovernanceLineageEdge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationship: string;
}

export interface ReputationGovernanceLineageExplainability {
  lineageRulesApplied: string[];
  majorDrivers: string[];
}

export interface ReputationGovernanceLineageResult {
  lineageIntegrityScore: number;
  nodes: ReputationGovernanceLineageNode[];
  edges: ReputationGovernanceLineageEdge[];
  governanceDependencyChains: string[];
  weakLineageAreas: string[];
  stabilizationChains: string[];
  contradictionChains: string[];
  recommendations: string[];
  explainability: ReputationGovernanceLineageExplainability;
}
