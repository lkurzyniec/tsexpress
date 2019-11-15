import { IsString, MinLength, IsMongoId } from 'class-validator';
import { AuthorResponseDto } from '../author/author.dto';

export class BookRequestDto {
  @IsString()
  @MinLength(2)
  public title: string;

  @IsString()
  @IsMongoId({ message: `$property has invalid value` })
  public authorId: string;
}

export class BookResponseDto {
  public id: string;
  public title: string;

  public author: AuthorResponseDto;

  constructor(init?: Partial<BookResponseDto>) {
    Object.assign(this, init);
  }
}
