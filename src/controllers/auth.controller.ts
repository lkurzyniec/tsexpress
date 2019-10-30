import { ValidationError } from './../errors/validation.error';
import { AuthService, RegisterResult } from './../services/auth.service';
import { RegisterDto } from './../dtos/register.dto';
import { LoginDto } from './../dtos/login.dto';
import { UsersRepository } from './../repositories/users.repository';
import { injectable, inject } from 'inversify';
import { BaseController } from './base.controller';
import { Request, Response, NextFunction } from "express";
import { StatusHelper } from '../helpers/status.helper';
import { compare } from 'bcrypt';

@injectable()
export class AuthController extends BaseController {
  @inject(UsersRepository) private repo: UsersRepository;
  @inject(AuthService) private auth: AuthService;

  constructor() {
    super('/auth');
  }

  public initializeRoutes(): void {
    this.router.post(`${this.path}/login`, this.validator.checkBody(LoginDto), this.login);
    this.router.post(`${this.path}/register`, this.validator.checkBody(RegisterDto), this.register);
  }

  private login = async (request: Request, response: Response, next: NextFunction) => {
    const dto = request.body as LoginDto;
    const user = await this.repo.findOne({ email: dto.email });
    if (user) {
      const isPasswordMatch = await compare(dto.password, user.password);
      if (isPasswordMatch) {
        response.sendStatus(StatusHelper.status204NoContent);
        next();
        return;
      }
    }

    response.sendStatus(StatusHelper.status401Unauthorized);
    next();
  }

  private register = async (request: Request, response: Response, next: NextFunction) => {
    const dto = request.body as RegisterDto;
    const result = await this.auth.register(dto);
    if (result === RegisterResult.Success) {
      response.sendStatus(StatusHelper.status204NoContent);
      next();
      return;
    }

    next(new ValidationError('BODY', [result]));
  }
}
