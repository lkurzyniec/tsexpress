import { ValidationError } from './../errors/validation.error';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { injectable } from 'inversify';
import { validate, ValidationError as Error } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { param, validationResult } from 'express-validator';

enum ErrorPlace {
  Body = "BODY",
  Url = "URL",
}

@injectable()
export class ValidationHandler {
  public checkBody(type: any, skipMissingProperties = false): RequestHandler {
    return (request: Request, response: Response, next: NextFunction) => {
      validate(plainToClass(type, request.body), { validationError: { target: false }, skipMissingProperties })
        .then((errors: Error[]) => {
          if (errors.length > 0) {
            const resultErrors = errors.map((item) => Object.values(item.constraints)).reduce((a, b) => { return a.concat(b); });
            next(new ValidationError(ErrorPlace.Body, resultErrors));
          }
          next();
        })
        .catch(next);
    }
  }

  public checkId(): RequestHandler[] {
    const validation = param('id').isMongoId();
    const validationCheck = (request: Request, response: Response, next: NextFunction) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        //const resultErrors = errors.array().map((item) => `${item.location.toUpperCase()} '${item.param}' ${item.msg}`);
        next(new ValidationError(ErrorPlace.Url, [`id URL param has invalid value`]));
      }
      next();
    }
    return [validation, validationCheck];
  }

  public checkIdAndBody(type: any, skipMissingProperties = false): RequestHandler[] {
    return [...this.checkId(), this.checkBody(type, skipMissingProperties)];
  }
}
