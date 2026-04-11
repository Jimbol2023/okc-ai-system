import { LeadCaptureForm } from "@/components/forms/lead-capture-form";
import { SectionHeading } from "@/components/shared/section-heading";

export default function ContactPage() {
  return (
    <div className="container-shell py-10 md:py-14">
      <div className="mx-auto max-w-3xl space-y-8">
        <SectionHeading
          eyebrow="Contact"
          title="Talk to a local buyer in Oklahoma City"
          description="Reach out with questions, property details, or your timeline. This is a simple no-obligation way to explore your options before deciding anything."
          align="center"
        />
        <LeadCaptureForm source="contact-page" />
      </div>
    </div>
  );
}
