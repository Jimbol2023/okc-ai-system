import { SearchMarketIntelligenceDashboard } from "@/components/dashboard/search-market-intelligence-dashboard";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { readSearchMarketIntelligence } from "@/lib/search-market-intelligence-runtime";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SearchIntelligencePage() {
  const actor = await getAuthenticatedAdmin();
  if (!actor) redirect("/login");
  const report = await readSearchMarketIntelligence(actor.tenantId);
  return <SearchMarketIntelligenceDashboard report={report}/>;
}
