/**
 * An array of CoinDelta sorted from best performing coin to worst
 */
export type GetCoinsPriceCompareResponse = CoinDelta[];

/**
 * Representing the percent delta of a specific coin
 */
export type CoinDelta = {
  coin: string;
  percentDelta: string;
};
