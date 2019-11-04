import { ResponseLogger } from './../loggers/response.logger';
import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';

@injectable()
export class ResponseLoggerMiddleware {
  @inject(ResponseLogger) private readonly responseLogger: ResponseLogger;

  public handle(request: Request, response: Response, next): void {
    this.responseLogger.log(request, response);
    next();
  }
}
