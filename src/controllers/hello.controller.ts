import { BaseController } from './base.controller';

export class HelloController extends BaseController {
  constructor() {
    super('/hello');
  }

  public initializeRoutes(): void {
    this.router.get(this.path, (request, response) => {
      response.send('Hello world!!');
    });

    this.router.post(this.path, (request, response) => {
      response.send({ response: { ...request.body } });
    });
  }
}
