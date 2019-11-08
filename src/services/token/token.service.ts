import { AuthLogger } from './../../loggers/auth.logger';
import { SecretsProvider } from './secrets.provider';
import { User } from '../../models/user.model';
import { AppConfig } from '../../configurations/app.config';
import { TokenInfo, TokenData } from './token';
import { injectable, inject } from 'inversify';
import * as jwt from 'jsonwebtoken';

@injectable()
export class TokenService {
  @inject(AppConfig) private readonly appConfig: AppConfig;
  @inject(SecretsProvider) private readonly secretsProvider: SecretsProvider;
  @inject(AuthLogger) private readonly authLogger: AuthLogger;

  public create(user: User): TokenInfo {
    const tokenData: TokenData = {
      userId: user._id,
      name: user.name,
      email: user.email,
    };

    const signOptions = this.getSignOptions();
    const token = jwt.sign(tokenData, this.secretsProvider.privateKey, signOptions);

    return {
      expiresIn: signOptions.expiresIn as number,
      token,
    };
  }

  public verify(token: string): TokenData {
    if (this.appConfig.debug) {
      token = token.replace('Authorization=', '').replace(`; HttpOnly; Max-Age=${this.appConfig.tokenExpirationInMin * 60}`, '');
    }

    try {
      const signOptions = this.getSignOptions();
      const tokenData = jwt.verify(token, this.secretsProvider.publicKey, signOptions) as TokenData;
      return tokenData;
    } catch (err) {
      if (err.name !== 'TokenExpiredError') {
        this.authLogger.warn(err.message);
      }
      return null;
    }
  }

  private getSignOptions(): jwt.SignOptions {
    return {
      algorithm: 'RS256',
      expiresIn: this.appConfig.tokenExpirationInMin * 60,
    };
  }
}
