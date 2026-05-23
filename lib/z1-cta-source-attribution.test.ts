import { createZ1CtaAttribution, sourceForCtaOrigin } from "./z1-cta-source-attribution";

describe("Z1C CTA source attribution", () => {
  it("maps CTA origins into deterministic source labels", () => {
    expect(sourceForCtaOrigin("seller_page_form")).toBe("seller_page");
    expect(sourceForCtaOrigin("dashboard_manual")).toBe("manual_dashboard_entry");
    expect(sourceForCtaOrigin("homepage_hero")).toBe("homepage_hero");
  });

  it("builds source page origin attribution", () => {
    const result = createZ1CtaAttribution({ page: "/sell-your-house", origin: "seller_page_form" });
    expect(result.valid).toBe(true);
    expect(result.source).toBe("seller_page");
    expect(result.sourceDetail).toBe("/sell-your-house:seller_page_form");
  });
});
