import { Book } from './../../models/book.model';
import { IsString, MinLength, IsMongoId } from 'class-validator';
import { AuthorResponseDto } from '../author/author.dto';
import { Author } from './../../models/author.model';

export class BookRequestDto {
  @IsString()
  @MinLength(2)
  public title: string;

  @IsString()
  @IsMongoId({ message: `$property has invalid value` })
  public authorId: string;

  public toModel(): Book {
    const result = new Book({
      title: this.title,
    });
    if (this.authorId) {
      result.author = new Author({
        _id: this.authorId,
      });
    }
    return result;
  };
}

export class BookResponseDto {
  public id: string;
  public title: string;

  public author: AuthorResponseDto;

  constructor(init?: Partial<BookResponseDto>) {
    Object.assign(this, init);
  }

  public static fromModel(model: Book): BookResponseDto {
    return new this({
      id: model._id,
      title: model.title,
      author: new AuthorResponseDto({
        id: model.author._id,
        fullName: model.author.fullName,
      }),
    });
  }
}
