import { IsString, MinLength, IsMongoId } from 'class-validator';

export class BookDto {
  @IsString()
  @MinLength(2)
  public title: string;

  @IsString()
  @IsMongoId({ message: `$property has invalid value` })
  public authorId: string;
}
