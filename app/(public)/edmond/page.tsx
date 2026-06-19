import { ServiceAreaPage } from "@/components/public/ServiceAreaPage";
import { serviceAreas } from "@/lib/public-service-areas";
import { createPublicPageMetadata } from "@/lib/public-seo";

const area = serviceAreas["/edmond"];

export const metadata = createPublicPageMetadata({
  path: area.slug,
  title: area.headline,
  description: area.description
});

export default function EdmondServiceAreaPage() {
  return <ServiceAreaPage area={area} />;
}
