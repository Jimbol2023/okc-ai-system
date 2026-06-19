import { brandConfig } from "@/lib/brand-config";

export function Footer() {
  return (
    <footer className="bg-[#02213D] text-white">
      <div className="container-shell border-t border-white/10 py-6 text-center text-sm text-white/70">
        {brandConfig.copyrightText}
      </div>
    </footer>
  );
}
