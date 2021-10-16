import { getTestWebServer, TestWebserver } from "../../utils/webserver";
import { API, BTC, DEFAULT_HISTORICAL_DATE } from "./constants";

describe(`GET ${API} - Input validation`, function () {
  let testWebServer: TestWebserver;
  beforeAll(async function () {
    testWebServer = await getTestWebServer(API);
  });

  afterAll(async function () {
    testWebServer.close();
  });

  jest.spyOn(console, "error").mockImplementation(() => null);
  test("should not accept empty coins array", async () => {
    await invalidRequest({ coins: [], expectedStatus: 422 });
  });

  test("should not accept non ISO dates as baseDateString", async () => {
    await invalidRequest({ baseDateString: "2021_01_033" });
  });

  test("should not accept future dates", async () => {
    await invalidRequest({
      baseDateString: new Date("2290-01-01").toISOString(),
    });
  });

  test("should not accept dates from the same day as today", async () => {
    await invalidRequest({
      baseDateString: new Date().toISOString(),
    });
  });

  async function invalidRequest({
    coins = [BTC],
    baseDateString = DEFAULT_HISTORICAL_DATE.toISOString(),
    expectedStatus = 400,
  }: {
    coins?: any;
    baseDateString?: string;
    expectedStatus?: number;
  }) {
    const { status } = await testWebServer.request().get({
      queryParams: {
        coins,
        baseDateString,
      },
    });
    expect(status).toEqual(expectedStatus);
  }
});
