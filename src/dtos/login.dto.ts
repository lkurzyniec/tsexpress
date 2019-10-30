import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @MinLength(3)
  public email: string;

  @IsString()
  @MinLength(5)
  public password: string;
}
