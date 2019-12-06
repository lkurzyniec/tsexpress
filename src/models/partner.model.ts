import { User } from './user.model';
import { addressSchema, Address } from './address.model';
import { model, Document, Schema } from 'mongoose';
import { BaseModel } from './base.model';

const partnerSchema = new Schema({
  name: { type: Schema.Types.String, required: true },
  taxNumber: { type: Schema.Types.String, required: true },

  address: addressSchema,

  user: {
    ref: 'User',
    type: Schema.Types.ObjectId,
    required: true,
  },
});

export class Partner extends BaseModel {
  name: string;
  taxNumber: string;

  address: Address;

  user: User | string;

  constructor(init?: Partial<Partner>) {
    super(init);
    Object.assign(this, init);
  }
}

export const PartnerModel = model<Partner & Document>('Partner', partnerSchema);
