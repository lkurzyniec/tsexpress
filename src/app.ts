import * as bodyParser from 'body-parser';
import * as express from 'express';

import { LoggingMiddleware } from './middlewares/logger.middleware';
import { BaseController } from './controllers/base.controller';
import { Container } from './configurations/inversify.config';

export class App {
  private app: express.Application;
  private port: number;
  private container: Container;

  constructor(port: number) {
    this.app = express();
    this.port = port;

    this.initializeMiddlewares();
    this.InitializeContainer();
    this.initializeControllers();
  }

  private initializeMiddlewares(): void {
    this.app.use(bodyParser.json());
    this.app.use(LoggingMiddleware.logRequest);
  }

  private InitializeContainer(): void {
    this.container = new Container();
    this.container.register();
  }

  private initializeControllers(): void {
    const controllers = this.container.getControllersProvidr().getAllControllers();

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
