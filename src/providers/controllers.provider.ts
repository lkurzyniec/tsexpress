import { multiInject, injectable } from "inversify";
import { BaseController } from "./../controllers/base.controller";

@injectable()
export class ControllersProvidr {
  @multiInject(BaseController) private controllers: BaseController[];

  public getAllControllers(): BaseController[] {
    return this.controllers;
  }
}
