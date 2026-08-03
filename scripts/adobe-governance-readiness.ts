import { createAdobeGovernanceReport } from "@/lib/adobe-creative-cloud-governance";

const report = createAdobeGovernanceReport(process.env);

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

if (report.classification !== "ADOBE_GOVERNED_READINESS_READY") {
  process.exitCode = 1;
}
