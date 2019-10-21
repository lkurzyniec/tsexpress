import { Author } from './author.model';
import { model, Document, Schema } from 'mongoose';

const bookSchema = new Schema({
  author: {
    ref: 'Author',
    type: Schema.Types.ObjectId,
    required: true
  },
  title: Schema.Types.String,
});

export interface Book {
  _id: string;
  title: string;
  author: Author;
}

export const BookModel = model<Book & Document>('Book', bookSchema);
