import { Author } from './../models/author.model';
import { Document, Model } from 'mongoose';
import { BaseRepository } from "./base.repository";
import { injectable } from "inversify";
import 'reflect-metadata'

@injectable()
export class AuthorsRepository extends BaseRepository<Author> {
  protected populatePath: string = '';

  constructor(mongooseModel: Model<Author & Document>){
    super(mongooseModel);
  }
}
