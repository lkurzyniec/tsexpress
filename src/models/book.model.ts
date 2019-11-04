import { MongoDbConnector } from './../connectors/mongodb.connector';
import { Author } from './author.model';
import { model, Document, Schema } from 'mongoose';
import * as autopopulate from 'mongoose-autopopulate';

const bookSchema = new Schema({
  author: {
    ref: 'Author',
    type: Schema.Types.ObjectId,
    required: true,
    autopopulate: true,
  },
  title: Schema.Types.String,
}, MongoDbConnector.globalSchemaOptions());
bookSchema.plugin(autopopulate);

export class Book {
  _id: string;
  title: string;
  author: Author;

  constructor(init?: Partial<Book>) {
    Object.assign(this, init);
  }
}

export const BookModel = model<Book & Document>('Book', bookSchema);
