import { IsString, MinLength, IsEmail, Matches } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(3)
  public name: string;

  @IsString()
  @IsEmail()
  public email: string;

  @IsString()
  @MinLength(8)
  @Matches(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/))
  public password: string;
}
