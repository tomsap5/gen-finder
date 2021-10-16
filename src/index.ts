import "./setup/init-dotenv";
import { init as initWebServer } from "./setup/webserver/init-web-server";

(async () => {
  await initWebServer();
})();
