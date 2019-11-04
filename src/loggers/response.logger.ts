import { BaseLogger } from "./base.logger";
import { Response, Request } from 'express';
import { injectable } from "inversify";

@injectable()
export class ResponseLogger extends BaseLogger {
  public type: string = 'Response';

  public log(request: Request, response: Response): void {
    if (!request.path.startsWith('/swagger/')) {
      this.debug(`${response.statusCode} ${response.statusMessage}`);
    }
  }
}
