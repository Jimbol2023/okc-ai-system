import {
  applyDefaultSourceToImportedLeadPreview,
  parseLeadImportCsv,
} from "./list-importer";

describe("list importer", () => {
  it("maps common PropStream DealMachine assessor tax and spreadsheet headers", () => {
    const csv = [
      "Full Name,Situs Address,Mobile Phone,APN,List Source,Extra Export Field",
      "Ada Seller,123 Main St,(405) 555-1212,parcel-1,Tax List,ignored",
    ].join("\n");

    const [lead] = parseLeadImportCsv(csv, []);

    expect(lead.ownerName).toBe("Ada Seller");
    expect(lead.firstName).toBe("Ada");
    expect(lead.lastName).toBe("Seller");
    expect(lead.propertyAddress).toBe("123 Main St");
    expect(lead.phone).toBe("4055551212");
    expect(lead.parcelId).toBe("parcel-1");
    expect(lead.source).toBe("tax_delinquent");
    expect(lead.importReadiness).toBe("contact_ready");
    expect(lead.sourceResolution).toBe("high_confidence_source");
    expect(lead.rawSourceLabel).toBe("Tax List");
    expect(lead.matchedHeaders).toEqual(expect.arrayContaining(["Full Name", "Situs Address", "Mobile Phone", "APN", "List Source"]));
    expect(lead.unmappedHeaders).toEqual(["Extra Export Field"]);
  });

  it("maps source aliases from campaign-style export headers", () => {
    const csv = ["Owner Name,Site Address,Phone 1,Account Number,Campaign", "Grace Owner,456 Oak Ave,405-555-3333,A-42,D4D"].join("\n");

    const [lead] = parseLeadImportCsv(csv, []);

    expect(lead.ownerName).toBe("Grace Owner");
    expect(lead.propertyAddress).toBe("456 Oak Ave");
    expect(lead.phone).toBe("4055553333");
    expect(lead.parcelId).toBe("A-42");
    expect(lead.source).toBe("driving_for_dollars");
    expect(lead.importReadiness).toBe("contact_ready");
    expect(lead.sourceResolution).toBe("high_confidence_source");
  });

  it("allows county resale property-only rows into property-first review", () => {
    const csv = ["Owner Name,Situs Address,APN,List Source", "County Owner,101 Public Rd,P-100,Tax"].join("\n");
    const [lead] = parseLeadImportCsv(csv, []);

    expect(lead.propertyAddress).toBe("101 Public Rd");
    expect(lead.phone).toBe("");
    expect(lead.source).toBe("tax_delinquent");
    expect(lead.validationErrors).toEqual([]);
    expect(lead.importReadiness).toBe("property_first_review");
  });

  it("keeps default-source fallback visible for operator review", () => {
    const csv = ["Owner Name,Property Address,Phone", "Mae Seller,789 Pine Rd,4055554444"].join("\n");
    const [lead] = parseLeadImportCsv(csv, []);
    const fallbackLead = applyDefaultSourceToImportedLeadPreview(lead, "tax_delinquent");

    expect(lead.source).toBe("manual_import");
    expect(lead.sourceResolution).toBe("fallback_manual_source");
    expect(fallbackLead.source).toBe("tax_delinquent");
    expect(fallbackLead.sourceResolution).toBe("fallback_manual_source");
    expect(fallbackLead.importReadiness).toBe("contact_ready");
    expect(fallbackLead.sourceReviewReasons.join(" ")).toMatch(/operator-selected default source/i);
  });

  it("allows property-only rows with a selected default source into property-first review", () => {
    const csv = ["Owner Name,Property Address", "Mae Seller,789 Pine Rd"].join("\n");
    const [lead] = parseLeadImportCsv(csv, []);
    const fallbackLead = applyDefaultSourceToImportedLeadPreview(lead, "tax_delinquent");

    expect(fallbackLead.phone).toBe("");
    expect(fallbackLead.source).toBe("tax_delinquent");
    expect(fallbackLead.importReadiness).toBe("property_first_review");
    expect(fallbackLead.importBlockers).toEqual([]);
  });

  it("flags unknown source labels for cleanup visibility", () => {
    const csv = ["Owner Name,Property Address,Phone,Lead Source", "Lin Owner,234 Elm St,4055557777,Mystery Export"].join("\n");
    const [lead] = parseLeadImportCsv(csv, []);

    expect(lead.source).toBe("manual_import");
    expect(lead.rawSourceLabel).toBe("Mystery Export");
    expect(lead.importReadiness).toBe("blocked_cleanup");
    expect(lead.sourceResolution).toBe("unknown_source");
    expect(lead.sourceReviewReasons.join(" ")).toMatch(/did not match a known acquisition source/i);
  });

  it("marks missing-address rows as cleanup-needed without changing duplicate behavior", () => {
    const csv = ["Owner Name,Property Address,Phone,Lead Source", "No Phone Owner,100 Empty Ln,,Tax"].join("\n");
    const [lead] = parseLeadImportCsv(csv, []);

    expect(lead.validationErrors).toEqual([]);
    expect(lead.importReadiness).toBe("property_first_review");
    expect(lead.duplicate).toBe(false);
  });

  it("blocks missing-address rows from import", () => {
    const csv = ["Owner Name,Property Address,Phone,Lead Source", "No Address Owner,,4055551111,Tax"].join("\n");
    const [lead] = parseLeadImportCsv(csv, []);

    expect(lead.validationErrors).toEqual(["Property address is required."]);
    expect(lead.importReadiness).toBe("blocked_cleanup");
    expect(lead.sourceResolution).toBe("cleanup_needed");
  });

  it("still detects duplicate rows by property address and phone", () => {
    const existingLead = {
      propertyAddress: "123 Main St",
      phone: "4055551212",
    };
    const csv = ["Owner Name,Property Address,Phone,Lead Source", "Ada Seller,123 Main St,405-555-1212,Tax"].join("\n");
    const [lead] = parseLeadImportCsv(csv, [existingLead as never]);

    expect(lead.duplicate).toBe(true);
  });

  it("detects property-only duplicates by address source and parcel when available", () => {
    const existingLead = {
      propertyAddress: "101 Public Rd",
      phone: "",
      source: "tax_delinquent",
      parcelId: "P-100",
      county: "Canadian",
    };
    const csv = ["Owner Name,Situs Address,APN,List Source,County", "County Owner,101 Public Rd,P-100,Tax,Canadian"].join("\n");
    const [lead] = parseLeadImportCsv(csv, [existingLead as never]);

    expect(lead.importReadiness).toBe("property_first_review");
    expect(lead.duplicate).toBe(true);
  });
});
