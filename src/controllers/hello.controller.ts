import { BaseController } from './base.controller';
import { sentence } from 'txtgen';

export class HelloController extends BaseController {
  constructor() {
    super('/hello');
  }

  public initializeRoutes(): void {
    /**
     * @swagger
     * /hello/:
     *    get:
     *      description: Simple Hello world
     *      produces:
     *        - application/json
     *      responses:
     *        200:
     *          description: Hello message!
     */
    this.router.get(this.path, (request, response) => {
      response.send('Hello world!!');
    });

    /**
     * @swagger
     * /hello/:
     *    post:
     *      description: Simple Hello world request
     *      produces:
     *        - application/json
     *      parameters:
     *        - in: body
     *          description: Any valid JSON document
     *          name: body
     *          schema:
     *            type: object
     *            example:
     *              dog:
     *                name: Fluffy
     *                petType: dog
     *      responses:
     *        200:
     *          description: Your request with some message
     */
    this.router.post(this.path, (request, response) => {
      response.send({
        message: sentence(),
        response: { ...request.body }
      });
    });
  }
}
