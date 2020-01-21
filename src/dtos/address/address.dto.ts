import { MinLength } from 'class-validator';

export class AddressRequestDto {
  @MinLength(2)
  public street: string;

  @MinLength(2)
  public city: string;
}

export class AddressResponseDto {
  public street: string;
  public city: string;

  constructor(init?: Partial<AddressResponseDto>) {
    Object.assign(this, init);
  }
}
