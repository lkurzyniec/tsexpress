import { Model, Document } from 'mongoose';
import { BaseModel } from './../models/base.model';

export abstract class BaseRepository<TModel extends BaseModel>{
  constructor(
    private mongooseModel: Model<Document<TModel>>
  ) {

  }

  public async findById(id: string): Promise<TModel> {
    const item = await this.mongooseModel.findById(id).exec();
    if (item == null) {
      return null;
    }
    return item.toObject<TModel>();
  }

  public async findOne(conditions: Partial<TModel>): Promise<TModel> {
    const item = await this.mongooseModel.findOne(conditions as any).exec();
    if (item == null) {
      return null;
    }
    return item.toObject<TModel>();
  }

  public exists(conditions: Partial<TModel>): Promise<boolean> {
    return this.mongooseModel.exists(conditions as any);
  }

  public async getAll(conditions?: Partial<TModel>, sort?: Partial<TModel>): Promise<TModel[]> {
    const query = this.mongooseModel.find(conditions as any);
    if (sort) {
      query.sort(sort);
    }
    const items = await query.exec();
    if (items == null || !items.length) {
      return [];
    }
    return items.map(item => item.toObject<TModel>());
  }

  public async create(data: TModel): Promise<TModel> {
    const entity = new this.mongooseModel(data);
    const saved = await entity.save();
    return await this.findById(saved.id);
  }

  public async update(id: string, data: TModel): Promise<TModel> {
    const saved = await this.mongooseModel.findByIdAndUpdate(id, data as any).exec();
    if (!saved) {
      return null;
    }
    return this.findById(saved.id);
  }

  public async delete(id: string): Promise<boolean> {
    const deleted = await this.mongooseModel.findByIdAndDelete(id).exec();
    return !!deleted;
  }
}
