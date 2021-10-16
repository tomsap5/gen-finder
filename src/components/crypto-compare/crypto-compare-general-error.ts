export default class CryptoCompareGeneralError extends Error {
  public status: number;

  constructor(message: string) {
    super(message);
    this.status = 500;
  }
}
