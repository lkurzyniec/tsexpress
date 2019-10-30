import { ErrorExtractor } from '../helpers/error-extractor.helper';
import { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'inversify';

@injectable()
export class ErrorMiddleware {
  @inject(ErrorExtractor) private errorHelper: ErrorExtractor;

  public handle(error: any, request: Request, response: Response, next: NextFunction): void {
    const result = this.errorHelper.extract(error);

    response
      .status(result.status)
      .send({
        ...result
      });
    next();
  }
}
