import { InvoiceItem, invoiceItemSchema } from './invoice-item.model';
import { Partner } from './partner.model';
import { User } from './user.model';
import { model, Document, Schema } from 'mongoose';
import { BaseModel } from './base.model';
import * as autopopulate from 'mongoose-autopopulate';

const invoiceSchema = new Schema({
  number: { type: Schema.Types.String, required: true },
  invoiceDate: { type: Schema.Types.Date, required: true },
  paymentDate: { type: Schema.Types.Date, required: true },
  status: { type: Schema.Types.Number, required: true },

  invoiceItems: [ invoiceItemSchema ],

  user: {
    ref: 'User',
    type: Schema.Types.ObjectId,
    required: true,
  },

  partner: {
    ref: 'Partner',
    type: Schema.Types.ObjectId,
    required: true,
    autopopulate: true,
  },
});
invoiceSchema.plugin(autopopulate);

export class Invoice extends BaseModel {
  number: string;
  invoiceDate: Date | string;
  paymentDate: Date | string;
  status: number;

  invoiceItems: InvoiceItem[];

  partner: Partner | string;
  user: User | string;

  constructor(init?: Partial<Invoice>) {
    super(init);
    Object.assign(this, init);
  }
}

export const InvoiceModel = model<Invoice & Document>('Invoice', invoiceSchema);
