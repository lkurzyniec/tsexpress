import { IsString, MinLength, Contains } from 'class-validator';

export class AuthorRequestDto {
  @IsString()
  @MinLength(3)
  @Contains(' ', { message: `$property must contain a ' ' (space)` })
  public fullName: string;
}

export class AuthorResponseDto {
  public id: string;
  public fullName: string;

  constructor(init?: Partial<AuthorResponseDto>) {
    Object.assign(this, init);
  }
}
