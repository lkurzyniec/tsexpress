import { Author } from './../models/author.model';
import { Document, Model } from 'mongoose';
import { BaseRepository } from "./base.repository";
import { injectable } from "inversify";

@injectable()
export class AuthorsRepository extends BaseRepository<Author> {
  constructor(mongooseModel: Model<Author & Document>){
    super(mongooseModel);
  }
}
