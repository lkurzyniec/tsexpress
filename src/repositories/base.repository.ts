import { Model, Document, Schema } from 'mongoose';

export abstract class BaseRepository<TModel>{
  constructor(protected mongooseModel: Model<TModel & Document>) {

  }

  public findById(id: string): Promise<TModel> {
    return this.mongooseModel.findById(id).exec();
  }

  public getAll(): Promise<TModel[]> {
    return this.mongooseModel.find().exec();
  }

  public create(data: TModel): Promise<TModel> {
    const entity = new this.mongooseModel(data);
    return entity.save();
  }

  public update(id: string, data: TModel): Promise<TModel> {
    return this.mongooseModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  public delete(id: string): Promise<TModel> {
    return this.mongooseModel.findByIdAndDelete(id).exec();
  }
}
