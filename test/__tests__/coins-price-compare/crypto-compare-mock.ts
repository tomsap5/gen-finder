import _ from "lodash";

export function multiPriceMockFactory(currentPricesBySymbols: Record<string, number>) {
  return async ({ symbols }) => {
    return _.chain(symbols)
      .keyBy()
      .mapValues((symbol) => currentPricesBySymbols[symbol])
      .value();
  };
}

export function historicalPriceMockFactory(
  historicalPricesMapBySymbols: Record<string, Record<number, number>>
): ({ symbol, unixTimestamp }: { symbol: any; unixTimestamp: any }) => Promise<any> {
  return async ({ symbol, unixTimestamp }) => {
    return historicalPricesMapBySymbols[symbol]?.[unixTimestamp];
  };
}
