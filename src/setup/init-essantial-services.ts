import * as genFinderService from "../components/gen-finder/gen-finder-service";

export async function init() {
  setImmediate(() => genFinderService.init());
}
