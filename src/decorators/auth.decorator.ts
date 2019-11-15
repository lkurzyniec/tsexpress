import { AuthenticatedRequest } from './../interfaces/authenticated.request';
import { NextFunction, Response } from "express";

export function auth(): MethodDecorator {
  return function(target: any, propertyKey: any, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function(request: AuthenticatedRequest, response: Response, next: NextFunction) {
      console.log('Auth goes here');
      originalMethod(request, response, next);
    }
  }
}
