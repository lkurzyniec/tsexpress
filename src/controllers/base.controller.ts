import { ValidationHandler } from './../handlers/validation.handler';
import { isNullOrWhitespace } from './../helpers/string.helper';
import { DevError } from './../errors/dev.error';
import { Router } from 'express';
import { injectable, inject } from 'inversify';

@injectable()
export abstract class BaseController {
  @inject(ValidationHandler) protected validator: ValidationHandler;

  public path: string;
  public router: Router;

  public abstract initializeRoutes(): void;

  constructor(path: string = ''){
    if (isNullOrWhitespace(path)) {
      throw new DevError(`Parameter 'path' can not be empty.`);
    }

    this.router = Router();
    this.path = path;
  }
}
