import { Controller, Get, Query, Route, SuccessResponse, Tags } from "tsoa";
import { GetCoinsPriceCompareResponse } from "./coins-price-compare-models";
import * as coinsPriceCompareService from "./coins-price-compare-service";
import BadRequestError from "../global-errors/bad-request-error";
import { areSameDay, getUnixFromUnixEpoch } from "../../utils/date-utils";
@Route("coins-price-compare")
@Tags("Coins Price Compare")
export class CoinsPriceCompareController extends Controller {
  /**
   * Accepts a list of coins and a base date in the past and returns a sorted array of coin information, sorted from best performing coin to worst.<br/>
   * The coin information is an object representing the difference in percentage between the given base date and now.<br/>
   * Coins for which the price info can't be found will be filtered out from the response.
   * @param coins A list of coin symbols
   * @param baseDateString An ISO date string of a date in the past. Has to be prior to today
   * @param currency An optional parameter for calculating the differance in prices, uses USD as it's default
   */
  @SuccessResponse("200")
  @Get("")
  public async getCoinsComparison(
    @Query("coins") coins: string[],
    @Query("baseDateString") baseDateString: string,
    @Query("currency") currency?: string
  ): Promise<GetCoinsPriceCompareResponse> {
    if (!coins.length) {
      throw new BadRequestError(`provided coins array can't be empty`);
    }
    const unixEpochTimestamp = dateValidations(baseDateString);
    return coinsPriceCompareService.comparePrices({
      coins,
      unixTimestamp: getUnixFromUnixEpoch(unixEpochTimestamp),
      currency,
    });
  }
}

function dateValidations(baseDateString: string) {
  const unixEpochTimestamp = Date.parse(baseDateString);
  if (isNaN(unixEpochTimestamp)) {
    throw new BadRequestError(
      `provided baseDateString ${baseDateString} is not a valid date string`
    );
  }
  if (unixEpochTimestamp >= Date.now()) {
    throw new BadRequestError(
      `provided baseDateString ${baseDateString} can't be after current date`
    );
  }
  if (areSameDay(new Date(unixEpochTimestamp), new Date())) {
    // crypto-compare api only supports getting prices on a daily basis
    throw new BadRequestError(
      `provided baseDateString ${baseDateString} can't be on same day as today`
    );
  }
  return unixEpochTimestamp;
}
