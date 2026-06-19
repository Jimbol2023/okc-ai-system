import { brandConfig } from "@/lib/brand-config";
import { createPublicPageMetadata } from "@/lib/public-seo";

export const metadata = createPublicPageMetadata({
  path: "/contact",
  title: "Contact J Capital Property Group",
  description:
    "Reach J Capital Property Group for general questions, property-related inquiries, accessibility support, or professional communication."
});

const contactSections = [
  {
    title: "General Contact Information",
    description:
      "Use the phone or email links below for general business questions, property-related inquiries, or professional communication."
  },
  {
    title: "Response Time",
    description:
      "J Capital Property Group typically responds within one business day when messages include clear contact information."
  },
  {
    title: "Accessibility Support",
    description:
      "Contact us if you need help accessing information on this website or need communication in a more accessible format."
  },
  {
    title: "When To Contact Us",
    description:
      "Reach out for general questions, website accessibility help, professional communication, or property-related questions that need a direct conversation."
  }
];

export default function ContactPage() {
  return (
    <div className="bg-white">
      <section className="bg-white py-16 md:py-20">
        <div className="container-shell">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-heading text-xs font-bold uppercase tracking-[0.22em] text-[#D4A017]">
              Contact
            </p>
            <h1 className="mt-4 font-heading text-4xl font-bold leading-tight text-[#02213D] md:text-6xl">
              Contact J Capital Property Group
            </h1>
            <p className="mt-5 text-base leading-8 text-[#4B5563]">
              Reach our team for general questions, property-related inquiries, accessibility support, or professional
              communication.
            </p>
          </div>

          <section aria-labelledby="direct-contact-heading" className="mx-auto mt-10 max-w-3xl">
            <h2 id="direct-contact-heading" className="font-heading text-2xl font-bold text-[#02213D]">
              Direct Phone and Email Links
            </h2>
            <div className="mt-5 grid gap-3 text-sm text-[#1F2937] sm:grid-cols-2">
              <a href={brandConfig.phoneHref} className="border border-slate-200 bg-[#F2F4F7] px-4 py-3 font-semibold">
                Phone: {brandConfig.phone}
              </a>
              <a
                href={`mailto:${brandConfig.primaryEmail}`}
                className="border border-slate-200 bg-[#F2F4F7] px-4 py-3 font-semibold"
              >
                Email: {brandConfig.primaryEmail}
              </a>
            </div>
          </section>

          <div className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-2">
            {contactSections.map((section) => (
              <section key={section.title} className="border border-slate-200 bg-[#F2F4F7] p-5">
                <h2 className="font-heading text-xl font-bold text-[#02213D]">{section.title}</h2>
                <p className="mt-3 text-sm leading-6 text-[#4B5563]">{section.description}</p>
              </section>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
