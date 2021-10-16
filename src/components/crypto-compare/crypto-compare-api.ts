import axios from "axios";
import CryptoCompareGeneralError from "./crypto-compare-general-error";
import {
  CryptoCompareSymbolPriceResponse,
  CryptoCompareErrorResponse,
  CryptoCompareResponse,
} from "./crypto-compare-models";
import _ from "lodash";
const cryptoCompareAxiosInstance = axios.create({
  baseURL: "https://min-api.cryptocompare.com/data/",
  headers: { authentication: `Apikey ${process.env.CRYPTO_COMPARE_KEY}` },
});

export async function getSymbolsMultiPrice({
  symbols,
  currency = "USD",
}: {
  symbols: string[];
  currency?: string;
}): Promise<Record<string, number>> {
  const {
    data: responseData,
  }: {
    data: CryptoCompareResponse;
  } = await cryptoCompareAxiosInstance.get("/pricemulti", {
    params: { fsyms: symbols.join(","), tsyms: currency },
  });
  if (isErrorResponse(responseData)) {
    throw new CryptoCompareGeneralError((responseData as CryptoCompareErrorResponse).Message);
  }

  return _.mapValues(
    responseData as CryptoCompareSymbolPriceResponse,
    (currencyMap) => currencyMap[currency]
  );
}

export async function getSymbolHistoricalPrice({
  symbol,
  unixTimestamp,
  currency = "USD",
}: {
  symbol: string;
  unixTimestamp: number;
  currency?: string;
}): Promise<number> {
  const {
    data: responseData,
  }: {
    data: CryptoCompareResponse;
  } = await cryptoCompareAxiosInstance.get("/pricehistorical", {
    params: { fsym: symbol, tsyms: currency, ts: unixTimestamp },
  });
  if (isErrorResponse(responseData)) {
    if (isMissingDataForSymbolError(responseData)) {
      return null;
    }
    throw new CryptoCompareGeneralError((responseData as CryptoCompareErrorResponse).Message);
  }
  return (responseData as CryptoCompareSymbolPriceResponse)[symbol]?.[currency];
}

function isErrorResponse(responseData: CryptoCompareResponse) {
  return responseData.Response === "Error";
}

function isMissingDataForSymbolError(responseData: CryptoCompareResponse) {
  return responseData.Type === 2 && responseData.ParamWithError === "fsym";
}
