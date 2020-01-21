import { HttpError } from './http.error';

export enum ValidationErrorPlace {
  Body = 'BODY',
  Url = 'URL',
}

export class ValidationError extends HttpError {
  public place: ValidationErrorPlace;
  public errors: string[];

  constructor(
    place: ValidationErrorPlace,
    errors: string | string[]
  ) {
    super(400);
    Object.setPrototypeOf(this, ValidationError.prototype);

    this.place = place;
    this.errors = errors instanceof Array ? errors : [errors];
  }
}
