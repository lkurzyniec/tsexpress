import { injectable } from 'inversify';
import { hash, compare } from 'bcrypt';

@injectable()
export class BcryptWrapper {
  hash(data: any, saltOrRounds: string | number): Promise<string> {
    return hash(data, saltOrRounds);
  }
  compare(data: any, encrypted: string): Promise<boolean> {
    return compare(data, encrypted);
  }
}
