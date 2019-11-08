export class HttpError extends Error {
  public status: number;

  constructor(status: number) {
    super(`HTTP ${status} status`);
    this.status = status;
  }
}
