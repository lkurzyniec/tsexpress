import { AuthenticatedRequest } from './../interfaces/authenticated.request';
import { AuthMiddleware } from './../middlewares/auth.middleware';
import { ValidationHandler } from './../handlers/validation.handler';
import { isNullOrWhitespace } from './../helpers/string.helper';
import { DevError } from './../errors/dev.error';
import { Router, Response, NextFunction, RequestHandler } from 'express';
import { injectable, inject } from 'inversify';

@injectable()
export abstract class BaseController {
  @inject(AuthMiddleware) private readonly authMiddleware: AuthMiddleware;
  @inject(ValidationHandler) protected readonly validator: ValidationHandler;

  public readonly path: string;
  public readonly router: Router;

  public abstract initializeRoutes(): void;

  constructor(path: string = '', addAuth: boolean = true) {
    if (isNullOrWhitespace(path)) {
      throw new DevError(`Parameter 'path' can not be empty.`);
    }

    this.router = Router();
    this.path = path;

    if (addAuth) {
      this.router
        .all(this.path, this.authenticate())
        .all(`${this.path}/*`, this.authenticate());
    }
  }

  private authenticate(): RequestHandler {
    return (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
      if (request.method === 'GET') {
        next();
        return;
      }

      this.authMiddleware.handle(request, response, next);
    };
  }
}
