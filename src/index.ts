import "./setup/init-dotenv";
import { init as initWebServer } from "./setup/webserver/init-web-server";
import { init as initEssentialServices } from "./setup/init-essantial-services";

(async () => {
  await initWebServer();
  await initEssentialServices();
})();
