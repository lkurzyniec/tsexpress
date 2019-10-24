export class DevError extends Error {
  constructor(message?: string) {
      super(message);
      Object.setPrototypeOf(this, DevError.prototype);
  }
}
