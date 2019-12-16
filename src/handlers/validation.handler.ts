import { ValidationError, ValidationErrorPlace } from './../errors/validation.error';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { injectable } from 'inversify';
import { validate, ValidationError as Error } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { param, validationResult } from 'express-validator';

@injectable()
export class ValidationHandler {
  public checkBody(type: any, skipMissingProperties = false): RequestHandler {
    return async (request: Request, response: Response, next: NextFunction) => {
      if (Object.keys(request.body).length === 0) {
        throw new ValidationError(ValidationErrorPlace.Body, ['Body of the request is required']);
      }

      const dto = plainToClass(type, request.body);
      request.body = dto;

      const errors = await validate(dto, { validationError: { target: false }, skipMissingProperties });
      if (errors.length > 0) {
        const resultErrors = errors.map((item) => { return this.getError(item); });
        throw new ValidationError(ValidationErrorPlace.Body, resultErrors);
      }

      next();
    }
  }

  public checkId(): RequestHandler[] {
    const validation = param('id').isMongoId();
    const validationCheck = (request: Request, response: Response, next: NextFunction) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        //const resultErrors = errors.array().map((item) => `${item.location.toUpperCase()} '${item.param}' ${item.msg}`);
        throw new ValidationError(ValidationErrorPlace.Url, [`id URL param has invalid value`]);
      }

      next();
    }
    return [validation, validationCheck];
  }

  public checkIdAndBody(type: any, skipMissingProperties = false): RequestHandler[] {
    return [...this.checkId(), this.checkBody(type, skipMissingProperties)];
  }

  private getError(err: Error): string {
    if (err.children && err.children.length) {
      return `${err.property}: ` + err.children.map((item) => { return this.getError(item); }).join('; ');
    }
    return Object.values(err.constraints).join('; ');
  }
}
