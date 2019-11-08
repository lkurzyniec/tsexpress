import { MongoDbConnector } from '../connectors/mongodb.connector';
import { model, Document, Schema } from 'mongoose';

const userSchema = new Schema({
  name: { type: Schema.Types.String, required: true },
  email: { type: Schema.Types.String, required: true, unique: true },
  password: { type: Schema.Types.String, required: true },
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
