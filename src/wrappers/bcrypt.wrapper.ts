import { injectable } from 'inversify';
import { hash, compare } from 'bcrypt';

@injectable()
export class BcryptWrapper {
  public hash(data: any, saltOrRounds: string | number): Promise<string> {
    return hash(data, saltOrRounds);
  }

  public compare(data: any, encrypted: string): Promise<boolean> {
    return compare(data, encrypted);
  }
}
