import { AppConfig } from './../configurations/app.config';
import { isNullOrWhitespace } from "./../helpers/string.helper";
import { injectable, inject } from "inversify";

enum Colors {
  Black = 30,
  Red = 31,
  Green = 32,
  Yellow = 33,
  Pink = 35,
  Blue = 36,

  BgBlack = 40,
  BgRed = 41,
  BgGreen = 42,
  BgYellow = 43,
  BgPink = 45,
  BgBlue = 46,
}

@injectable()
export abstract class BaseLogger {
  @inject(AppConfig) protected readonly appConfig: AppConfig;

  public abstract type: string;

  public debug(message: any): void {
    if (!this.appConfig.debug) {
      return;
    }
    console.log(`${this.colored('DEBUG', Colors.Blue)} ${this.type}: ${message}`);
  }

  public info(message: any): void {
    console.log(`${this.colored('INFO', Colors.Green)} ${this.type}: ${message}`);
  }

  public warn(message: any): void {
    console.log(`${this.colored('WARN', Colors.Yellow)} ${this.type}: ${message}`);
  }

  public error(error: any, message?: any): void {
    if (isNullOrWhitespace(message)) {
      console.log(`${this.colored('ERROR', Colors.Red)} ${this.type}: ${error}`);
      return;
    }
    console.log(`${this.colored('ERROR', Colors.Red)} ${this.type}: ${message}. ${error}`);
  }

  public table(tabularData: any): void {
    console.log(`${this.type}: ${tabularData}`);
  }

  private colored(str: string, col: Colors): string {
    return `\u001b[${col}m${str}\u001b[0m`;
  }
}
