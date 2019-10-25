import { Request, Response, NextFunction } from 'express';
import { injectable } from 'inversify';

@injectable()
export abstract class BaseMiddleware {
  public abstract order: number;
  public abstract handle(request: Request, response: Response, next: NextFunction): void;
}
