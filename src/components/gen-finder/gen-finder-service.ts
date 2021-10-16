import { TextInFileByPrefixFinder } from "./text-in-file-by-prefix-finder/text-in-file-by-prefix-finder";
import BadRequestError from "../global-errors/bad-request-error";
import ServiceUnavailableError from "../global-errors/service-unavailable-error";

export const GEN_PREFIX = "AAAAAAAAAAA";
export const genFinder = new TextInFileByPrefixFinder(GEN_PREFIX);

export function init(filePath = process.env.DNA_FILE_PATH) {
  return genFinder.initializeRead(filePath);
}

export function genExistsInDNA(gen: string) {
  if (!gen.startsWith(GEN_PREFIX)) {
    throw new BadRequestError(`given gen doesn't start with a valid gen prefix: ${GEN_PREFIX}`);
  }
  if (!genFinder.didFinishReadingFile) {
    throw new ServiceUnavailableError("dna file still not ready");
  }
  return genFinder.isTextFoundInFile(gen);
}
