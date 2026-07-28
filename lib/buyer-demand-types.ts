export type BuyerTier = "A" | "B" | "C" | "D";

export type RankedSignal = {
  label: string;
  count: number;
};

export type BuyerDemandSignals = {
  hotZips: RankedSignal[];
  hotPriceRanges: RankedSignal[];
  hotPropertyTypes: RankedSignal[];
  byBuyerTier: Record<BuyerTier, number>;
};
