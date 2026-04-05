export type GeneratedLeadInput = {
  firstName: string;
  lastName: string;
  phone: string;
  propertyAddress: string;
  city: string;
  state: string;
  zipCode: string;
  situationDetails: string;
  source: string;
};

const FIRST_NAMES = ["James", "Maria", "Robert", "Angela", "Derrick", "Lisa", "Marcus", "Tonya", "Kevin", "Sharon"];
const LAST_NAMES = ["Johnson", "Williams", "Carter", "Brown", "Davis", "Morris", "Parker", "Hill", "Moore", "Reed"];
const STREET_NAMES = ["Walker Ave", "May Ave", "Portland Ave", "Classen Blvd", "Western Ave", "Shields Blvd", "Council Rd"];
const CITIES = ["Oklahoma City", "Edmond", "Moore", "Norman", "Midwest City"];

const SIGNAL_LIBRARY = [
  "The property has back taxes and county notices piling up.",
  "This came through probate after an inherited property situation.",
  "The house has been vacant and unoccupied for months.",
  "The owner is behind on payments and worried about foreclosure.",
  "The property needs major repairs, roof work, and cleanup.",
  "It is a tired landlord situation with tenants and eviction stress.",
  "The seller needs an urgent sale because of relocation and timing.",
  "The owner lives out of state and does not want to manage the property anymore."
] as const;

function randomItem<T>(items: readonly T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function generatePhone() {
  const suffix = Math.floor(1000000 + Math.random() * 9000000);
  return `(405) ${String(suffix).slice(0, 3)}-${String(suffix).slice(3)}`;
}

function generateAddress() {
  const streetNumber = Math.floor(1000 + Math.random() * 7000);
  return `${streetNumber} ${randomItem(STREET_NAMES)}`;
}

function generateZipCode() {
  return String(Math.floor(73000 + Math.random() * 99)).padStart(5, "0");
}

function generateSituationDetails() {
  const signalCount = Math.floor(Math.random() * 3) + 1;
  const selectedSignals = new Set<string>();

  while (selectedSignals.size < signalCount) {
    selectedSignals.add(randomItem(SIGNAL_LIBRARY));
  }

  return Array.from(selectedSignals).join(" ");
}

export function generateLeads() {
  const leadCount = Math.floor(Math.random() * 6) + 5;

  return Array.from({ length: leadCount }, () => {
    const city = randomItem(CITIES);

    return {
      firstName: randomItem(FIRST_NAMES),
      lastName: randomItem(LAST_NAMES),
      phone: generatePhone(),
      propertyAddress: generateAddress(),
      city,
      state: "OK",
      zipCode: generateZipCode(),
      situationDetails: generateSituationDetails(),
      source: "ai-generated"
    } satisfies GeneratedLeadInput;
  });
}
