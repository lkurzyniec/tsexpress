import { Partner } from './../models/partner.model';
import { Document, Model } from 'mongoose';
import { BaseRepository } from "./base.repository";
import { injectable } from "inversify";

@injectable()
export class PartnersRepository extends BaseRepository<Partner> {
  constructor(mongooseModel: Model<Partner & Document>) {
    super(mongooseModel);
  }
}
