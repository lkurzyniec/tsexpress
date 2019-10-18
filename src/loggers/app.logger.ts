import { BaseLogger } from "./base.logger";
import { injectable } from "inversify";
import 'reflect-metadata';

@injectable()
export class AppLogger extends BaseLogger {
  public type: string = 'App';
}
