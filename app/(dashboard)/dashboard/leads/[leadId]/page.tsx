import { LeadDetailClient } from "@/components/dashboard/lead-detail-client";

type DashboardLeadDetailPageProps = {
  params: Promise<{
    leadId: string;
  }>;
};

export default async function DashboardLeadDetailPage({ params }: DashboardLeadDetailPageProps) {
  const { leadId } = await params;

  return <LeadDetailClient leadId={leadId} />;
}
