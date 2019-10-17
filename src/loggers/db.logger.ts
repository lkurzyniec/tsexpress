import { BaseLogger } from "./base.logger";
import { injectable } from "inversify";
import 'reflect-metadata';

@injectable()
export class DbLogger extends BaseLogger {
  public type: string = 'MongoDB';
}
