import { BaseLogger } from "./base.logger";
import { Request } from 'express';
import { injectable } from "inversify";

@injectable()
export class RequestLogger extends BaseLogger {
  public type: string = 'Request';

  public log(request: Request): void {
    if (!request.path.startsWith('/swagger/')) {
      let query = '\n';
      for (var propName in request.query) {
        if (request.query.hasOwnProperty(propName)) {
          query += `${propName}:${request.query[propName]}\n`;
        }
      }

      this.debug(`${request.method} '${request.path}' ${query} ${JSON.stringify(request.body)}`)
    }
  }
}
