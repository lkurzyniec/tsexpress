import { BooksService } from '../services/books.service';
import { AuthorsService } from './../services/authors.service';
import { SecretsProvider } from './../token/secrets.provider';
import { TokenService } from '../services/token.service';
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
import { DbLogger } from './../loggers/db.logger';
import { SwaggerConfig } from './swagger.config';

// more info: https://github.com/inversify/InversifyJS/tree/master/wiki

export class Container {
  private container: InversifyContainer;

  public getApp(): App {
    this.register();
    return this.container.get<App>(App);
  }

  private register(): void {
    this.container = new InversifyContainer();

    this.container.load(this.getLoggersModule());
    this.container.load(this.getMiddlewaresModule());
    this.container.load(this.getGeneralModule());
    this.container.load(this.getRepositoriesModule());
    this.container.load(this.getControllersModule());
    this.container.load(this.getHelpersModule());
    this.container.load(this.getServicesModule());

    this.container.bind<App>(App).toSelf();
  }

  private getControllersModule(): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<BaseController>(BaseController).to(BooksController);
      bind<BaseController>(BaseController).to(HelloController);
      bind<BaseController>(BaseController).to(AuthorsController);
      bind<BaseController>(BaseController).to(AuthController);
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
      bind<DbLogger>(DbLogger).toSelf();
      bind<AppLogger>(AppLogger).toSelf();
      bind<RequestLogger>(RequestLogger).toSelf();
      bind<ResponseLogger>(ResponseLogger).toSelf();
    });
  }

  private getMiddlewaresModule(): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<RequestLoggerMiddleware>(RequestLoggerMiddleware).toSelf();
      bind<ErrorMiddleware>(ErrorMiddleware).toSelf();
      bind<ResponseLoggerMiddleware>(ResponseLoggerMiddleware).toSelf();
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
}
