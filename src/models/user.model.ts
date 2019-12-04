import { model, Document, Schema } from 'mongoose';
import { BaseModel } from './base.model';

const userSchema = new Schema({
  name: { type: Schema.Types.String, required: true },
  email: { type: Schema.Types.String, required: true, unique: true },
  password: { type: Schema.Types.String, required: true },
});

export class User extends BaseModel {
  name: string;
  email: string;
  password: string;

  constructor(init?: Partial<User>) {
    super(init);
    Object.assign(this, init);
  }
}

export const UserModel = model<User & Document>('User', userSchema);
