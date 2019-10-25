import { BaseLogger } from "./base.logger";
import { Request } from 'express';
import { injectable } from "inversify";
import 'reflect-metadata';

@injectable()
export class RequestLogger extends BaseLogger {
  public type: string = 'Request';

  public log(request: Request): void {
    if (!request.path.startsWith('/swagger/')) {
      this.debug(`${request.method} '${request.path}' ${JSON.stringify(request.body)}`)
    }
  }
}
