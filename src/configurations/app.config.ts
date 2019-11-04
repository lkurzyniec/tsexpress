import { DevError } from './../errors/dev.error';
import { cleanEnv, str, port, host, bool, num } from 'envalid';
import { injectable } from 'inversify';
import { isNullOrWhitespace } from './../helpers/string.helper';

@injectable()
export class AppConfig {
  public readonly sourcePath: string = './src';

  private _mongoUser: string;
  public get mongoUser(): string {
    return this._mongoUser;
  }

  private _mongoPassword: string;
  public get mongoPassword(): string {
    return this._mongoPassword;
  }

  private _mongoHost: string;
  public get mongoHost(): string {
    return this._mongoHost;
  }

  private _mongoPort: number;
  public get mongoPort(): number {
    return this._mongoPort;
  }

  private _mongoDatabase: string;
  public get mongoDatabase(): string {
    return this._mongoDatabase;
  }

  private _applicationPort: number;
  public get applicationPort(): number {
    return this._applicationPort;
  }

  private _applicationHost: string;
  public get applicationHost(): string {
    return this._applicationHost;
  }

  private _debug: boolean;
  public get debug(): boolean {
    return this._debug;
  }

  private _tokenExpirationInMin: number;
  public get tokenExpirationInMin(): number {
    return this._tokenExpirationInMin;
  }

  public setApplicationHost(host: string) {
    if (!isNullOrWhitespace(this._applicationHost)) {
      throw new DevError(`Variable 'applicationHost' already set-up: '${this._applicationHost}'`);
    }
    this._applicationHost = host === '::' ? 'localhost' : host;
  }

  public initialize(processEnv: NodeJS.ProcessEnv) {
    const env = cleanEnv(processEnv, {
      MONGO_USER: str({ example: 'lkurzyniec' }),
      MONGO_PASSWORD: str({ example: 'someSTRONGpwd123' }),
      MONGO_HOST: host({ devDefault: 'localhost', example: 'mongodb0.example.com' }),
      MONGO_PORT: port({ default: 27017 }),
      MONGO_DATABASE: str({ default: 'libraryDB' }),
      APPLICATION_PORT: port({ devDefault: 5000, desc: 'Port number on which the Application will run' }),
      DEBUG: bool({ default: false, devDefault: true }),
      TOKEN_EXPIRATION_IN_MIN: num({ default: 15, devDefault: 60 }),
    });

    this._mongoUser = env.MONGO_USER;
    this._mongoPassword = env.MONGO_PASSWORD;
    this._mongoHost = env.MONGO_HOST;
    this._mongoPort = env.MONGO_PORT;
    this._mongoDatabase = env.MONGO_DATABASE;
    this._applicationPort = env.APPLICATION_PORT;
    this._debug = env.DEBUG;
    this._tokenExpirationInMin = env.TOKEN_EXPIRATION_IN_MIN;
  }
}
