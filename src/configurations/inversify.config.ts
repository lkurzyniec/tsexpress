import { JwtWrapper } from './../wrappers/jwt.wrapper';
import { BcryptWrapper } from './../wrappers/bcrypt.wrapper';
import { AuthLogger } from './../loggers/auth.logger';
import { AuthMiddleware } from './../middlewares/auth.middleware';
import { BooksService } from '../services/books.service';
import { AuthorsService } from './../services/authors.service';
import { SecretsProvider } from '../services/token/secrets.provider';
import { TokenService } from '../services/token/token.service';
import { AuthService } from './../services/auth.service';
import { UserModel } from './../models/user.model';
import { UsersRepository } from './../repositories/users.repository';
import { AuthController } from './../controllers/auth.controller';
import { ErrorExtractor } from '../helpers/error-extractor.helper';
import { ValidationHandler } from './../handlers/validation.handler';
import { ResponseLoggerMiddleware } from './../middlewares/response-logger.middleware';
import { ResponseLogger } from './../loggers/response.logger';
import { ErrorMiddleware } from '../middlewares/error.middleware';
import { RequestLoggerMiddleware } from '../middlewares/request-logger.middleware';
import { RequestLogger } from './../loggers/request.logger';
import { Container as InversifyContainer, interfaces, ContainerModule } from 'inversify';
import { AppLogger } from './../loggers/app.logger';
import { BookModel } from './../models/book.model';
import { AuthorModel } from './../models/author.model';
import { AuthorsRepository } from './../repositories/authors.repository';
import { AuthorsController } from './../controllers/authors.controller';
import { HelloController } from './../controllers/hello.controller';
import { MongoDbConnector } from './../connectors/mongodb.connector';
import { App } from './../app';
import { AppConfig } from './app.config';
import { BaseController } from './../controllers/base.controller';
import { BooksController } from './../controllers/books.controller';
import { BooksRepository } from './../repositories/books.repository';
import { SwaggerConfig } from './swagger.config';

// more info: https://github.com/inversify/InversifyJS/tree/master/wiki

export class Container {
  private _container: InversifyContainer = new InversifyContainer();

  protected get container() : InversifyContainer {
    return this._container;
  }

  constructor() {
    this.register();
  }

  public getApp(): App {
    return this.container.get(App);
  }

  // https://github.com/inversify/InversifyJS/blob/master/wiki/recipes.md#injecting-dependencies-into-a-function
  private bindDependencies(func: Function, dependencies: any[]): Function {
    let injections = dependencies.map((dependency) => {
      return this.container.get(dependency);
    });
    return func.bind(func, ...injections);
  }

  private register(): void {
    this._container.load(this.getLoggersModule());
    this._container.load(this.getMiddlewaresModule());
    this._container.load(this.getGeneralModule());
    this._container.load(this.getRepositoriesModule());
    this._container.load(this.getControllersModule());
    this._container.load(this.getHelpersModule());
    this._container.load(this.getServicesModule());
    this._container.load(this.getWrappersModule());

    this._container.bind<App>(App).toSelf();
  }

  private getControllersModule(): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<BaseController>(BaseController).to(BooksController);
      bind<BaseController>(BaseController).to(AuthorsController);
      bind<BaseController>(BaseController).to(AuthController);
      bind<BaseController>(BaseController).to(HelloController);
    });
  }

  private getRepositoriesModule(): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<AuthorsRepository>(AuthorsRepository).toConstantValue(new AuthorsRepository(AuthorModel));
      bind<BooksRepository>(BooksRepository).toConstantValue(new BooksRepository(BookModel));
      bind<UsersRepository>(UsersRepository).toConstantValue(new UsersRepository(UserModel));
    });
  }

  private getLoggersModule(): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<AppLogger>(AppLogger).toSelf();
      bind<RequestLogger>(RequestLogger).toSelf();
      bind<ResponseLogger>(ResponseLogger).toSelf();
      bind<AuthLogger>(AuthLogger).toSelf();
    });
  }

  private getMiddlewaresModule(): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<RequestLoggerMiddleware>(RequestLoggerMiddleware).toSelf();
      bind<ErrorMiddleware>(ErrorMiddleware).toSelf();
      bind<ResponseLoggerMiddleware>(ResponseLoggerMiddleware).toSelf();
      bind<AuthMiddleware>(AuthMiddleware).toSelf();
    });
  }

  private getGeneralModule(): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<AppConfig>(AppConfig).toSelf().inSingletonScope();
      bind<SwaggerConfig>(SwaggerConfig).toSelf();
      bind<MongoDbConnector>(MongoDbConnector).toSelf();
      bind<ValidationHandler>(ValidationHandler).toSelf();
    });
  }

  private getHelpersModule(): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<ErrorExtractor>(ErrorExtractor).toSelf();
      bind<SecretsProvider>(SecretsProvider).toSelf().inSingletonScope();
    });
  }

  private getServicesModule(): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<AuthService>(AuthService).toSelf();
      bind<TokenService>(TokenService).toSelf();
      bind<AuthorsService>(AuthorsService).toSelf();
      bind<BooksService>(BooksService).toSelf();
    });
  }

  private getWrappersModule(): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<BcryptWrapper>(BcryptWrapper).toSelf();
      bind<JwtWrapper>(JwtWrapper).toSelf();
    });
  }
}
