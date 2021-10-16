import { Controller, Get, Route, SuccessResponse, Tags } from "tsoa";

@Route("heartbeat")
@Tags("Heartbeat")
export class HeartbeatController extends Controller {
  @SuccessResponse("200", "Server Status")
  @Get("")
  public async getHeartbeat(): Promise<string> {
    return "Server is live and running!";
  }
}
