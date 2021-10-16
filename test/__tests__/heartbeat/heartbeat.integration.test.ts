import { getTestWebServer, TestWebserver } from "../../utils/webserver";

describe("heartbeat integration", function () {
  let testWebServer: TestWebserver;
  beforeAll(async function () {
    testWebServer = await getTestWebServer("/heartbeat");
  });

  afterAll(async function () {
    testWebServer.close();
  });

  test("should respond with valid status", async () => {
    const { status } = await testWebServer.request().get();
    expect(status).toEqual(200);
  });
});
