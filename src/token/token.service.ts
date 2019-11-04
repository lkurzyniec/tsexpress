import { SecretsProvider } from './secrets.provider';
import { User } from '../models/user.model';
import { AppConfig } from '../configurations/app.config';
import { TokenInfo, TokenData } from './token';
import { injectable, inject } from 'inversify';
import * as jwt from 'jsonwebtoken';

@injectable()
export class TokenService {
  @inject(AppConfig) private readonly appConfig: AppConfig;
  @inject(SecretsProvider) private readonly secretsProvider: SecretsProvider;

  public createToken(user: User): TokenInfo {
    const expiresIn = this.appConfig.tokenExpirationInMin * 60;

    const tokenData: TokenData = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    const signOptions: jwt.SignOptions = {
      subject: user.email,
      algorithm: 'RS256',
      expiresIn,
    }

    const token = jwt.sign(tokenData, this.secretsProvider.privateKey, signOptions);

    return {
      expiresIn,
      token,
    };
  }
}
