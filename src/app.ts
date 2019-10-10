import * as bodyParser from 'body-parser';
import * as express from 'express';

import { ControllersProvidr } from './providers/controllers.provider';
import { LoggingMiddleware } from './middlewares/logger.middleware';
import { BaseController } from './controllers/base.controller';

export class App {
  private app: express.Application;
  private port: number;

  constructor(port: number) {
    this.app = express();
    this.port = port;

    this.initializeMiddlewares();
    this.initializeControllers();
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(LoggingMiddleware.logRequest);
  }

  private initializeControllers() {
    const controllers = ControllersProvidr.getAll();

    controllers.forEach((controller: BaseController) => {
      this.app.use('/', controller.router);
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}
