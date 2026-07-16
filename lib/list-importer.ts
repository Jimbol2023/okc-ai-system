import { LEAD_SOURCE_TAGS, normalizeLeadSourceTag } from "@/lib/lead-source";
import type { ImportedLeadDraft } from "@/lib/lead-import-types";
import type { StoredLead } from "@/lib/leads-storage";

export type { ImportedLeadDraft } from "@/lib/lead-import-types";

const SUPPORTED_IMPORT_COLUMNS = [
  "firstName",
  "lastName",
  "ownerName",
  "phone",
  "email",
  "propertyAddress",
  "city",
  "state",
  "zipCode",
  "mailingAddress",
  "county",
  "parcelId",
  "situationDetails",
  "source"
] as const;

type SupportedImportColumn = (typeof SUPPORTED_IMPORT_COLUMNS)[number];

const IMPORT_COLUMN_ALIASES: Record<string, SupportedImportColumn> = {
  firstname: "firstName",
  first: "firstName",
  ownerfirstname: "firstName",
  sellerfirstname: "firstName",
  lastname: "lastName",
  last: "lastName",
  ownerlastname: "lastName",
  sellerlastname: "lastName",
  fullname: "ownerName",
  name: "ownerName",
  owner: "ownerName",
  ownername: "ownerName",
  propertyowner: "ownerName",
  sellername: "ownerName",
  phone: "phone",
  phone1: "phone",
  phonenumber: "phone",
  mobilephone: "phone",
  cell: "phone",
  cellphone: "phone",
  primaryphone: "phone",
  email: "email",
  emailaddress: "email",
  propertyaddress: "propertyAddress",
  address: "propertyAddress",
  situsaddress: "propertyAddress",
  siteaddress: "propertyAddress",
  propertysitusaddress: "propertyAddress",
  propertyfulladdress: "propertyAddress",
  streetaddress: "propertyAddress",
  city: "city",
  propertycity: "city",
  situscity: "city",
  state: "state",
  propertystate: "state",
  situsstate: "state",
  zipcode: "zipCode",
  zip: "zipCode",
  propertyzip: "zipCode",
  situszip: "zipCode",
  mailingaddress: "mailingAddress",
  mailaddress: "mailingAddress",
  owneraddress: "mailingAddress",
  ownermailingaddress: "mailingAddress",
  county: "county",
  propertycounty: "county",
  parcelid: "parcelId",
  parcel: "parcelId",
  apn: "parcelId",
  accountnumber: "parcelId",
  taxaccountnumber: "parcelId",
  propertyid: "parcelId",
  situationdetails: "situationDetails",
  notes: "situationDetails",
  note: "situationDetails",
  comments: "situationDetails",
  distressnotes: "situationDetails",
  leadsource: "source",
  listsource: "source",
  source: "source",
  campaign: "source",
  campaignname: "source",
  sourcename: "source"
};

export type ImportedLeadSourceResolution =
  | "high_confidence_source"
  | "fallback_manual_source"
  | "unknown_source"
  | "cleanup_needed";

export type ImportedLeadImportReadiness =
  | "contact_ready"
  | "property_first_review"
  | "blocked_cleanup";

export type ImportedLeadPreview = ImportedLeadDraft & {
  duplicate: boolean;
  validationErrors: string[];
  importReadiness: ImportedLeadImportReadiness;
  sourceResolution: ImportedLeadSourceResolution;
  rawSourceLabel: string;
  matchedHeaders: string[];
  unmappedHeaders: string[];
  sourceReviewReasons: string[];
  importBlockers: string[];
};

function normalizeHeader(header: string) {
  return header.trim().replace(/[\s_-]+/g, "").toLowerCase();
}

