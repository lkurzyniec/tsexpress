import { Response } from "express";
import { validate, ValidationError as Error } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { ValidationError, ValidationErrorPlace } from './../errors/validation.error';
import { BodyRequest } from './../interfaces/body.request';

export function DtoValidator<T>(type: ClassType<T>, skipMissingProperties = false) {
  const getError = function (err: Error): string {
    if (err.children && err.children.length) {
      return `${err.property}: ` + err.children.map((item) => { return getError(item); }).join('; ');
    }
    return Object.values(err.constraints).join('; ');
  }

  return function (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<(request: BodyRequest<T>, response: Response) => Promise<void>>) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (request: BodyRequest<T>, response: Response) {
      if (Object.keys(request.body).length === 0) {
        throw new ValidationError(ValidationErrorPlace.Body, 'Body of the request is required');
      }

      const dto = plainToClass(type, request.body) as T;
      request.body = dto;

      const errors = await validate(dto, { validationError: { target: false }, skipMissingProperties });
      if (errors.length > 0) {
        const resultErrors = errors.map((item) => { return getError(item); });
        throw new ValidationError(ValidationErrorPlace.Body, resultErrors);
      }

      await originalMethod.apply(this, [request, response]);
    }

    return descriptor;
  }
}
