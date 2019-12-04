import { Schema } from 'mongoose';
import { BaseModel } from './base.model';

export const addressSchema = new Schema({
  street: { type: Schema.Types.String, required: true },
  city: { type: Schema.Types.String, required: true },
});

export class Address extends BaseModel {
  street: string;
  city: string;

  constructor(init?: Partial<Address>) {
    super(init);
    Object.assign(this, init);
  }
}
