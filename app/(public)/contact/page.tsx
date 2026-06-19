import { ContactSection } from "@/components/public/ContactSection";

export default function ContactPage() {
  return (
    <div className="bg-white">
      <section className="bg-white py-16 md:py-20">
        <div className="container-shell text-center">
          <p className="font-heading text-xs font-bold uppercase tracking-[0.22em] text-[#D4A017]">
            Contact
          </p>
          <h1 className="mx-auto mt-4 max-w-3xl font-heading text-4xl font-bold leading-tight text-[#02213D] md:text-6xl">
            Contact J Capital Property Group
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#4B5563]">
            We are available to discuss your property questions and explore potential real estate solutions.
          </p>
        </div>
      </section>
      <ContactSection />
    </div>
  );
}
