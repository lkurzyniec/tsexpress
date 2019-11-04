import { ValidationError, ValidationErrorPlace } from './../errors/validation.error';
import { AuthService, RegisterResult } from './../services/auth.service';
import { RegisterRequestDto } from '../dtos/auth/register.request.dto';
import { LoginRequestDto } from '../dtos/auth/login.request.dto';
import { injectable, inject } from 'inversify';
import { BaseController } from './base.controller';
import { Request, Response, NextFunction } from "express";
import { StatusHelper } from '../helpers/status.helper';


@injectable()
export class AuthController extends BaseController {
  @inject(AuthService) private auth: AuthService;

  constructor() {
    super('/auth');
  }

  public initializeRoutes(): void {
    this.router.post(`${this.path}/login`, this.validator.checkBody(LoginRequestDto), this.login);
    this.router.post(`${this.path}/register`, this.validator.checkBody(RegisterRequestDto), this.register);
  }

  private login = async (request: Request, response: Response, next: NextFunction) => {
    const dto = request.body as LoginRequestDto;
    const loginResult = await this.auth.login(dto);
    if (loginResult) {
      response.setHeader('Set-Cookie', `Authorization=${loginResult.tokenInfo.token}; HttpOnly; Max-Age=${loginResult.tokenInfo.expiresIn}`);
      response.send(loginResult.user);
      next();
      return;
    }

    response.sendStatus(StatusHelper.status401Unauthorized);
    next();
  }

  private register = async (request: Request, response: Response, next: NextFunction) => {
    const dto = request.body as RegisterRequestDto;
    const result = await this.auth.register(dto);
    if (result === RegisterResult.Success) {
      response.sendStatus(StatusHelper.status204NoContent);
      next();
      return;
    }

    next(new ValidationError(ValidationErrorPlace.Body, [result]));
  }
}
