import { MongoDbConnector } from '../connectors/mongodb.connector';
import { model, Document, Schema } from 'mongoose';

const userSchema = new Schema({
  name: Schema.Types.String,
  email: Schema.Types.String,
  password: Schema.Types.String,
}, MongoDbConnector.globalSchemaOptions());

export class User {
  _id: string;
  name: string;
  email: string;
  password: string;

  constructor(init?: Partial<User>) {
    Object.assign(this, init);
  }
}

export const UserModel = model<User & Document>('User', userSchema);
