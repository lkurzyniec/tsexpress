import { BaseController } from "./../controllers/base.controller";
import { HelloController } from "./../controllers/hello.controller";

export class ControllersProvidr {
  public static getAll(): BaseController[] {
    return [
      new HelloController()
    ];
  }
}
