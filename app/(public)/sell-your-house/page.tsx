import { LeadCaptureForm } from "@/components/forms/lead-capture-form";
import { SectionHeading } from "@/components/shared/section-heading";

export default function SellYourHousePage() {
  return (
    <div className="container-shell py-10 md:py-14">
      <div className="grid gap-8 md:grid-cols-[1fr_420px]">
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Sell Your House"
            title="Talk to a local buyer about your options"
            description="Use this short form to start a no-pressure conversation. Inputs are validated, and every submission keeps its source for clean follow-up."
          />
          <div className="rounded-[1.5rem] border border-border bg-surface p-6">
            <h2 className="text-xl font-semibold text-primary">A simple path for stressed or uncertain sellers</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-muted">
              <li>Quick mobile-first intake for Oklahoma City homeowners and nearby areas.</li>
              <li>Clear next steps without pressure, obligation, or repair requirements.</li>
              <li>Tracked source attribution for direct mail, PPC, referrals, and organic traffic.</li>
            </ul>
          </div>
        </div>
        <LeadCaptureForm source="seller-page" />
      </div>
    </div>
  );
}
