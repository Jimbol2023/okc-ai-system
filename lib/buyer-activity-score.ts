export type BuyerActivityScoreEvent = {
  eventType: string;
  createdAt: Date;
};

export type BuyerActivityScore = {
  activityScore: number;
  meaningfulActivityCount: number;
  weightedEvents: Array<{
    eventType: string;
    weight: number;
    createdAt: Date;
  }>;
  lastMeaningfulActivityAt: Date | null;
};

export const BUYER_ACTIVITY_WEIGHTS: Record<string, number> = {
  deal_sent: 0,
  deal_viewed: 1,
  deal_opened: 2,
  link_clicked: 3,
  responded: 10,
  replied: 10,
  requested_details: 15,
  offer_made: 25,
  deal_closed: 50,
  deal_passed: -5,
  unsubscribed_or_inactive: -25,
};

function getWeight(eventType: string) {
  return BUYER_ACTIVITY_WEIGHTS[eventType] ?? 0;
}

function isMeaningfulEvent(eventType: string) {
  return eventType === "replied" ||
    eventType === "requested_details" ||
    eventType === "offer_made" ||
    eventType === "deal_closed";
}

export function calculateBuyerActivityScore(events: BuyerActivityScoreEvent[]): BuyerActivityScore {
  const weightedEvents = events.map((event) => ({
    eventType: event.eventType,
    weight: getWeight(event.eventType),
    createdAt: event.createdAt,
  }));
  const activityScore = weightedEvents.reduce((total, event) => total + event.weight, 0);
  const meaningfulEvents = weightedEvents.filter((event) => isMeaningfulEvent(event.eventType));
  const lastMeaningfulActivityAt =
    [...meaningfulEvents]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]?.createdAt ?? null;

  return {
    activityScore,
    meaningfulActivityCount: meaningfulEvents.length,
    weightedEvents,
    lastMeaningfulActivityAt,
  };
}
