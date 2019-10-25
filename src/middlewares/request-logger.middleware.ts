import { RequestLogger } from '../loggers/request.logger';
import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { BaseMiddleware } from './base.middleware';

@injectable()
export class RequestLoggerMiddleware extends BaseMiddleware {
  @inject(RequestLogger) private readonly requestLogger: RequestLogger;

  public order: number = 1;

  public handle(request: Request, response: Response, next): void {
    this.requestLogger.log(request);
    next();
  }
}
