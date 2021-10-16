export default class ServiceUnavailableError extends Error {
  public status: number;

  constructor(message: string) {
    super(message);
    this.message = message;
    this.name = "ServiceUnavailableError";
    this.status = 503;
  }
}
