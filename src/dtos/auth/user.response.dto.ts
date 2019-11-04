import { User } from './../../models/user.model';

export class UserResponseDto {
  public name: string;
  public email: string;

  constructor(init?: Partial<UserResponseDto>) {
    Object.assign(this, init);
  }

  public static fromModel(model: User): UserResponseDto {
    return new this({
      name: model.name,
      email: model.email,
    });
  }
}
