import { Footer } from "@/components/public/Footer";
import { Navbar } from "@/components/public/Navbar";
import { StructuredData } from "@/components/public/StructuredData";

export default function PublicLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-white">
      <StructuredData />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
