import { NextFunction, Request, Response } from 'express';
import { HttpError } from './../errors/http.error';

export abstract class ErrorMiddleware {
  public static response500(error: HttpError, request: Request, response: Response, next: NextFunction): void{
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    response
      .status(status)
      .send({
        message,
      });
  }
}