function parseCsvLine(line: string) {
  const values: string[] = [];
  let currentValue = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const nextCharacter = line[index + 1];

    if (character === '"') {
      if (inQuotes && nextCharacter === '"') {
        currentValue += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (character === "," && !inQuotes) {
      values.push(currentValue.trim());
      currentValue = "";
      continue;
    }

    currentValue += character;
  }

  values.push(currentValue.trim());

  return values;
}

function splitOwnerName(ownerName: string) {
  const cleanedOwnerName = ownerName.trim();

  if (!cleanedOwnerName) {
    return {
      firstName: "",
      lastName: ""
    };
  }

  const ownerParts = cleanedOwnerName.split(/\s+/);

  if (ownerParts.length === 1) {
    return {
      firstName: ownerParts[0],
      lastName: ""
    };
  }

  return {
    firstName: ownerParts[0],
    lastName: ownerParts.slice(1).join(" ")
  };
}

function createEmptyImportedLeadDraft(): ImportedLeadDraft {
  return {
    firstName: "",
    lastName: "",
    ownerName: "",
    phone: "",
    email: "",
    propertyAddress: "",
    city: "",
    state: "",
    zipCode: "",
    mailingAddress: "",
    county: "",
    parcelId: "",
    situationDetails: "",
    source: ""
  };
}

function normalizePropertyAddress(value: string) {
  return value.trim().toLowerCase();
}

export function sanitizeImportedLeadPhone(value: string) {
  return value.trim().replace(/\D/g, "");
}

function normalizePhone(value: string) {
  return sanitizeImportedLeadPhone(value);
}

export function validateImportedLeadDraft(lead: ImportedLeadDraft) {
  const errors: string[] = [];
  const requiredFields = hasRequiredImportedLeadFields(lead);

  if (!requiredFields.propertyAddress) {
    errors.push("Property address is required.");
  }

  return errors;
}

export function hasRequiredImportedLeadFields(lead: ImportedLeadDraft) {
  return {
    phone: sanitizeImportedLeadPhone(lead.phone).length > 0,
    propertyAddress: lead.propertyAddress.trim().length > 0,
    source: normalizeLeadSourceTag(lead.source) !== "manual_import"
  };
}

function sanitizeImportedLeadDraft(lead: ImportedLeadDraft): ImportedLeadDraft {
  return {
    ...lead,
    propertyAddress: lead.propertyAddress.trim(),
    phone: sanitizeImportedLeadPhone(lead.phone),
    source: normalizeLeadSourceTag(lead.source)
  };
}

function getMatchedImportColumn(header: string) {
  const normalizedHeader = normalizeHeader(header);
  const supportedColumn = SUPPORTED_IMPORT_COLUMNS.find((column) => normalizeHeader(column) === normalizedHeader);

  return supportedColumn ?? IMPORT_COLUMN_ALIASES[normalizedHeader];
}

function getSourceResolution(rawSourceLabel: string, validationErrors: string[]): ImportedLeadSourceResolution {
  const hasRawSource = rawSourceLabel.trim().length > 0;
  const normalizedSource = normalizeLeadSourceTag(rawSourceLabel);

  if (validationErrors.length > 0) {
    return "cleanup_needed";
  }

  if (!hasRawSource) {
    return "fallback_manual_source";
  }

  if (normalizedSource === "manual_import") {
    return "unknown_source";
  }

  return "high_confidence_source";
}

function getSourceReviewReasons({
  rawSourceLabel,
  sourceResolution,
  unmappedHeaders,
}: {
  rawSourceLabel: string;
  sourceResolution: ImportedLeadSourceResolution;
  unmappedHeaders: string[];
}) {
  return [
    sourceResolution === "fallback_manual_source" ? "No source column value was found; review the selected default source before import." : "",
    sourceResolution === "unknown_source" ? `Source label "${rawSourceLabel}" did not match a known acquisition source.` : "",
    sourceResolution === "cleanup_needed" ? "Required cleanup is needed before this row can be source-reviewed confidently." : "",
    unmappedHeaders.length > 0 ? `${unmappedHeaders.length} CSV header${unmappedHeaders.length === 1 ? "" : "s"} were not mapped into the import preview.` : "",
  ].filter(Boolean);
}

function hasContact(lead: ImportedLeadDraft) {
  return sanitizeImportedLeadPhone(lead.phone).length > 0 || lead.email.trim().length > 0;
}

export function getImportedLeadImportBlockers(lead: ImportedLeadDraft) {
  const requiredFields = hasRequiredImportedLeadFields(lead);

  return [
    !requiredFields.propertyAddress ? "Property address is required." : "",
    !requiredFields.source ? "Known source is required." : "",
  ].filter(Boolean);
}

export function getImportedLeadImportReadiness(
  lead: ImportedLeadDraft,
  sourceResolution: ImportedLeadSourceResolution,
  validationErrors: string[]
): ImportedLeadImportReadiness {
  if (
    validationErrors.length > 0 ||
    sourceResolution === "unknown_source" ||
    sourceResolution === "cleanup_needed" ||
    normalizeLeadSourceTag(lead.source) === "manual_import"
  ) {
    return "blocked_cleanup";
  }

  return hasContact(lead) ? "contact_ready" : "property_first_review";
}

export function isContactReadyImportedLead(lead: ImportedLeadPreview) {
  return lead.importReadiness === "contact_ready";
}

export function isPropertyFirstImportedLead(lead: ImportedLeadPreview) {
  return lead.importReadiness === "property_first_review";
}

export function applyDefaultSourceToImportedLeadPreview(
  lead: ImportedLeadPreview,
  defaultSource: string
): ImportedLeadPreview {
  if (lead.sourceResolution !== "fallback_manual_source") {
    return lead;
  }

  const normalizedDefaultSource = normalizeLeadSourceTag(defaultSource);
  const nextLead = {
    ...lead,
    source: normalizedDefaultSource,
  };
  const sourceResolution: ImportedLeadSourceResolution =
    normalizedDefaultSource === "manual_import" ? "cleanup_needed" : "fallback_manual_source";
  const importBlockers = getImportedLeadImportBlockers(nextLead);
  const importReadiness = getImportedLeadImportReadiness(nextLead, sourceResolution, importBlockers);

  return {
    ...nextLead,
    source: normalizedDefaultSource,
    sourceResolution,
    importReadiness,
    importBlockers,
    sourceReviewReasons: [
      ...lead.sourceReviewReasons,
      normalizedDefaultSource === "manual_import"
        ? "Default source is still Manual Import; choose a more specific source when the list origin is known."
        : `Using operator-selected default source "${normalizedDefaultSource}" because the CSV row did not provide one.`,
    ],
  };
}

export function isImportedLeadDuplicate(existingLeads: StoredLead[], importedLead: ImportedLeadDraft) {
  const propertyAddress = normalizePropertyAddress(importedLead.propertyAddress);
  const phone = normalizePhone(importedLead.phone);
  const source = normalizeLeadSourceTag(importedLead.source);
  const parcelId = importedLead.parcelId.trim().toLowerCase();
  const county = importedLead.county.trim().toLowerCase();

  if (!propertyAddress) {
    return false;
  }

  if (phone) {
    return existingLeads.some(
      (lead) =>
        normalizePropertyAddress(lead.propertyAddress) === propertyAddress && normalizePhone(lead.phone) === phone
    );
  }

  return existingLeads.some(
    (lead) => {
      const sameAddress = normalizePropertyAddress(lead.propertyAddress) === propertyAddress;
      const sameSource = normalizeLeadSourceTag(lead.source) === source;
      const sameParcel = parcelId && lead.parcelId.trim().toLowerCase() === parcelId;
      const sameCounty = county && lead.county.trim().toLowerCase() === county;

      return sameAddress && sameSource && (sameParcel || sameCounty || (!parcelId && !county));
    }
  );
}

export function parseLeadImportCsv(csvText: string, existingLeads: StoredLead[]) {
  const trimmedCsvText = csvText.trim();

  if (!trimmedCsvText) {
    return [];
  }

  const lines = trimmedCsvText.split(/\r?\n/).filter((line) => line.trim());

  if (lines.length <= 1) {
    return [];
  }

  const headers = parseCsvLine(lines[0]);
  const headerMap = new Map<number, SupportedImportColumn>();
  const matchedHeaders: string[] = [];
  const unmappedHeaders: string[] = [];

  headers.forEach((header, index) => {
    const matchedColumn = getMatchedImportColumn(header);

    if (matchedColumn) {
      headerMap.set(index, matchedColumn);
      matchedHeaders.push(header.trim());
    } else if (header.trim()) {
      unmappedHeaders.push(header.trim());
    }
  });

  return lines
    .slice(1)
    .map((line) => {
      const values = parseCsvLine(line);
      const importedLead = createEmptyImportedLeadDraft();

      values.forEach((value, index) => {
        const matchedHeader = headerMap.get(index);

        if (matchedHeader) {
          importedLead[matchedHeader] = value;
        }
      });

      if ((!importedLead.firstName || !importedLead.lastName) && importedLead.ownerName) {
        const splitName = splitOwnerName(importedLead.ownerName);
        importedLead.firstName = importedLead.firstName || splitName.firstName;
        importedLead.lastName = importedLead.lastName || splitName.lastName;
      }

      const rawSourceLabel = importedLead.source.trim();
      const sanitizedLead = sanitizeImportedLeadDraft(importedLead);
      const validationErrors = validateImportedLeadDraft(sanitizedLead);
      const sourceResolution = getSourceResolution(rawSourceLabel, validationErrors);
      const importBlockers = getImportedLeadImportBlockers(sanitizedLead);
      const importReadiness = getImportedLeadImportReadiness(sanitizedLead, sourceResolution, validationErrors);

      return {
        ...sanitizedLead,
        duplicate: isImportedLeadDuplicate(existingLeads, sanitizedLead),
        validationErrors,
        importReadiness,
        sourceResolution,
        rawSourceLabel,
        matchedHeaders,
        unmappedHeaders,
        importBlockers,
        sourceReviewReasons: getSourceReviewReasons({
          rawSourceLabel,
          sourceResolution,
          unmappedHeaders,
        })
      } satisfies ImportedLeadPreview;
    })
    .filter((lead) =>
      [
        lead.firstName,
        lead.lastName,
        lead.ownerName,
        lead.phone,
        lead.email,
        lead.propertyAddress,
        lead.city,
        lead.state,
        lead.zipCode,
        lead.mailingAddress,
        lead.county,
        lead.parcelId,
        lead.situationDetails,
        lead.rawSourceLabel
      ].some((value) => value.trim())
    );
}

export { LEAD_SOURCE_TAGS };
