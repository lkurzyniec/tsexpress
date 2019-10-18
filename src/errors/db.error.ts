export class DbError extends Error {
  constructor(message?: string) {
      super(message);
      Object.setPrototypeOf(this, DbError.prototype);
  }
}
