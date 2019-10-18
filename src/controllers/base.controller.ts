import { Router } from 'express';
import { injectable } from 'inversify';
import 'reflect-metadata'

@injectable()
export abstract class BaseController {
  public path: string;
  public router: Router;

  public abstract initializeRoutes(): void;

  constructor(path: string = '/'){
    this.router = Router();
    this.path = path;
  }
}
