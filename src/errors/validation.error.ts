export class ValidationError extends Error {
  constructor(
    public place: string,
    public errors: string[]
  ) {
    super('Validation error: ' + errors.join('; '));
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
