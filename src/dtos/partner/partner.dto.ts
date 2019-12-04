import { AddressResponseDto, AddressRequestDto } from './../address/address.dto';
import { MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer/decorators';

export class PartnerRequestDto {
  @MinLength(2)
  public name: string;

  @MinLength(10)
  public taxNumber: string;

  @ValidateNested()
  @Type(() => AddressRequestDto)
  public address: AddressRequestDto;
}

export class PartnerResponseDto {
  public id: string;
  public name: string;
  public taxNumber: string;

  public address: AddressResponseDto;

  constructor(init?: Partial<PartnerResponseDto>) {
    Object.assign(this, init);
  }
}
