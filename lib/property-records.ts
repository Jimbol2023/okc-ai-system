import { formatLeadSourceTag, normalizeLeadSourceTag, type LeadSourceTag } from "@/lib/lead-source";
import type { StoredLead } from "@/lib/leads-storage";

export type PropertyContactReadiness = "contact_ready" | "property_only_review" | "blocked_dnc";

export type PropertyReviewLane =
  | "source_cleanup"
  | "owner_cleanup"
  | "contact_cleanup"
  | "property_review"
  | "lead_ready";

export type PropertyRecordSignal =
  | "out_of_state_owner_signal"
  | "probate_or_inherited_signal"
  | "driving_for_dollars_observation"
  | "tax_or_county_list_signal"
  | "vacant_property_signal"
  | "social_or_inbound_source";

export type DashboardPropertyRecord = {
  id: string;
  leadId: string;
  createdAt: string;
  propertyAddress: string;
  city: string;
  state: string;
  zipCode: string;
  ownerName: string;
  mailingAddress: string;
  county: string;
  parcelId: string;
  source: LeadSourceTag;
  sourceLabel: string;
  originalSource: string;
  status: StoredLead["status"];
  contactReadiness: PropertyContactReadiness;
  reviewLane: PropertyReviewLane;
  signals: PropertyRecordSignal[];
  missingFields: string[];
  score: number;
  priority: StoredLead["priority"];
  doNotContact: boolean;
  requiresHumanApproval: boolean;
};

const SOCIAL_OR_INBOUND_SOURCES: LeadSourceTag[] = [
  "facebook",
  "instagram",
  "linkedin",
  "youtube",
  "google_business_profile",
  "inbound_web",
];

function hasText(value: string | null | undefined) {
  return Boolean(value?.trim());
}

function normalizeRecordKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function buildRecordId(lead: StoredLead, source: LeadSourceTag) {
  const addressKey = normalizeRecordKey(lead.propertyAddress);
  const parcelKey = normalizeRecordKey(lead.parcelId);
  const countyKey = normalizeRecordKey(lead.county);

  return [addressKey || lead.id, countyKey, parcelKey, source].filter(Boolean).join(":");
}

function getMissingFields(lead: StoredLead, source: LeadSourceTag) {
  return [
    !hasText(lead.propertyAddress) ? "property address" : "",
    !hasText(lead.source) || source === "manual_import" ? "verified source" : "",
    !hasText(lead.ownerName) ? "owner name" : "",
    !hasText(lead.phone) && !hasText(lead.email) ? "seller contact" : "",
  ].filter(Boolean);
}

function getContactReadiness(lead: StoredLead): PropertyContactReadiness {
  if (lead.doNotContact) {
    return "blocked_dnc";
  }

  if (hasText(lead.phone) || hasText(lead.email)) {
    return "contact_ready";
  }

  return "property_only_review";
}

function getReviewLane(lead: StoredLead, source: LeadSourceTag, contactReadiness: PropertyContactReadiness): PropertyReviewLane {
  if (!hasText(lead.source) || source === "manual_import") {
    return "source_cleanup";
  }

  if (!hasText(lead.ownerName)) {
    return "owner_cleanup";
  }

  if (contactReadiness === "property_only_review") {
    return "contact_cleanup";
  }

  if (lead.requiresHumanApproval || lead.approvalStatus === "needs_human_review") {
    return "property_review";
  }

  return "lead_ready";
}

function getSignals(lead: StoredLead, source: LeadSourceTag): PropertyRecordSignal[] {
  const signals = new Set<PropertyRecordSignal>();

  if (source === "out_of_state_owner" || lead.distressFlags.outOfStateOwner) {
    signals.add("out_of_state_owner_signal");
  }

  if (source === "probate" || lead.distressFlags.inheritedProperty) {
    signals.add("probate_or_inherited_signal");
  }

  if (source === "driving_for_dollars") {
    signals.add("driving_for_dollars_observation");
  }

  if (source === "tax_delinquent" || source === "county_list" || lead.distressFlags.taxDelinquent) {
    signals.add("tax_or_county_list_signal");
  }

  if (source === "vacant" || lead.distressFlags.vacantProperty) {
    signals.add("vacant_property_signal");
  }

  if (SOCIAL_OR_INBOUND_SOURCES.includes(source)) {
    signals.add("social_or_inbound_source");
  }

  return Array.from(signals);
}

export function createDashboardPropertyRecords(leads: StoredLead[]): DashboardPropertyRecord[] {
  return leads
    .filter((lead) => hasText(lead.propertyAddress))
    .map((lead) => {
      const source = normalizeLeadSourceTag(lead.source);
      const contactReadiness = getContactReadiness(lead);

      return {
        id: buildRecordId(lead, source),
        leadId: lead.id,
        createdAt: lead.timestamp,
        propertyAddress: lead.propertyAddress,
        city: lead.city,
        state: lead.state,
        zipCode: lead.zipCode,
        ownerName: lead.ownerName,
        mailingAddress: lead.mailingAddress,
        county: lead.county,
        parcelId: lead.parcelId,
        source,
        sourceLabel: formatLeadSourceTag(source),
        originalSource: lead.source,
        status: lead.status,
        contactReadiness,
        reviewLane: getReviewLane(lead, source, contactReadiness),
        signals: getSignals(lead, source),
        missingFields: getMissingFields(lead, source),
        score: lead.score,
        priority: lead.priority,
        doNotContact: Boolean(lead.doNotContact),
        requiresHumanApproval: Boolean(lead.requiresHumanApproval),
      };
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function isSocialOrInboundProperty(record: DashboardPropertyRecord) {
  return record.signals.includes("social_or_inbound_source");
}
