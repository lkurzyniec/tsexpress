export class HttpError extends Error {
  constructor(
    public message: string,
    public status: number
  ) {
    super(message);
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}
