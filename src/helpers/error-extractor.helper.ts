import { HttpError } from './../errors/http.error';
import { AppConfig } from '../configurations/app.config';
import { ValidationError } from '../errors/validation.error';
import { injectable, inject } from 'inversify';
import { STATUS_CODES } from 'statuses';

export interface ErrorResult {
  status: number;
  message: string;
  place?: string;
  errors?: string[];
  stack?: string;
}

@injectable()
export class ErrorExtractor {
  @inject(AppConfig) private appConfig: AppConfig;

  public extract(error: any): ErrorResult {
    const status500InternalServerError: number = 500;

    let status = status500InternalServerError;
    if (error instanceof HttpError) {
      status = error.status;
    }

    let message = STATUS_CODES[status];

    let errors = null;
    let place = null;
    if (error instanceof ValidationError) {
      errors = error.errors;
      place = error.place;
    }

    const result: ErrorResult = {
      status,
      message,
    }

    if (this.appConfig.debug && status === status500InternalServerError) {
      result.stack = error.stack;
      errors = [error.message];
    }

    if (errors !== null) {
      result.errors = errors;
    }
    if (place !== null) {
      result.place = place;
    }

    return result;
  }
}
