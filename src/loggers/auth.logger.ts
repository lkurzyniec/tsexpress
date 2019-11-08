import { BaseLogger } from "./base.logger";
import { injectable } from "inversify";

@injectable()
export class AuthLogger extends BaseLogger {
  public type: string = 'Auth';
}
