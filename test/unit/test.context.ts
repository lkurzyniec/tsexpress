import 'reflect-metadata';
import { TestContainer } from './test.container';
import { interfaces } from 'inversify';

export class TestContext {
  private container = new TestContainer();

  public mock<T>(
    implementation: () => Partial<T>,
    serviceIdentifier: interfaces.ServiceIdentifier<T>
  ) : T {
    const mock = this.mockClass<T>(implementation);
    this.container.rebind<T>(serviceIdentifier).toConstantValue(mock);
    return mock;
  }

  public get<T>(serviceIdentifier: interfaces.ServiceIdentifier<T>): T {
    return this.container.get<T>(serviceIdentifier);
  }

  private mockClass<T>(implementation: () => Partial<T>): T {
    return jest.fn(implementation)() as T;
  }
}
