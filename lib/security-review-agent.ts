export type SecuritySeverity = "high" | "medium" | "low";

export type SecurityFinding = {
  title: string;
  severity: SecuritySeverity;
  file: string;
  location?: string;
  recommendedFix: string;
};

export type SecurityReport = {
  ranAt: string;
  mode: "ci_authoritative";
  summary: string;
  findings: SecurityFinding[];
};

export async function runSecurityReview(): Promise<SecurityReport> {
  return {
    ranAt: new Date().toISOString(),
    mode: "ci_authoritative",
    summary: "Runtime source scanning is disabled. CI security gates are authoritative.",
    findings: [],
  };
}
