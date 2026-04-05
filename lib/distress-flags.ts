const DISTRESS_FLAG_LABELS = {
  taxDelinquent: "Tax Delinquent",
  inheritedProperty: "Inherited Property",
  vacantProperty: "Vacant Property",
  foreclosureRisk: "Foreclosure Risk",
  majorRepairs: "Major Repairs",
  tiredLandlord: "Tired Landlord",
  urgentTimeline: "Urgent Timeline",
  outOfStateOwner: "Out-of-State Owner"
} as const;

const DISTRESS_FLAG_POINTS = {
  taxDelinquent: 25,
  inheritedProperty: 20,
  vacantProperty: 15,
  foreclosureRisk: 30,
  majorRepairs: 20,
  tiredLandlord: 15,
  urgentTimeline: 25,
  outOfStateOwner: 10
} as const;

export type DistressFlagKey = keyof typeof DISTRESS_FLAG_LABELS;

export type DistressFlags = Record<DistressFlagKey, boolean>;

const DEFAULT_DISTRESS_FLAGS: DistressFlags = {
  taxDelinquent: false,
  inheritedProperty: false,
  vacantProperty: false,
  foreclosureRisk: false,
  majorRepairs: false,
  tiredLandlord: false,
  urgentTimeline: false,
  outOfStateOwner: false
};

const TAX_KEYWORDS = ["tax", "delinquent", "back taxes", "county sale", "tax sale", "tax lien"];
const INHERITED_KEYWORDS = ["inherit", "inherited", "probate", "heir", "estate"];
const VACANT_KEYWORDS = ["vacant", "empty", "unoccupied", "abandoned"];
const FORECLOSURE_KEYWORDS = ["foreclosure", "behind on payments", "default", "notice of default", "auction"];
const REPAIR_KEYWORDS = ["repair", "repairs", "damage", "cleanup", "fire", "foundation", "roof", "mold", "rehab"];
const LANDLORD_KEYWORDS = ["tenant", "rental", "landlord", "eviction", "vacancy", "vacant rental"];
const URGENT_KEYWORDS = ["urgent", "fast sale", "relocate", "asap", "immediately", "quickly", "need to sell fast"];

function includesAnyKeyword(content: string, keywords: string[]) {
  return keywords.some((keyword) => content.includes(keyword));
}

function extractStateFromMailingAddress(mailingAddress: string) {
  const upperMailingAddress = mailingAddress.toUpperCase();
  const stateMatch = upperMailingAddress.match(/\b(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|IA|ID|IL|IN|KS|KY|LA|MA|MD|ME|MI|MN|MO|MS|MT|NC|ND|NE|NH|NJ|NM|NV|NY|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VA|VT|WA|WI|WV|WY|DC)\b/);

  return stateMatch?.[1] ?? "";
}

export function detectDistressFlags({
  situationDetails,
  source,
  mailingAddress,
  propertyState
}: {
  situationDetails: string;
  source: string;
  mailingAddress: string;
  propertyState: string;
}) {
  const searchableDetails = `${situationDetails} ${source}`.trim().toLowerCase();
  const mailingState = extractStateFromMailingAddress(mailingAddress);
  const normalizedPropertyState = propertyState.trim().toUpperCase();

  return {
    taxDelinquent: includesAnyKeyword(searchableDetails, TAX_KEYWORDS) || source.toLowerCase().includes("county"),
    inheritedProperty: includesAnyKeyword(searchableDetails, INHERITED_KEYWORDS),
    vacantProperty: includesAnyKeyword(searchableDetails, VACANT_KEYWORDS),
    foreclosureRisk: includesAnyKeyword(searchableDetails, FORECLOSURE_KEYWORDS),
    majorRepairs: includesAnyKeyword(searchableDetails, REPAIR_KEYWORDS),
    tiredLandlord: includesAnyKeyword(searchableDetails, LANDLORD_KEYWORDS),
    urgentTimeline: includesAnyKeyword(searchableDetails, URGENT_KEYWORDS),
    outOfStateOwner: Boolean(mailingState && normalizedPropertyState && mailingState !== normalizedPropertyState)
  } satisfies DistressFlags;
}

export function normalizeDistressFlags(flags?: Partial<DistressFlags>) {
  return {
    ...DEFAULT_DISTRESS_FLAGS,
    ...flags
  };
}

export function getActiveDistressFlags(flags: DistressFlags) {
  return Object.entries(flags)
    .filter(([, isActive]) => isActive)
    .map(([key]) => ({
      key: key as DistressFlagKey,
      label: DISTRESS_FLAG_LABELS[key as DistressFlagKey]
    }));
}

export function getOpportunityScore(flags: DistressFlags) {
  const flagCount = getActiveDistressFlags(flags).length;

  if (flagCount >= 4) {
    return "High";
  }

  if (flagCount >= 2) {
    return "Medium";
  }

  return "Low";
}

export function getLeadScore(flags: DistressFlags) {
  return getActiveDistressFlags(flags).reduce((total, flag) => total + DISTRESS_FLAG_POINTS[flag.key], 0);
}

export function getLeadPriority(score: number) {
  if (score >= 70) {
    return "High" as const;
  }

  if (score >= 40) {
    return "Medium" as const;
  }

  return "Low" as const;
}

export function getLeadScoreBreakdown(flags: DistressFlags) {
  const activeFlags = getActiveDistressFlags(flags);

  if (activeFlags.length === 0) {
    return "This lead has not triggered any distress signals yet.";
  }

  return `This lead scored based on: ${activeFlags.map((flag) => flag.label.toLowerCase()).join(", ")}.`;
}
