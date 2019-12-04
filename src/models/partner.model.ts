import { addressSchema, Address } from './address.model';
import { model, Document, Schema } from 'mongoose';
import { BaseModel } from './base.model';

const partnerSchema = new Schema({
  name: { type: Schema.Types.String, required: true, unique: true },
  taxNumber: { type: Schema.Types.String, required: true, unique: true },

  address: addressSchema,

  user: {
    ref: 'User',
    type: Schema.Types.ObjectId,
  },
});

export class Partner extends BaseModel {
  name: string;
  taxNumber: string;

  address: Address;
  userId: string;

  constructor(init?: Partial<Partner>) {
    super(init);
    Object.assign(this, init);
  }
}

export const PartnerModel = model<Partner & Document>('Partner', partnerSchema);
