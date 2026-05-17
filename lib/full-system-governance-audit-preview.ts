import type { FullSystemGovernanceAuditResult } from "./full-system-governance-audit-types";

export interface FullSystemGovernanceAuditPreview {
  generatedAt?: string;
  overallScore?: number;
  readinessStatus?: string;
  summary?: string;
  previewNotice?: string;
  sourceLabel?: string;
  result?: FullSystemGovernanceAuditResult;
  criticalFindings?: readonly string[];
  warnings?: readonly string[];
  recommendations?: readonly string[];
  [key: string]: unknown;
}
