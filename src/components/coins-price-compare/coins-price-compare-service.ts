import * as cryptoCompareApi from "../crypto-compare/crypto-compare-api";
import _ from "lodash";
import { GetCoinsPriceCompareResponse } from "./coins-price-compare-models";
import { buildPercentDisplay } from "../../utils/display-utils";
export async function comparePrices({
  coins,
  unixTimestamp,
  currency = "USD",
}: {
  coins: string[];
  unixTimestamp: number;
  currency?: string;
}): Promise<GetCoinsPriceCompareResponse> {
  const [currentPricesMap, historicalPricesMap] = await Promise.all([
    cryptoCompareApi.getSymbolsMultiPrice({ symbols: coins, currency }),
    getHistoricalPricesMap({ coins, unixTimestamp, currency }),
  ]);
  return _.chain(currentPricesMap)
    .pickBy() // filtering non existent current prices + 0 prices (which are invalid)
    .mapValues((currentPrice, coin) => {
      if (!historicalPricesMap[coin]) {
        // filtering non existent historical prices + 0 prices (which are invalid)
        return null;
      }
      return { coin, diff: getCoinDiff(currentPrice, historicalPricesMap[coin]) };
    })
    .pickBy((coinData) => coinData !== null)
    .values()
    .orderBy(["diff"], ["desc"])
    .map(({ coin, diff }) => ({ coin, percentDelta: buildPercentDisplay(diff) }))
    .value();
}

function getCoinDiff(currentPrice: number, historicalPrice: number) {
  return (currentPrice - historicalPrice) / historicalPrice;
}

async function getHistoricalPricesMap({
  coins,
  unixTimestamp,
  currency = "USD",
}: {
  coins: string[];
  unixTimestamp: number;
  currency?: string;
}): Promise<Record<string, number>> {
  const promises = coins.map((coin) =>
    cryptoCompareApi.getSymbolHistoricalPrice({ symbol: coin, unixTimestamp, currency })
  );
  const coinPrices = await Promise.all(promises);
  return _.chain(coinPrices)
    .map((price, index) => ({ coin: coins[index], price }))
    .mapKeys(({ coin }) => coin)
    .mapValues(({ price }) => price)
    .value();
}
