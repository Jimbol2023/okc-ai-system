import { Footer } from "@/components/public/Footer";
import { ConsentGatedAnalytics } from "@/components/public/ConsentGatedAnalytics";
import { CookieConsentBanner } from "@/components/public/CookieConsentBanner";
import { Navbar } from "@/components/public/Navbar";
import { StructuredData } from "@/components/public/StructuredData";

export default function PublicLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="public-site min-h-screen bg-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-[#D4A017] focus:px-5 focus:py-3 focus:font-heading focus:text-sm focus:font-bold focus:text-[#02213D] focus:shadow-lg"
      >
        Skip to main content
      </a>
      <StructuredData />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <ConsentGatedAnalytics />
      <CookieConsentBanner />
    </div>
  );
}
