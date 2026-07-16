import { ProfessionalToolchainsDashboard } from "@/components/dashboard/professional-toolchains-dashboard";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { listTenantProfessionalRecords } from "@/lib/enterprise-professional-competency-records";
import { createConnectorIntakeEvidenceFromRecords, createProfessionalToolchainsReport } from "@/lib/professional-toolchains";

export const dynamic = "force-dynamic";

export default async function ProfessionalToolchainsPage() {
  const actor = await getAuthenticatedAdmin();
  let evidenceAvailable = false;
  let report = createProfessionalToolchainsReport();
  if (actor) {
    try {
      const records = await listTenantProfessionalRecords(actor.tenantId);
      report = createProfessionalToolchainsReport(createConnectorIntakeEvidenceFromRecords(records));
      evidenceAvailable = true;
    } catch {
      evidenceAvailable = false;
    }
  }
  return <ProfessionalToolchainsDashboard report={report} evidenceAvailable={evidenceAvailable} />;
}
