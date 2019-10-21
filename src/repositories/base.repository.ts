import { Model, Document, Schema } from 'mongoose';

export abstract class BaseRepository<TModel>{
  protected abstract populatePath: string;

  constructor(
    private mongooseModel: Model<TModel & Document>
    ) {

  }

  public findById(id: string): Promise<TModel> {
    return this.mongooseModel.findById(id)
      .populate(this.populatePath, "-__v")
      .select('-__v')
      .exec();
  }

  public getAll(): Promise<TModel[]> {
    return this.mongooseModel.find()
      .populate(this.populatePath, "-__v")
      .select('-__v')
      .exec();
  }

  public async create(data: TModel): Promise<TModel> {
    const entity = new this.mongooseModel(data);
    const saved = await entity.save();
    return this.findById(saved._id);
  }

  public async update(id: string, data: TModel): Promise<TModel> {
    const saved = await this.mongooseModel.findByIdAndUpdate(id, data).exec();
    return this.findById(saved._id);
  }

  public delete(id: string): Promise<TModel> {
    return this.mongooseModel.findByIdAndDelete(id)
      .exec();
  }
}
