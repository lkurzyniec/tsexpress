import { IsString, MinLength, Contains } from 'class-validator';

export class AuthorDto {
  @IsString()
  @MinLength(3)
  @Contains(' ', { message: `$property must contain a ' ' (space)` })
  public fullName: string;
}
