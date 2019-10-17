import { MongoDbConnector } from './connectors/mongodb.connector';
import { AppError } from './errors/app.error';
import { AppConfig } from './configurations/app.config';
import { BaseController } from './controllers/base.controller';
import { LoggingMiddleware } from './middlewares/logger.middleware';

import { json } from 'body-parser';
import * as express from 'express';

import { injectable, inject, multiInject } from 'inversify';

@injectable()
export class App {
  private app: express.Application;
  private isInitialized: boolean = false;

  @inject(AppConfig) private readonly appConfig: AppConfig;
  @multiInject(BaseController) private controllers: BaseController[];
  @inject(MongoDbConnector) private readonly dbConnector: MongoDbConnector;

  public initialize(processEnv: NodeJS.ProcessEnv): void {
    this.appConfig.initialize(processEnv);
    this.app = express();

    this.dbConnector.connect();

    this.initializeMiddlewares();
    this.initializeContainer();
    this.initializeControllers();

    this.isInitialized = true;
  }

  public listen() {
    if (!this.isInitialized) {
      throw new AppError("Call initialize() before.");
    }

    this.app.listen(this.appConfig.port, () => {
      console.log(`App listening on the port ${this.appConfig.port}`);
    });
  }

  private initializeMiddlewares(): void {
    this.app.use(json());
    this.app.use(LoggingMiddleware.logRequest);
  }

  private initializeContainer(): void {

  }

  private initializeControllers(): void {
    this.controllers.forEach((controller: BaseController) => {
      this.app.use('/', controller.router);
    });
  }
}
