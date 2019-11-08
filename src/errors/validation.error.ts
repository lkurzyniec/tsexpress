import { HttpError } from './http.error';

export enum ValidationErrorPlace {
  Body = 'BODY',
  Url = 'URL',
}

export class ValidationError extends HttpError {
  constructor(
    public place: ValidationErrorPlace,
    public errors: string[]
  ) {
    super(400);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
