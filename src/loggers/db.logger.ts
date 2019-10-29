import { BaseLogger } from "./base.logger";
import { injectable } from "inversify";

@injectable()
export class DbLogger extends BaseLogger {
  public type: string = 'MongoDB';
}
