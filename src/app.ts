import { ResponseLoggerMiddleware } from './middlewares/response-logger.middleware';
import { AppLogger } from './loggers/app.logger';
import { MongoDbConnector } from './connectors/mongodb.connector';
import { DevError } from './errors/dev.error';
import { AppConfig } from './configurations/app.config';
import { BaseController } from './controllers/base.controller';
import { ErrorMiddleware } from './middlewares/error.middleware';
import { SwaggerConfig } from './configurations/swagger.config';
import { json as jsonBodyParser } from 'body-parser';
import * as express from 'express';
import { injectable, inject, multiInject } from 'inversify';
import { AddressInfo } from 'net';
import { BaseMiddleware } from './middlewares/base.middleware';

@injectable()
export class App {
  private readonly apiPath = '/api';
  private app: express.Application = express();
  private isInitialized: boolean = false;

  @inject(AppConfig) private readonly appConfig: AppConfig;
  @multiInject(BaseController) private controllers: BaseController[];
  @multiInject(BaseMiddleware) private middlewares: BaseMiddleware[];
  @inject(MongoDbConnector) private readonly dbConnector: MongoDbConnector;
  @inject(SwaggerConfig) private readonly swaggerConfig: SwaggerConfig;
  @inject(AppLogger) private readonly appLogger: AppLogger;
  @inject(ErrorMiddleware) private readonly errorMiddleware: ErrorMiddleware;
  @inject(ResponseLoggerMiddleware) private readonly responseLoggerMiddleware: ResponseLoggerMiddleware;

  public initialize(process: NodeJS.Process): void {
    this.appConfig.initialize(process.env);

    this.dbConnector.connect();

    this.initializeMiddlewares();
    this.initializeControllers();
    this.initializePostMiddlewares();
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

      this.appLogger.info(`Listening at 'http://${this.appConfig.applicationHost}:${this.appConfig.applicationPort}'.`);
    });
  }

  private initializeMiddlewares(): void {
    this.app.use(jsonBodyParser());

    this.middlewares.sort((a, b) => { return a.order - b.order; });
    this.middlewares.forEach((middleware: BaseMiddleware) => {
      this.app.use(middleware.handle.bind(middleware));
    });
  }

  private initializeControllers(): void {
    this.app.get('/', (req, res) => {
      res.redirect('/swagger');
    });

    this.controllers.forEach((controller: BaseController) => {
      controller.initializeRoutes();
      this.app.use(this.apiPath, controller.router);
      this.appLogger.debug(`Registered '${controller.path}' path.`);
    });
  }

  private initializePostMiddlewares(): void {
    this.app.use(this.responseLoggerMiddleware.handle.bind(this.responseLoggerMiddleware));
  }

  private initializeErrorHandlers(): void {
    this.app.use(this.errorMiddleware.handle);
  }
}
