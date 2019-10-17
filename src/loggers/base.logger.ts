import { isNullOrWhitespace } from "./../helpers/string.helper";
import { injectable } from "inversify";
import 'reflect-metadata';

@injectable()
export abstract class BaseLogger {
  public abstract type: string;

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
