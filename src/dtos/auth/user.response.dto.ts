export class UserResponseDto {
  public name: string;
  public email: string;

  constructor(init?: Partial<UserResponseDto>) {
    Object.assign(this, init);
  }
}
