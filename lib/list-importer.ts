import type { StoredLead } from "@/lib/leads-storage";

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
  "situationDetails"
] as const;

type SupportedImportColumn = (typeof SUPPORTED_IMPORT_COLUMNS)[number];

export type ImportedLeadDraft = {
  firstName: string;
  lastName: string;
  ownerName: string;
  phone: string;
  email: string;
  propertyAddress: string;
  city: string;
  state: string;
  zipCode: string;
  mailingAddress: string;
  county: string;
  parcelId: string;
  situationDetails: string;
};

export type ImportedLeadPreview = ImportedLeadDraft & {
  duplicate: boolean;
  validationErrors: string[];
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
    situationDetails: ""
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

  if (!lead.propertyAddress.trim()) {
    errors.push("Property address is required.");
  }

  if (!sanitizeImportedLeadPhone(lead.phone)) {
    errors.push("Phone is required.");
  }

  return errors;
}

function sanitizeImportedLeadDraft(lead: ImportedLeadDraft): ImportedLeadDraft {
  return {
    ...lead,
    propertyAddress: lead.propertyAddress.trim(),
    phone: sanitizeImportedLeadPhone(lead.phone)
  };
}

export function isImportedLeadDuplicate(existingLeads: StoredLead[], importedLead: ImportedLeadDraft) {
  const propertyAddress = normalizePropertyAddress(importedLead.propertyAddress);
  const phone = normalizePhone(importedLead.phone);

  if (!propertyAddress || !phone) {
    return false;
  }

  return existingLeads.some(
    (lead) =>
      normalizePropertyAddress(lead.propertyAddress) === propertyAddress && normalizePhone(lead.phone) === phone
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

  headers.forEach((header, index) => {
    const normalizedHeader = normalizeHeader(header);
    const matchedColumn = SUPPORTED_IMPORT_COLUMNS.find((column) => normalizeHeader(column) === normalizedHeader);

    if (matchedColumn) {
      headerMap.set(index, matchedColumn);
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

      const sanitizedLead = sanitizeImportedLeadDraft(importedLead);

      return {
        ...sanitizedLead,
        duplicate: isImportedLeadDuplicate(existingLeads, sanitizedLead),
        validationErrors: validateImportedLeadDraft(sanitizedLead)
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
        lead.situationDetails
      ].some((value) => value.trim())
    );
}
