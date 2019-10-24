import { Request, Response } from 'express';

export abstract class LoggingMiddleware {
  public static logRequest(request: Request, response: Response, next): void {
    if (!request.path.startsWith('/swagger/')) {
      console.log(`${request.method} ${request.path}: ${JSON.stringify(request.body)}`);
    }
    next();
  }
}
