import { RequestLogger } from '../loggers/request.logger';
import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';

@injectable()
export class RequestLoggerMiddleware {
  @inject(RequestLogger) private readonly requestLogger: RequestLogger;

  public handle(request: Request, response: Response, next: NextFunction): void {
    this.requestLogger.log(request);
    next();
  }
}
