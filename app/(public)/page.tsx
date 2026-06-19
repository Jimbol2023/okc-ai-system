import { AboutSection } from "@/components/public/AboutSection";
import { ContactSection } from "@/components/public/ContactSection";
import { HeroSection } from "@/components/public/HeroSection";
import { TrustSection } from "@/components/public/TrustSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustSection />
      <AboutSection />
      <ContactSection />
    </>
  );
}
