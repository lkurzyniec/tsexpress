import { AppConfig } from './../configurations/app.config';
import { ValidationError, ValidationErrorPlace } from './../errors/validation.error';
import { AuthService, RegisterResult } from './../services/auth.service';
import { RegisterRequestDto } from '../dtos/auth/register.request.dto';
import { LoginRequestDto } from '../dtos/auth/login.request.dto';
import { injectable, inject } from 'inversify';
import { BaseController } from './base.controller';
import { Request, Response } from "express";
import { StatusHelper } from '../helpers/status.helper';
import { BodyRequest } from './../interfaces/body.request';

@injectable()
export class AuthController extends BaseController {
  @inject(AuthService) private readonly auth: AuthService;
  @inject(AppConfig) private readonly appConfig: AppConfig;

  constructor() {
    super('/auth', false);
  }

  public initializeRoutes(): void {
    this.router
      .post(`${this.path}/register`, this.validator.checkBody(RegisterRequestDto), this.register.bind(this))
      .post(`${this.path}/login`, this.validator.checkBody(LoginRequestDto), this.login.bind(this))
      .post(`${this.path}/logout`, this.logout.bind(this));
  }

  private async register(request: BodyRequest<RegisterRequestDto>, response: Response) {
    const dto = request.body;
    const result = await this.auth.register(dto);
    if (result === RegisterResult.Success) {
      response.sendStatus(StatusHelper.status204NoContent);
      return;
    }

    throw new ValidationError(ValidationErrorPlace.Body, [result]);
  }

  /**
     * @swagger
     * /auth/login/:
     *    post:
     *      tags:
     *        - auth
     *      description: Login user
     *      produces:
     *        - application/json
     *      parameters:
     *        - in: body
     *          name: body
     *          description: Login data (email and password)
     *          required: true
     *          schema:
     *            $ref: '#/definitions/LoginRequestDto'
     *      responses:
     *        200:
     *          description: Information of logged user
     *        401:
     *          description: Wrong login data
     */
  private async login(request: BodyRequest<LoginRequestDto>, response: Response) {
    const dto = request.body;
    const loginResult = await this.auth.login(dto);
    if (loginResult) {
      response.setHeader('Set-Cookie', `Authorization=${loginResult.tokenInfo.token}; HttpOnly; Max-Age=${loginResult.tokenInfo.expiresIn}; Path=${this.appConfig.apiPath}`);
      response.send(loginResult.user);
      return;
    }

    throw StatusHelper.error401Unauthorized;
  }

  /**
     * @swagger
     * /auth/logout/:
     *    post:
     *      tags:
     *        - auth
     *      summary: Logout currently logged user
     *      responses:
     *        204:
     *          description: Successfully logged out
     */
  private async logout(request: Request, response: Response) {
    response.setHeader('Set-Cookie', 'Authorization=; Max-Age=0');
    response.sendStatus(StatusHelper.status204NoContent);
  }
}
