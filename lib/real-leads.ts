import type { GeneratedLeadInput } from "@/lib/lead-generator";

type PlaceholderUser = {
  name: string;
  phone?: string;
  email?: string;
  address?: {
    street?: string;
    suite?: string;
    city?: string;
    zipcode?: string;
  };
  company?: {
    catchPhrase?: string;
    bs?: string;
  };
};

function splitName(name: string) {
  const parts = name.trim().split(/\s+/);

  if (parts.length <= 1) {
    return {
      firstName: parts[0] ?? "Unknown",
      lastName: ""
    };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" ")
  };
}

function buildSituationDetails(user: PlaceholderUser) {
  const parts = [
    user.company?.catchPhrase,
    user.company?.bs,
    "External dataset lead loaded for review and qualification."
  ].filter(Boolean);

  return parts.join(" ");
}

export async function fetchRealLeads(): Promise<GeneratedLeadInput[]> {
  const response = await fetch("https://jsonplaceholder.typicode.com/users", {
    method: "GET",
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Failed to fetch external leads.");
  }

  const users = (await response.json()) as PlaceholderUser[];

  return users.slice(0, 8).map((user) => {
    const { firstName, lastName } = splitName(user.name ?? "Unknown Owner");
    const street = user.address?.street ?? "Unknown Street";
    const suite = user.address?.suite ? ` ${user.address.suite}` : "";

    return {
      firstName,
      lastName,
      phone: user.phone ?? "",
      propertyAddress: `${street}${suite}`.trim(),
      city: user.address?.city ?? "Oklahoma City",
      state: "OK",
      zipCode: (user.address?.zipcode ?? "73102").slice(0, 5),
      situationDetails: buildSituationDetails(user),
      source: "external"
    };
  });
}
