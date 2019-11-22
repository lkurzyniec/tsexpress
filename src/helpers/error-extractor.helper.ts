import { HttpError } from './../errors/http.error';
import { AppConfig } from '../configurations/app.config';
import { ValidationError } from '../errors/validation.error';
import { injectable, inject } from 'inversify';
import * as statuses from 'statuses';

export interface ErrorResult {
  status: number;
  message: string;
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

    let message = statuses[status];

    let errors = null;
    if (error instanceof ValidationError) {
      errors = error.errors;
    }

    let result: ErrorResult = {
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

    return result;
  }
}
