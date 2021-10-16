import { ValidateError } from "tsoa";
import { NextFunction, Request as ExRequest, Response as ExResponse } from "express";
import { isProduction } from "../../utils/env-utils";

const GENERAL_ERROR_MSG = "General Error";

export function appErrorHandler(
  err: any,
  req: ExRequest,
  res: ExResponse,
  next: NextFunction
): ExResponse | void {
  if (!err) {
    return next();
  }
  if (err.status?.toString().startsWith("4")) {
    console.error(err.message, err.stack);
  }

  if (isProduction && err.status >= 500) {
    return res.status(err.statusCode).send(GENERAL_ERROR_MSG);
  }

  if (err instanceof ValidateError) {
    return res.status(422).json({
      message: "Validation Failed",
      details: err?.fields,
    });
  }

  return res.status(err.status || 500).send(err.message || GENERAL_ERROR_MSG);
}
