import { BaseLogger } from "./base.logger";
import { injectable } from "inversify";

@injectable()
export class AppLogger extends BaseLogger {
  public type: string = 'App';
}
