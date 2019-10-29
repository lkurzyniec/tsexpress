import { AppConfig } from '../configurations/app.config';
import { Error as MongooseError } from 'mongoose';
import { ValidationError } from '../errors/validation.error';
import { injectable, inject } from 'inversify';
import { StatusHelper } from './status.helper';

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
    let status = StatusHelper.status500InternalServerError;
    let message = 'Something went wrong';

    let errors = null;
    if (error instanceof MongooseError.ValidationError || error instanceof MongooseError.CastError) {
      status = StatusHelper.status400BadRequest;
      message = 'Validation error';
      errors = [error.message];
    }
    else if (error instanceof ValidationError) {
      status = StatusHelper.status400BadRequest;
      message = `Validation error (${error.place})`;
      errors = error.errors;
    }
    else if (error instanceof Error) {
      errors = [error.message];
    }

    let result: ErrorResult = {
      status,
      message,
    }

    if (errors !== null) {
      result.errors = errors;
    }
    if (this.appConfig.debug && error.stack && status === StatusHelper.status500InternalServerError) {
      result.stack = error.stack;
    }

    return result;
  }
}
