import { injectable } from 'inversify';
import { Request, Response, NextFunction } from "express";
import { BaseController } from './base.controller';
import { sentence } from 'txtgen';
import { auth } from './../decorators/auth.decorator';

@injectable()
export class HelloController extends BaseController {
  constructor() {
    super('/hello', false);
  }

  public initializeRoutes(): void {
    /**
     * @swagger
     * /hello/:
     *    get:
     *      description: Hello world
     *      produces:
     *        - application/json
     *      responses:
     *        200:
     *          description: Hello message!
     */
    this.router.get(this.path, (request, response, next) => {
      response.send('Hello world!!');
      next();
    });

    /**
     * @swagger
     * /hello/:
     *    post:
     *      description: Simple request
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
    this.router.post(this.path, (request, response, next) => {
      response.send({
        message: 'Your request were:',
        yourRequest: { ...request.body }
      });
      next();
    });

    this.router.get(`${this.path}/secret`, this.secret);
  }

  @auth()
  private secret (request: Request, response: Response, next: NextFunction) {
    response.send({
      message: sentence()
    });
    next();
  }
}
