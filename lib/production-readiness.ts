export type HardeningPriority = "high" | "medium" | "low";
export type HardeningStatus = "not started" | "in progress" | "planned";

export type HardeningChecklistItem = {
  title: string;
  priority: HardeningPriority;
  status: HardeningStatus;
  recommendedAction: string;
};

export const productionHardeningChecklist: HardeningChecklistItem[] = [
  {
    title: "Move lead and research data out of localStorage",
    priority: "high",
    status: "not started",
    recommendedAction:
      "Migrate lead, notes, follow-ups, research, and automation state into a server-side database so browser-local data is not the system of record."
  },
  {
    title: "Add authentication for dashboard and admin routes",
    priority: "high",
    status: "not started",
    recommendedAction:
      "Protect all dashboard pages with authenticated sessions and role-aware access before exposing internal lead workflows in production."
  },
  {
    title: "Move sensitive actions behind server-side routes",
    priority: "high",
    status: "planned",
    recommendedAction:
      "Shift SMS sending, automation execution, imports, scoring triggers, and future outreach actions to authenticated server endpoints with audit logging."
  },
  {
    title: "Validate and sanitize all inputs server-side",
    priority: "high",
    status: "planned",
    recommendedAction:
      "Apply shared schema validation and sanitization to homepage forms, importer rows, research notes, and any follow-up content on the server before persistence."
  },
  {
    title: "Move secrets and provider configuration into environment variables",
    priority: "high",
    status: "planned",
    recommendedAction:
      "Keep Twilio, database, and future integration keys in environment variables only, and ensure production secrets are never exposed to the client bundle."
  },
  {
    title: "Reduce risky client-side-only behavior",
    priority: "medium",
    status: "in progress",
    recommendedAction:
      "Replace client-only storage, direct clipboard-heavy workflows, and browser-only stateful operations with server-backed actions where data sensitivity matters."
  },
  {
    title: "Add abuse protection for intake and automation endpoints",
    priority: "medium",
    status: "not started",
    recommendedAction:
      "Introduce rate limiting, origin checks, bot protection, and action throttling for lead intake, imports, automation cycles, and outreach routes."
  },
  {
    title: "Add operational audit logging",
    priority: "medium",
    status: "not started",
    recommendedAction:
      "Record who imported leads, sent outreach, changed statuses, completed follow-ups, and ran automation so production activity is traceable."
  }
];

export function getProductionReadinessStatus() {
  const highPriorityRemaining = productionHardeningChecklist.filter((item) => item.priority === "high").length;

  if (highPriorityRemaining >= 4) {
    return "Prototype";
  }

  if (highPriorityRemaining >= 2) {
    return "Internal Use Only";
  }

  return "Needs Hardening";
}

export function getProductionReadinessScore() {
  const completedEquivalent = productionHardeningChecklist.filter((item) => item.status === "in progress").length;
  return Math.round((completedEquivalent / productionHardeningChecklist.length) * 100);
}
