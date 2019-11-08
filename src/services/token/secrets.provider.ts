import { AppConfig } from '../../configurations/app.config';
import { injectable, inject } from 'inversify';
import { readFileSync } from 'fs';

@injectable()
export class SecretsProvider {
  private _privateKey: string;
  public get privateKey(): string {
    return this._privateKey;
  }

  private _publicKey: string;
  public get publicKey(): string {
    return this._publicKey;
  }

  constructor(
    @inject(AppConfig) private appConfig: AppConfig
  ) {
    this._privateKey = readFileSync(`${appConfig.sourcePath}/services/token/private.key`, 'utf8');
    this._publicKey = readFileSync(`${appConfig.sourcePath}/services/token/public.key`, 'utf8');
  }
}
