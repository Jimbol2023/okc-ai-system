export type DashboardNavigationItem = {
  href: string;
  label: string;
  group: "Executive" | "Growth" | "Intelligence" | "Company" | "Security & Governance";
  keywords: string[];
};

export const dashboardNavigationItems: DashboardNavigationItem[] = [
  { href: "/dashboard", label: "AI COO", group: "Executive", keywords: ["executive", "morning brief", "command center", "dashboard", "company orchestrator"] },
  { href: "/dashboard/revenue", label: "Revenue", group: "Executive", keywords: ["revenue", "unified inbox", "lead scoring", "audit", "source attribution", "follow up"] },
  { href: "/dashboard/finance", label: "Finance", group: "Executive", keywords: ["cash", "roi", "cost per lead", "cost per acquisition"] },
  { href: "/dashboard/operations", label: "Operations", group: "Executive", keywords: ["workflow", "process", "manual review"] },
  { href: "/dashboard/marketing", label: "Marketing", group: "Growth", keywords: ["campaign", "draft", "content", "gbp"] },
  { href: "/dashboard/leads", label: "Leads", group: "Growth", keywords: ["crm", "follow up", "seller", "source"] },
  { href: "/dashboard/acquisitions", label: "Acquisitions", group: "Growth", keywords: ["offers", "pipeline", "seller", "deal"] },
  { href: "/dashboard/properties", label: "Properties", group: "Growth", keywords: ["property", "review", "source"] },
  { href: "/dashboard/driving-for-dollars", label: "Driving for Dollars", group: "Growth", keywords: ["driving for dollars", "field", "property", "lead source"] },
  { href: "/dashboard/referrals", label: "Referrals", group: "Growth", keywords: ["referral", "partner", "partnership", "attribution", "source"] },
  { href: "/dashboard/enterprise-ai", label: "Enterprise AI", group: "Intelligence", keywords: ["phase 2", "connector platform", "market intelligence", "executive ai", "safe autonomy"] },
  { href: "/dashboard/research", label: "Research", group: "Intelligence", keywords: ["market", "analysis", "source"] },
  { href: "/dashboard/knowledge", label: "Knowledge", group: "Intelligence", keywords: ["sop", "playbook", "probate", "search", "company memory"] },
  { href: "/dashboard/tools", label: "Tools", group: "Company", keywords: ["tool registry", "capability", "connector", "safe auto", "fallback"] },
  { href: "/dashboard/importer", label: "Importer", group: "Company", keywords: ["tax list", "csv", "import"] },
  { href: "/dashboard/analyzer", label: "Analyzer", group: "Company", keywords: ["arv", "repair", "offer", "deal analyzer"] },
  { href: "/dashboard/mobile-command", label: "Mobile Command", group: "Company", keywords: ["phase 3", "mobile", "command center", "approval center", "social operations"] },
  { href: "/dashboard/approvals", label: "Approvals", group: "Security & Governance", keywords: ["review", "governance", "approval"] },
  { href: "/dashboard/safety", label: "Security & Governance", group: "Security & Governance", keywords: ["security", "safety", "governance", "audit", "risk", "provider", "workflow", "twilio", "openai", "n8n", "security review"] },
  { href: "/dashboard/production-readiness", label: "Hardening", group: "Security & Governance", keywords: ["readiness", "deployment", "provider", "security", "governance", "hardening"] },
];

export function filterDashboardNavigationItems(query: string, limit = 8) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) return dashboardNavigationItems.slice(0, limit);

  const terms = normalizedQuery.split(/\s+/).filter(Boolean);

  return dashboardNavigationItems
    .map((item) => {
      const searchable = [item.label, item.href, ...item.keywords].join(" ").toLowerCase();
      const score = terms.reduce((total, term) => total + (searchable.includes(term) ? 1 : 0), 0);

      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.item.label.localeCompare(b.item.label))
    .slice(0, limit)
    .map(({ item }) => item);
}
