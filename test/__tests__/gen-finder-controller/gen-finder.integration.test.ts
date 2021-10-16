import { getTestWebServer, TestWebserver } from "../../utils/webserver";
import { requestGen } from "./common";
import {
  GEN_PREFIX,
  init as initGenFinderService,
} from "../../../src/components/gen-finder/gen-finder-service";
import path from "path";
import os from "os";
import fs from "mz/fs";

const PRE_FIRST_GEN = "GGTTTCAAGGACCCTTC";
const IN_BETWEEN_GENS = "GCGCGCTTAGGAAGACGTTAGCTACATGC";
const EOF_SUFFIX = "GCTTTTTTGGCTC";
const DEFAULT_DNA_FILE_EXAMPLE = `${PRE_FIRST_GEN}${GEN_PREFIX}${IN_BETWEEN_GENS}${GEN_PREFIX}${EOF_SUFFIX}`;

describe(`Gen finder - invalid inputs`, function () {
  let testFilePath: string;
  let testWebServer: TestWebserver;
  beforeAll(async function () {
    testWebServer = await getTestWebServer();
    testFilePath = path.resolve(os.tmpdir(), "test-dna.txt");
  });

  afterAll(async function () {
    testWebServer.close();
    await fs.unlink(testFilePath);
  });

  test("should find gen in between gens", async () => {
    await initServiceWithFile();
    const status = await requestGen(`${GEN_PREFIX}${IN_BETWEEN_GENS}`, testWebServer);
    expect(status).toEqual(200);
  });

  test("should find gen which is a substring of in between gens", async () => {
    await initServiceWithFile();
    const status = await requestGen(
      `${GEN_PREFIX}${IN_BETWEEN_GENS.substring(0, 1)}`,
      testWebServer
    );
    expect(status).toEqual(200);
  });

  test("should find gen in end of file", async () => {
    await initServiceWithFile();
    const status = await requestGen(`${GEN_PREFIX}${EOF_SUFFIX}`, testWebServer);
    expect(status).toEqual(200);
  });

  test("should find gen which includes a gen prefix as suffix", async () => {
    await initServiceWithFile();
    const status = await requestGen(`${GEN_PREFIX}${IN_BETWEEN_GENS}${GEN_PREFIX}`, testWebServer);
    expect(status).toEqual(200);
  });

  test("should return bad request status for gens not starting with prefix", async () => {
    await initServiceWithFile();
    const status = await requestGen(`${EOF_SUFFIX}`, testWebServer);
    expect(status).toEqual(400);
  });

  test("should return service unavailable status if did not finish (or start) reading file", async () => {
    const status = await requestGen(`${GEN_PREFIX}${EOF_SUFFIX}`, testWebServer);
    expect(status).toEqual(503);
  });

  test("should return bad request status for missing gen prefix even if file not read", async () => {
    // await initServiceWithFile();
    const status = await requestGen(`${EOF_SUFFIX}`, testWebServer);
    expect(status).toEqual(400);
  });

  async function initServiceWithFile(dnaFileContent = DEFAULT_DNA_FILE_EXAMPLE) {
    await fs.writeFile(testFilePath, dnaFileContent);
    await initGenFinderService(testFilePath);
  }
});
