import { Schema } from 'mongoose';
import { BaseModel } from './base.model';

export const invoiceItemSchema = new Schema({
  name: { type: Schema.Types.String, required: true },
  quantity: { type: Schema.Types.Number, required: true },
  unitPrice: { type: Schema.Types.Decimal128, required: true },
});

export class InvoiceItem extends BaseModel {
  name: string;
  quantity: number;
  unitPrice: number;

  constructor(init?: Partial<InvoiceItem>) {
    super(init);
    Object.assign(this, init);
  }
}
