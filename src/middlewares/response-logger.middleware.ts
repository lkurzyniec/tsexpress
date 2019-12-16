import { ResponseLogger } from './../loggers/response.logger';
import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';

@injectable()
export class ResponseLoggerMiddleware {
  @inject(ResponseLogger) private readonly responseLogger: ResponseLogger;

  public handle(request: Request, response: Response, next: NextFunction): void {
    const originalWrite = response.write,
      originalEnd = response.end,
      logger = this.responseLogger,
      chunks = [];

    response.write = function (chunk: any) {
      if (chunk instanceof Buffer) {
        chunks.push(chunk);
      }
      return originalWrite.apply(response, arguments);
    };

    response.end = function (chunk: any) {
      if (chunk instanceof Buffer) {
        if (chunk) {
          chunks.push(chunk);
        }

        const body = Buffer.concat(chunks).toString('utf8');
        logger.log(request, response, body);
      }

      return originalEnd.apply(response, arguments);
    };

    next();
  }
}
