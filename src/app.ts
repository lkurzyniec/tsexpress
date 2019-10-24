import { AppLogger } from './loggers/app.logger';
import { MongoDbConnector } from './connectors/mongodb.connector';
import { DevError } from './errors/dev.error';
import { AppConfig } from './configurations/app.config';
import { BaseController } from './controllers/base.controller';
import { LoggingMiddleware } from './middlewares/logging.middleware';
import { ErrorMiddleware } from './middlewares/error.middleware';
import { SwaggerConfig } from './configurations/swagger.config';
import { json as jsonBodyParser } from 'body-parser';
import * as express from 'express';
import { injectable, inject, multiInject } from 'inversify';
import { AddressInfo } from 'net';

@injectable()
export class App {
  private readonly apiPath = '/api';
  private app: express.Application = express();
  private isInitialized: boolean = false;

  @inject(AppConfig) private readonly appConfig: AppConfig;
  @multiInject(BaseController) private controllers: BaseController[];
  @inject(MongoDbConnector) private readonly dbConnector: MongoDbConnector;
  @inject(SwaggerConfig) private readonly swaggerConfig: SwaggerConfig;
  @inject(AppLogger) private readonly appLogger: AppLogger;

  public initialize(processEnv: NodeJS.ProcessEnv): void {
    this.appConfig.initialize(processEnv);

    this.dbConnector.connect();

    this.initializeMiddlewares();
    this.initializeControllers();
    this.initializeErrorHandlers();

    this.isInitialized = true;
  }

  public listen() {
    if (!this.isInitialized) {
      throw new DevError('Call initialize() before.');
    }

    const server = this.app.listen(this.appConfig.applicationPort, () => {
      const addressInfo = server.address() as AddressInfo;
      this.appConfig.setApplicationHost(addressInfo.address);

      this.swaggerConfig.initialize(this.apiPath, this.app);

      this.appLogger.info(`Listening at '${this.appConfig.applicationHost}' on '${this.appConfig.applicationPort}' port.`);
    });
  }

  private initializeMiddlewares(): void {
    this.app.use(jsonBodyParser());
    this.app.use(LoggingMiddleware.logRequest);
  }

  private initializeErrorHandlers(): void {
    this.app.use(ErrorMiddleware.response500);
  }

  private initializeControllers(): void {
    this.controllers.forEach((controller: BaseController) => {
      controller.initializeRoutes();
      this.app.use(this.apiPath, controller.router);
      this.appLogger.debug(`Registered '${controller.path}' path.`);
    });
  }
}
