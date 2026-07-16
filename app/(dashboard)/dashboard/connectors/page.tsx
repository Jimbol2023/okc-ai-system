import { ConnectorActivationGateDashboard } from "@/components/dashboard/connector-activation-gate-dashboard";
import { UeipPortfolioSummary } from "@/components/dashboard/ueip-portfolio-summary";
import { assertConnectorActivationGateSafety, createConnectorActivationGate } from "@/lib/connector-activation-gate";
import {
  assertConnectorCredentialScopeVerificationSafety,
  createConnectorCredentialScopeVerificationFromInputs,
} from "@/lib/connector-credential-scope-verification";
import { createUeipPortfolioReport } from "@/lib/universal-enterprise-integration-platform";

export const dynamic = "force-dynamic";

export default async function ConnectorsPage() {
  const report = await createConnectorActivationGate();
  assertConnectorActivationGateSafety(report);
  const verification = createConnectorCredentialScopeVerificationFromInputs({ gate: report });
  assertConnectorCredentialScopeVerificationSafety(verification);
  const portfolio = createUeipPortfolioReport();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6">
      <UeipPortfolioSummary report={portfolio} />
      <ConnectorActivationGateDashboard report={report} verification={verification} />
    </main>
  );
}
