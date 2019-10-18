import { AppLogger } from './loggers/app.logger';
import { MongoDbConnector } from './connectors/mongodb.connector';
import { AppError } from './errors/app.error';
import { AppConfig } from './configurations/app.config';
import { BaseController } from './controllers/base.controller';
import { LoggingMiddleware } from './middlewares/logging.middleware';
import { ErrorMiddleware } from './middlewares/error.middleware';

import { json as jsonBodyParser } from 'body-parser';
import * as express from 'express';

import { injectable, inject, multiInject } from 'inversify';


@injectable()
export class App {
  private app: express.Application = express();
  private isInitialized: boolean = false;

  @inject(AppConfig) private readonly appConfig: AppConfig;
  @multiInject(BaseController) private controllers: BaseController[];
  @inject(MongoDbConnector) private readonly dbConnector: MongoDbConnector;
  @inject(AppLogger) private readonly appLogger: AppLogger;

  public initialize(processEnv: NodeJS.ProcessEnv): void {
    this.appConfig.initialize(processEnv);

    this.dbConnector.connect();

    this.initializeMiddlewares();
    this.initializeControllers();

    this.isInitialized = true;
  }

  public listen() {
    if (!this.isInitialized) {
      throw new AppError("Call initialize() before.");
    }

    this.app.listen(this.appConfig.applicationPort, () => {
      this.appLogger.info(`App listening on the port ${this.appConfig.applicationPort}`);
    });
  }

  private initializeMiddlewares(): void {
    this.app.use(ErrorMiddleware.response500);
    this.app.use(jsonBodyParser());
    this.app.use(LoggingMiddleware.logRequest);
  }

  private initializeControllers(): void {
    this.controllers.forEach((controller: BaseController) => {
      controller.initializeRoutes();
      this.app.use('/', controller.router);
    });
  }
}
