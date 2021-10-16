import { getTestWebServer, TestWebserver } from "../../utils/webserver";
import { GetCoinsPriceCompareResponse } from "../../../src/components/coins-price-compare/coins-price-compare-models";
import * as cryptoCompareApi from "../../../src/components/crypto-compare/crypto-compare-api";
import { mocked } from "ts-jest/utils";
import { historicalPriceMockFactory, multiPriceMockFactory } from "./crypto-compare-mock";
import { getUnixFromUnixEpoch } from "../../../src/utils/date-utils";
import { API, BTC, DEFAULT_HISTORICAL_DATE, ETH } from "./constants";

jest.mock("../../../src/components/crypto-compare/crypto-compare-api");
const mockedCryptoCompareApi = mocked(cryptoCompareApi, true);

describe(`GET ${API} - Filtering`, function () {
  let testWebServer: TestWebserver;
  beforeAll(async function () {
    testWebServer = await getTestWebServer(API);
  });

  afterAll(async function () {
    testWebServer.close();
  });

  test("should filter non existent historical coin", async () => {
    const historicalTimestamp = getUnixFromUnixEpoch(DEFAULT_HISTORICAL_DATE.getTime());
    mockedCryptoCompareApi.getSymbolHistoricalPrice.mockImplementation(
      historicalPriceMockFactory({
        [BTC]: {
          [historicalTimestamp]: 50,
        },
      })
    );
    mockedCryptoCompareApi.getSymbolsMultiPrice.mockImplementation(
      multiPriceMockFactory({
        [BTC]: 100,
        [ETH]: 45,
      })
    );

    const response = await performValidRequest({
      coins: [BTC, ETH],
    });

    bitcoinOnlyStandardValidation(response);
  });
  test("should filter non existent current coin", async () => {
    const historicalTimestamp = getUnixFromUnixEpoch(DEFAULT_HISTORICAL_DATE.getTime());
    mockedCryptoCompareApi.getSymbolHistoricalPrice.mockImplementation(
      historicalPriceMockFactory({
        [BTC]: {
          [historicalTimestamp]: 50,
        },
        [ETH]: {
          [historicalTimestamp]: 50,
        },
      })
    );
    mockedCryptoCompareApi.getSymbolsMultiPrice.mockImplementation(
      multiPriceMockFactory({
        [BTC]: 100,
      })
    );

    const response = await performValidRequest({
      coins: [BTC, ETH],
    });

    bitcoinOnlyStandardValidation(response);
  });
  test("should support all coins filtered", async () => {
    const historicalTimestamp = getUnixFromUnixEpoch(DEFAULT_HISTORICAL_DATE.getTime());
    mockedCryptoCompareApi.getSymbolHistoricalPrice.mockImplementation(
      historicalPriceMockFactory({
        [BTC]: {
          [historicalTimestamp]: 50,
        },
      })
    );
    mockedCryptoCompareApi.getSymbolsMultiPrice.mockImplementation(
      multiPriceMockFactory({
        [ETH]: 100,
      })
    );

    const response = await performValidRequest({
      coins: [BTC, ETH],
    });

    expect(response).toHaveLength(0);
  });

  async function performValidRequest({
    coins,
    baseDateString = DEFAULT_HISTORICAL_DATE.toISOString(),
    currency = "USD",
  }: {
    coins: string[];
    baseDateString?: string;
    currency?: string;
  }): Promise<GetCoinsPriceCompareResponse> {
    const { body, status } = await testWebServer.request().get({
      queryParams: {
        coins,
        baseDateString,
        currency,
      },
    });
    expect(status).toEqual(200);
    return body;
  }

  function bitcoinOnlyStandardValidation(response: GetCoinsPriceCompareResponse) {
    expect(response).toHaveLength(1);
    expect(response[0]).toEqual({ coin: "BTC", percentDelta: "100%" });
  }
});
