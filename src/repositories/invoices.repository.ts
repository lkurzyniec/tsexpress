import { Invoice } from './../models/invoice.model';
import { Document, Model } from 'mongoose';
import { BaseRepository } from "./base.repository";
import { injectable } from "inversify";

@injectable()
export class InvoicesRepository extends BaseRepository<Invoice> {
  constructor(mongooseModel: Model<Document<Invoice>>) {
    super(mongooseModel);
  }
}
