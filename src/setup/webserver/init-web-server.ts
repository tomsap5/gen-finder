import lusca from "lusca";
import chalk from "chalk";
import logger from "morgan";
import bodyParser from "body-parser";
import compression from "compression";
import express, { Request as ExRequest, Response as ExResponse } from "express";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "../../../build/routes";
import { appErrorHandler } from "./app-error-handler";

export async function init(port = process.env.PORT || 3000) {
  const app = express();
  app.set("port", port);
  app.use(compression());
  app.use(logger("dev"));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(lusca.xframe("SAMEORIGIN"));
  app.use(lusca.xssProtection(true));
  app.disable("x-powered-by");

  app.use("/docs", swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
    return res.send(swaggerUi.generateHTML(await import("../../../build/swagger.json")));
  });

  RegisterRoutes(app);

  app.use(appErrorHandler);

  const server = app.listen(app.get("port"), async () => {
    console.log(
      "%s App is running at http://localhost:%d in %s mode",
      chalk.green("✓"),
      app.get("port"),
      app.get("env")
    );
  });

  return { app, server };
}
