import { Controller, Get, Path, Route, Tags } from "tsoa";
import * as genFinderService from "./gen-finder-service";
import NotFoundError from "../global-errors/not-found-error";

@Route("genes")
@Tags("Genes")
export class GenFinderController extends Controller {
  @Get("find/{gen}")
  public async findGen(@Path() gen: string): Promise<string> {
    const genExists = genFinderService.genExistsInDNA(gen);
    if (!genExists) {
      throw new NotFoundError("Gen not found in DNA file");
    }
    return "Gen found in DNA file";
  }
}
