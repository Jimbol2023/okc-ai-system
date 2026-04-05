import { promises as fs } from "node:fs";
import { fileURLToPath } from "node:url";

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
  findings: SecurityFinding[];
};

const DASHBOARD_LAYOUT_PATH = fileURLToPath(new URL("../app/(dashboard)/dashboard/layout.tsx", import.meta.url));
const LEADS_STORAGE_PATH = fileURLToPath(new URL("../lib/leads-storage.ts", import.meta.url));
const LEAD_ROUTE_PATH = fileURLToPath(new URL("../app/api/leads/route.ts", import.meta.url));
const LEAD_DETAIL_CLIENT_PATH = fileURLToPath(new URL("../components/dashboard/lead-detail-client.tsx", import.meta.url));
const LEAD_VALIDATION_PATH = fileURLToPath(new URL("../lib/validations/lead.ts", import.meta.url));
const OVERVIEW_PAGE_PATH = fileURLToPath(new URL("../app/(dashboard)/dashboard/page.tsx", import.meta.url));
const LEADS_PAGE_PATH = fileURLToPath(new URL("../app/(dashboard)/dashboard/leads/page.tsx", import.meta.url));
const ENV_PATHS = [
  { file: ".env", absolutePath: fileURLToPath(new URL("../.env", import.meta.url)) },
  { file: ".env.example", absolutePath: fileURLToPath(new URL("../.env.example", import.meta.url)) }
];

function hasAnyPattern(content: string, patterns: string[]) {
  return patterns.some((pattern) => content.includes(pattern));
}

export async function runSecurityReview(): Promise<SecurityReport> {
  const findings: SecurityFinding[] = [];

  const [
    dashboardLayout,
    leadsStorage,
    leadRoute,
    leadDetailClient,
    leadValidation,
    overviewPage,
    leadsPage
  ] = await Promise.all([
    fs.readFile(DASHBOARD_LAYOUT_PATH, "utf8"),
    fs.readFile(LEADS_STORAGE_PATH, "utf8"),
    fs.readFile(LEAD_ROUTE_PATH, "utf8"),
    fs.readFile(LEAD_DETAIL_CLIENT_PATH, "utf8"),
    fs.readFile(LEAD_VALIDATION_PATH, "utf8"),
    fs.readFile(OVERVIEW_PAGE_PATH, "utf8"),
    fs.readFile(LEADS_PAGE_PATH, "utf8")
  ]);

  if (!hasAnyPattern(dashboardLayout, ["auth(", "getServerSession", "redirect(", "cookies(", "getAuthenticatedAdmin("])) {
    findings.push({
      title: "Dashboard routes are missing authentication protection",
      severity: "high",
      file: "app/(dashboard)/dashboard/layout.tsx",
      location: "layout wrapper",
      recommendedFix: "Protect the dashboard layout with a session/auth check and redirect unauthenticated visitors before rendering internal CRM pages."
    });
  }

  if (leadsStorage.includes("window.localStorage.setItem")) {
    findings.push({
      title: "Lead records are stored in browser localStorage",
      severity: "high",
      file: "lib/leads-storage.ts",
      location: "lead persistence helpers",
      recommendedFix: "Move lead persistence to a server-side data store and avoid storing seller PII, notes, and outreach history in localStorage where any browser user can read it."
    });
  }

  if (!hasAnyPattern(leadRoute, ["authorization", "rateLimit", "csrf", "origin", "isAuthenticatedRequest("])) {
    findings.push({
      title: "Lead intake API lacks auth and abuse controls",
      severity: "medium",
      file: "app/api/leads/route.ts",
      location: "POST handler",
      recommendedFix: "Add origin checks, rate limiting, bot protection, and authentication or signed internal access controls for sensitive dashboard-facing actions."
    });
  }

  if (!leadValidation.includes(".min(2") || !leadValidation.includes("regex(/^\\d{5}$/")) {
    findings.push({
      title: "Lead intake validation is weaker than expected",
      severity: "medium",
      file: "lib/validations/lead.ts",
      location: "leadIntakeSchema",
      recommendedFix: "Strengthen validation rules for all externally supplied fields and keep shared validation enforced on every server write path."
    });
  }

  if (leadDetailClient.includes("navigator.clipboard.writeText") || leadDetailClient.includes("sendSMS(")) {
    findings.push({
      title: "Sensitive outreach actions run directly in the client",
      severity: "medium",
      file: "components/dashboard/lead-detail-client.tsx",
      location: "follow-up assistant",
      recommendedFix: "Move send/copy/audit-sensitive operations behind authenticated server endpoints so actions can be authorized, logged, and rate limited."
    });
  }

  if (!hasAnyPattern(overviewPage, ["auth(", "getServerSession", "fetchLeads("]) && !hasAnyPattern(leadsPage, ["auth(", "getServerSession", "fetchLeads("])) {
    findings.push({
      title: "Internal operations pages expose high-value workflow data",
      severity: "medium",
      file: "app/(dashboard)/dashboard/page.tsx",
      location: "operations overview",
      recommendedFix: "Require authenticated access before showing lead counts, automation controls, and internal workflow information."
    });
  }

  for (const envFile of ENV_PATHS) {
    try {
      const content = await fs.readFile(envFile.absolutePath, "utf8");

      if (hasAnyPattern(content, ["sk_", "TWILIO_", "SECRET=", "API_KEY="])) {
        findings.push({
          title: "Potential secret material found in environment file",
          severity: "high",
          file: envFile.file,
          location: "environment configuration",
          recommendedFix: "Rotate any exposed credentials immediately and keep secrets out of committed project files."
        });
      }
    } catch {
      // Ignore missing env files for the starter review.
    }
  }

  return {
    ranAt: new Date().toISOString(),
    findings
  };
}
