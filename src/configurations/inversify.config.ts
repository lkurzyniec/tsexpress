import { ControllersProvidr } from './../providers/controllers.provider';
import { BooksRepository } from './../repositories/books.repository';
import { BooksController } from './../controllers/books.controller';
import { BaseController } from "./../controllers/base.controller";
import { Container as InversifyContainer, interfaces, ContainerModule } from "inversify";
import { AppError } from './../errors/app.error';

// more info: https://github.com/inversify/InversifyJS/tree/master/wiki

export class Container {
  private static controllersProvidrAlreadyTaken: boolean = false;
  private container: InversifyContainer;

  public register(): void {
    this.container = new InversifyContainer();

    this.container.load(this.getRepositoriesModule());
    this.container.load(this.getControllersModule());

    this.container.bind<ControllersProvidr>(ControllersProvidr).toSelf().inSingletonScope();
  }

  public getControllersProvidr(): ControllersProvidr {
    if (Container.controllersProvidrAlreadyTaken) {
      throw new AppError("'ControllersProvidr' can be taken only once, only from 'app.ts' file.");
    }

    Container.controllersProvidrAlreadyTaken = true;
    //only here Service Locator anti-pattern as an entrypoint
    return this.container.get<ControllersProvidr>(ControllersProvidr);
  }

  private getControllersModule(): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<BaseController>(BaseController).to(BooksController);
    });
  }

  private getRepositoriesModule(): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<BooksRepository>(BooksRepository).toSelf().inSingletonScope();
    });
  }
}
