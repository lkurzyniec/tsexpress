import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';
import { injectable } from 'inversify';
import 'reflect-metadata'
import { StatusHelper } from './../helpers/status.helper';

@injectable()
export class ErrorMiddleware {
  public handle(error: any, request: Request, response: Response, next: NextFunction): void {
    var status = StatusHelper.status500InternalServerError;
    var message = 'Something went wrong';

    if (error instanceof Error.ValidationError || error instanceof Error.CastError) {
      status = StatusHelper.status400BadRequest;
      message = error.message;
    }

    response
      .status(status)
      .send({
        message,
      });
  }
}
