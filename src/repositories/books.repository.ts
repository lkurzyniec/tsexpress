import { Book } from './../models/book.model';
import { BaseRepository } from "./base.repository";
import { Document, Model } from 'mongoose';
import { injectable } from "inversify";

@injectable()
export class BooksRepository extends BaseRepository<Book> {
  constructor(mongooseModel: Model<Book & Document>) {
    super(mongooseModel);
  }
}
