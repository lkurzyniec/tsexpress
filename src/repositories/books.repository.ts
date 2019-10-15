import { BookModel } from '../models/book.model';
import { BaseRepository } from "./base.repository";
import { injectable } from "inversify";

@injectable()
export class BooksRepository extends BaseRepository<BookModel> {
  protected initialize(): void {
    this.data = this.getFakeData();
  }

  public getById(id: number): BookModel {
    return this.single(x => x.id === id);
  }

  private getFakeData() {
    return [
      new BookModel({
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
      }),
      new BookModel({
        id: 2,
        title: "Hamlet",
        author: "William Shakespeare",
      }),
      new BookModel({
        id: 3,
        title: "Moby Dick",
        author: "Herman Melville",
      }),
    ];
  }
}
