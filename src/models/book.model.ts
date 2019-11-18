import { MongoDbConnector } from './../connectors/mongodb.connector';
import { Author } from './author.model';
import { model, Document, Schema } from 'mongoose';
import * as autopopulate from 'mongoose-autopopulate';

const publisherSchema = new Schema({
  name: { type: Schema.Types.String, required: true },
  address: Schema.Types.String,
});

const bookSchema = new Schema({
  author: {
    ref: 'Author',
    type: Schema.Types.ObjectId,
    required: true,
    autopopulate: true,
  },

  publisher: publisherSchema, // One-To-One

  title: { type: Schema.Types.String, required: true },
}, MongoDbConnector.globalSchemaOptions());
bookSchema.plugin(autopopulate);

export class Publisher {
  _id: string;
  name: string;
  address: string;

  constructor(init?: Partial<Publisher>) {
    Object.assign(this, init);
  }
}

export class Book {
  _id: string;
  title: string;
  author: Author;
  publisher: Publisher;

  constructor(init?: Partial<Book>) {
    Object.assign(this, init);
  }
}

export const BookModel = model<Book & Document>('Book', bookSchema);
