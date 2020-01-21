import { Response, Request } from "express";
import { Validator } from "class-validator";
import { ValidationError, ValidationErrorPlace } from '../errors/validation.error';

export function IdValidator(paramName: string = 'id') {
  return function (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<(request: Request, response: Response) => Promise<void>>) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (request: Request, response: Response) {
      const id = request.params[paramName];
      if (!id) {
        throw new ValidationError(ValidationErrorPlace.Url, `${paramName} URL param expected`);
      }

      const isValid = new Validator().isMongoId(id);
      if (!isValid) {
        throw new ValidationError(ValidationErrorPlace.Url, `${paramName} URL param has invalid value`);
      }

      await originalMethod.apply(this, [request, response]);
    }

    return descriptor;
  }
}
