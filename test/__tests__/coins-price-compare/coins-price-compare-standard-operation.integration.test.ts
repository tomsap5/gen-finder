import { getTestWebServer, TestWebserver } from "../../utils/webserver";
import { GetCoinsPriceCompareResponse } from "../../../src/components/coins-price-compare/coins-price-compare-models";
import * as cryptoCompareApi from "../../../src/components/crypto-compare/crypto-compare-api";
import { mocked } from "ts-jest/utils";
import { historicalPriceMockFactory, multiPriceMockFactory } from "./crypto-compare-mock";
import { getUnixFromUnixEpoch } from "../../../src/utils/date-utils";
import { API, BNB, BTC, DEFAULT_HISTORICAL_DATE, DOGE, ETH } from "./constants";

jest.mock("../../../src/components/crypto-compare/crypto-compare-api");
const mockedCryptoCompareApi = mocked(cryptoCompareApi, true);

describe(`GET ${API} - Standard operation`, function () {
  let testWebServer: TestWebserver;
  beforeAll(async function () {
    testWebServer = await getTestWebServer(API);
  });

  afterAll(async function () {
    testWebServer.close();
  });

  test("should respond with proper display and order for different deltas", async () => {
    const historicalTimestamp = getUnixFromUnixEpoch(DEFAULT_HISTORICAL_DATE.getTime());
    mockedCryptoCompareApi.getSymbolHistoricalPrice.mockImplementation(
      historicalPriceMockFactory({
        [BTC]: {
          [historicalTimestamp]: 50,
        },
        [ETH]: {
          [historicalTimestamp]: 30,
        },
        [BNB]: {
          [historicalTimestamp]: 100,
        },
        [DOGE]: {
          [historicalTimestamp]: 300,
        },
      })
    );
    mockedCryptoCompareApi.getSymbolsMultiPrice.mockImplementation(
      multiPriceMockFactory({
        [BTC]: 100,
        [ETH]: 45,
        [BNB]: 100,
        [DOGE]: 100,
      })
    );

    const [expectedBTC, expectedETH, expectedBNB, expectedDOGE] = await performValidRequest({
      coins: [BTC, DOGE, ETH, BNB],
    });
    expect(expectedBTC).toEqual({ coin: "BTC", percentDelta: "100%" });
    expect(expectedETH).toEqual({ coin: "ETH", percentDelta: "50%" });
    expect(expectedBNB).toEqual({ coin: "BNB", percentDelta: "0%" });
    expect(expectedDOGE).toEqual({ coin: "DOGE", percentDelta: "-66.66666666666666%" });
  });

  test("should call crypto compare apis with with provided currency", async () => {
    const mockedCoin = minimalMock();
    const currency = "EUR";

    await performValidRequest({ coins: [mockedCoin], currency });

    expect(mockedCryptoCompareApi.getSymbolsMultiPrice.mock.calls[0][0].currency).toEqual(currency);
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

  function minimalMock(date = DEFAULT_HISTORICAL_DATE) {
    const historicalTimestamp = getUnixFromUnixEpoch(date.getTime());
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
      })
    );
    return BTC;
  }
});
