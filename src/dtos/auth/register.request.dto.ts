import { User } from './../../models/user.model';
import { IsString, MinLength, IsEmail, Matches } from 'class-validator';

export class RegisterRequestDto {
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

  public toModel(): User {
    return new User({
      name: this.name,
      email: this.email,
    });
  };
}
