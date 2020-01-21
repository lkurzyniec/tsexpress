import { AuthRequest } from '../interfaces/auth.request';
import { AuthMiddleware } from './../middlewares/auth.middleware';
import { isNullOrWhitespace } from './../helpers/string.helper';
import { DevError } from './../errors/dev.error';
import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { injectable, inject } from 'inversify';
import { Validator } from "class-validator";
import PromiseRouter from "express-promise-router";

@injectable()
export abstract class BaseController {
  @inject(AuthMiddleware) private readonly authMiddleware: AuthMiddleware;

  public readonly path: string;
  public readonly router: Router;

  public abstract initializeRoutes(): void;

  constructor(path: string = '', addAuth: boolean = true) {
    if (isNullOrWhitespace(path)) {
      throw new DevError(`Parameter 'path' can not be empty.`);
    }

    this.router = PromiseRouter();
    this.path = path;

    if (addAuth) {
      this.router
        .all(this.path, this.authenticate())
        .all(`${this.path}/*`, this.authenticate());
    }
  }

  protected getBoolFromQueryParams(request: Request, queryParam: string): boolean {
    const paramValue = request.query[queryParam] || "false";
    const value = new Validator().isBooleanString(paramValue) && (paramValue.toLowerCase() === "true" || paramValue === "1");
    return value;
  }

  private authenticate(): RequestHandler {
    return (request: AuthRequest, response: Response, next: NextFunction) => {
      this.authMiddleware.handle(request, response, next);
    };
  }
}
