import { runAdobePreviewCredentialProbe } from "@/lib/adobe-creative-cloud-governance";

async function main() {
  const report = await runAdobePreviewCredentialProbe({ env: process.env });

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

  if (report.classification !== "ADOBE_PREVIEW_CREDENTIAL_PROBE_VERIFIED") {
    process.exitCode = 1;
  }
}

void main();
