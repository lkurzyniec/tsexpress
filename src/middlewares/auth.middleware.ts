import { TokenService } from './../services/token/token.service';
import { AuthenticatedRequest } from './../interfaces/authenticated.request';
import { Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { StatusHelper } from './../helpers/status.helper';

@injectable()
export class AuthMiddleware {
  @inject(TokenService) private readonly tokenService: TokenService;

  public handle(request: AuthenticatedRequest, response: Response, next: NextFunction): void {
    if (!request.cookies || !request.cookies.Authorization) {
      next(StatusHelper.error401Unauthorized);
      return;
    }

    const tokenData = this.tokenService.verify(request.cookies.Authorization);
    if (!tokenData) {
      next(StatusHelper.error401Unauthorized);
      return;
    }

    request.auth = tokenData;
    next();
  }
}
