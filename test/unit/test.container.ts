import { Container } from '../../src/configurations/inversify.config';
import { interfaces } from 'inversify';

export class TestContainer extends Container {
  public rebind<T>(serviceIdentifier: interfaces.ServiceIdentifier<T>): interfaces.BindingToSyntax<T> {
    return this.container.rebind<T>(serviceIdentifier);
  }

  public get<T>(serviceIdentifier: interfaces.ServiceIdentifier<T>): T {
    return this.container.get<T>(serviceIdentifier);
  }
}
