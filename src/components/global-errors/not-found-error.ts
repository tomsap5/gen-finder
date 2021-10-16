export default class NotFoundError extends Error {
  public status: number;

  constructor(message: string) {
    super(message);
    this.message = message;
    this.name = "NotFoundError";
    this.status = 404;
  }
}
