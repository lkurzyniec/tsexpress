import { model, Document, Schema } from 'mongoose';

const authorSchema = new Schema({
  fullName: Schema.Types.String,
});

export interface Author {
  _id: string;
  fullName: number;
}

export const AuthorModel = model<Author & Document>('Author', authorSchema);
