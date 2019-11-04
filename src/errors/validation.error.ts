export enum ValidationErrorPlace {
  Body = 'BODY',
  Url = 'URL',
}

export class ValidationError extends Error {
  constructor(
    public place: ValidationErrorPlace,
    public errors: string[]
  ) {
    super(`${place} Validation error: ${errors.join('; ')}`);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
