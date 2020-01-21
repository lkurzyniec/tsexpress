export abstract class BaseModel {
  _id: string;

  constructor(init?: Partial<BaseModel>){
    Object.assign(this, init);
  }
}
