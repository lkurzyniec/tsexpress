import { BaseModel } from './base.model';

export class BookModel extends BaseModel {
  public id: number;
  public author: string;
  public title: string;

  constructor(init?: Partial<BookModel>){
    super();
    Object.assign(this, init);
  }
}
