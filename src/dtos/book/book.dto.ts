import { IsString, MinLength, IsMongoId, ValidateNested, IsOptional } from 'class-validator';
import { AuthorResponseDto } from '../author/author.dto';
import { Type } from 'class-transformer/decorators';

export class BookPublisherRequestDto {
  @IsString()
  @MinLength(3)
  public name: string;

  @IsString()
  @IsOptional()
  public address: string;
}

export class BookRequestDto {
  @IsString()
  @MinLength(2)
  public title: string;

  @IsString()
  @IsMongoId({ message: `$property has invalid value` })
  public authorId: string;

  @ValidateNested()
  @Type(() => BookPublisherRequestDto)
  public publisher: BookPublisherRequestDto;
}

// -----------------------------

export class BookPublisherResponseDto {
  public name: string;
  public address: string;

  constructor(init?: Partial<BookPublisherResponseDto>) {
    Object.assign(this, init);
  }
}

export class BookResponseDto {
  public id: string;
  public title: string;

  public author: AuthorResponseDto;
  public publisher: BookPublisherResponseDto;

  constructor(init?: Partial<BookResponseDto>) {
    Object.assign(this, init);
  }
}
