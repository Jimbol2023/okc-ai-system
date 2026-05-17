export interface EnterpriseReputationBusinessUnitExposure {
  businessUnit: string;
  exposureLevel?: string;
  drivers?: readonly string[];
}

export interface EnterpriseReputationAggregationResult {
  enterpriseExposureLevel: string;
  unresolvedSignals: number;
  exposureByBusinessUnit: readonly EnterpriseReputationBusinessUnitExposure[];
  topEnterpriseDrivers: readonly string[];
}
