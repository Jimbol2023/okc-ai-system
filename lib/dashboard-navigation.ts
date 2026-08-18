export type DashboardNavigationItem = {
  href: string;
  label: string;
  keywords: string[];
};

export const dashboardNavigationItems: DashboardNavigationItem[] = [
  { href: "/dashboard", label: "Overview", keywords: ["executive", "morning brief", "command center", "dashboard"] },
  { href: "/dashboard/revenue", label: "Revenue", keywords: ["revenue", "unified inbox", "lead scoring", "audit", "source attribution", "follow up"] },
  { href: "/dashboard/acquisitions", label: "Acquisitions", keywords: ["offers", "pipeline", "seller", "deal"] },
  { href: "/dashboard/operations", label: "Operations", keywords: ["workflow", "process", "manual review"] },
  { href: "/dashboard/autonomy", label: "Autonomy", keywords: ["autonomy", "level 2", "ceo exception", "internal task", "policy"] },
  { href: "/dashboard/finance", label: "Finance", keywords: ["cash", "roi", "cost per lead", "cost per acquisition"] },
  { href: "/dashboard/knowledge", label: "Knowledge", keywords: ["sop", "playbook", "probate", "search"] },
  { href: "/dashboard/leads", label: "Leads", keywords: ["crm", "follow up", "seller", "source"] },
  { href: "/dashboard/approvals", label: "Approvals", keywords: ["review", "governance", "approval"] },
  { href: "/dashboard/drafts", label: "Draft Workspace", keywords: ["draft", "drafts", "ceo review", "workspace", "department work", "internal review"] },
  { href: "/dashboard/marketing", label: "Marketing Hub", keywords: ["campaign", "draft", "content", "gbp"] },
  { href: "/dashboard/referrals", label: "Referrals", keywords: ["referral", "partner", "partnership", "attribution", "source"] },
  { href: "/dashboard/tools", label: "Tools", keywords: ["tool registry", "capability", "connector", "safe auto", "fallback"] },
  { href: "/dashboard/professional-toolchains", label: "Professional Toolchains", keywords: ["professional", "certification", "expertise", "toolchain", "wave", "workforce", "connector intake"] },
  { href: "/dashboard/search-intelligence", label: "Search Intelligence", keywords: ["search console", "seo", "query", "indexing", "market intelligence", "monday packet", "qa"] },
  { href: "/dashboard/enterprise-ai", label: "Enterprise AI", keywords: ["phase 2", "connector platform", "market intelligence", "executive ai", "safe autonomy"] },
  { href: "/dashboard/mobile-command", label: "Mobile Command", keywords: ["phase 3", "mobile", "command center", "approval center", "social operations"] },
  { href: "/dashboard/research", label: "Research", keywords: ["market", "analysis", "source"] },
  { href: "/dashboard/safety", label: "Security & Governance", keywords: ["security", "safety", "governance", "audit", "risk", "provider", "workflow", "twilio", "openai", "n8n", "security review"] },
  { href: "/dashboard/production-readiness", label: "Hardening", keywords: ["readiness", "deployment", "provider", "security", "governance", "hardening"] },
  { href: "/dashboard/importer", label: "Importer", keywords: ["tax list", "csv", "import"] },
  { href: "/dashboard/properties", label: "Properties", keywords: ["property", "review", "source"] },
  { href: "/dashboard/property-opportunity-workbench", label: "Opportunity Workbench", keywords: ["property", "opportunity", "county", "dfd", "map", "csv", "lead source"] },
  { href: "/dashboard/analyzer", label: "Analyzer", keywords: ["arv", "repair", "offer", "deal analyzer"] },
  { href: "/dashboard/driving-for-dollars", label: "D4D", keywords: ["driving for dollars", "field", "property"] },
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
