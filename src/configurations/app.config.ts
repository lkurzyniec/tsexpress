import { cleanEnv, str, port, host } from 'envalid';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class AppConfig {
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

  private _port: number;
  public get port(): number {
    return this._port;
  }

  public initialize(processEnv: NodeJS.ProcessEnv) {
    const env = cleanEnv(processEnv, {
      MONGO_USER: str(),
      MONGO_PASSWORD: str(),
      MONGO_HOST: host({ devDefault: 'localhost' }),
      MONGO_PORT: port({ default: 27017 }),
      MONGO_DATABASE: str(),
      PORT: port({ devDefault: 5000, desc: 'Port number on which the Application will run' }),
    });

    this._mongoUser = env.MONGO_USER;
    this._mongoPassword = env.MONGO_PASSWORD;
    this._mongoHost = env.MONGO_HOST;
    this._mongoPort = env.MONGO_PORT;
    this._mongoDatabase = env.MONGO_DATABASE;
    this._port = env.PORT;
  }
}
