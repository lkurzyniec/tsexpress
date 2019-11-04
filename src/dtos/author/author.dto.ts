import { Author } from './../../models/author.model';
import { IsString, MinLength, Contains } from 'class-validator';

export class AuthorRequestDto {
  @IsString()
  @MinLength(3)
  @Contains(' ', { message: `$property must contain a ' ' (space)` })
  public fullName: string;

  public toModel(): Author {
    return new Author({
      fullName: this.fullName,
    });
  };
}

export class AuthorResponseDto {
  public id: string;
  public fullName: string;

  constructor(init?: Partial<AuthorResponseDto>) {
    Object.assign(this, init);
  }

  public static fromModel(model: Author): AuthorResponseDto {
    return new this({
      id: model._id,
      fullName: model.fullName,
    });
  }
}
