import { BaseLogger } from "./base.logger";
import { Response } from 'express';
import { injectable } from "inversify";
import 'reflect-metadata';

@injectable()
export class ResponseLogger extends BaseLogger {
  public type: string = 'Response';

  public log(response: Response): void {
    this.debug(`${response.statusCode} ${response.statusMessage}`);
  }
}
