import { Building2, Handshake, MessageSquareText, ShieldCheck } from "lucide-react";

const trustCards = [
  {
    title: "Professional Guidance",
    description: "Helping property owners evaluate real estate options with professionalism and clarity.",
    Icon: ShieldCheck
  },
  {
    title: "Oklahoma Market Knowledge",
    description: "Understanding Oklahoma real estate markets and property conditions.",
    Icon: Building2
  },
  {
    title: "Transparent Communication",
    description: "Clear communication throughout every step of the process.",
    Icon: MessageSquareText
  },
  {
    title: "Practical Property Solutions",
    description: "Focused on finding solutions that fit each property owner's situation.",
    Icon: Handshake
  }
];

export function TrustSection() {
  return (
    <section id="why-us" className="bg-[#F2F4F7] py-18 md:py-24">
      <div className="container-shell">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-3xl font-bold leading-tight text-[#02213D] md:text-5xl">
            Why Oklahoma Property Owners Work With Us
          </h2>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trustCards.map(({ title, description, Icon }) => (
            <article key={title} className="border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#02213D] text-[#D4A017]">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-5 font-heading text-lg font-bold text-[#02213D]">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#4B5563]">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
