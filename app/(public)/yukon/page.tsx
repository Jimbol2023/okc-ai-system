import { ServiceAreaPage } from "@/components/public/ServiceAreaPage";
import { serviceAreas } from "@/lib/public-service-areas";
import { createPublicPageMetadata } from "@/lib/public-seo";

const area = serviceAreas["/yukon"];

export const metadata = createPublicPageMetadata({
  path: area.slug,
  title: area.headline,
  description: area.description
});

export default function YukonServiceAreaPage() {
  return <ServiceAreaPage area={area} />;
}
