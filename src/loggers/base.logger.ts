import { AppConfig } from './../configurations/app.config';
import { isNullOrWhitespace } from "./../helpers/string.helper";
import { injectable, inject } from "inversify";
import 'reflect-metadata';

@injectable()
export abstract class BaseLogger {
  @inject(AppConfig) protected readonly appConfig: AppConfig;

  public abstract type: string;

  public debug(message: any): void {
    if (!this.appConfig.debug) {
      return;
    }
    console.log(`[DEBUG] ${this.type}: ${message}`);
  }

  public info(message: any): void {
    console.log(`[INFO] ${this.type}: ${message}`);
  }

  public error(error: any, message?: any): void {
    if (isNullOrWhitespace(message)) {
      console.log(`[ERROR] ${this.type}: ${error}`);
      return;
    }
    console.log(`[ERROR] ${this.type}: ${message}. ${error}`);
  }

  public table(tabularData: any): void {
    console.log(`${this.type}: ${tabularData}`);
  }
}
