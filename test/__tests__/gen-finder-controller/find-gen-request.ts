import { TestWebserver } from "../../utils/webserver";

export async function findGenRequest(gen: string, testWebServer: TestWebserver): Promise<number> {
  const { status } = await testWebServer.request().get({
    path: `/genes/find/${gen}`,
  });
  return status;
}
