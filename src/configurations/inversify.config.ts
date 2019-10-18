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

import { Container as InversifyContainer, interfaces, ContainerModule } from 'inversify';

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
    this.container.load(this.getRepositoriesModule());
    this.container.load(this.getControllersModule());

    this.container.bind<AppConfig>(AppConfig).toSelf().inSingletonScope();
    this.container.bind<MongoDbConnector>(MongoDbConnector).toSelf();
    this.container.bind<App>(App).toSelf();
  }

  private getControllersModule(): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<BaseController>(BaseController).to(BooksController);
      bind<BaseController>(BaseController).to(HelloController);
      bind<BaseController>(BaseController).to(AuthorsController);
    });
  }

  private getRepositoriesModule(): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<AuthorsRepository>(AuthorsRepository).toConstantValue(new AuthorsRepository(AuthorModel));
      bind<BooksRepository>(BooksRepository).toConstantValue(new BooksRepository(BookModel));
    });
  }

  private getLoggersModule(): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<DbLogger>(DbLogger).toSelf();
      bind<AppLogger>(AppLogger).toSelf();
    });
  }
}
