import { MinLength, IsInt, IsPositive, IsDecimal, NotContains } from 'class-validator';

export class InvoiceItemRequestDto {
  @MinLength(3)
  public name: string;

  @IsInt()
  @IsPositive()
  public quantity: number;

  @IsDecimal({ force_decimal: true })
  @NotContains("-")
  public unitPrice: number;
}

export class InvoiceItemResponseDto {
  public name: string;
  public quantity: number;
  public unitPrice: number;

  constructor(init?: Partial<InvoiceItemResponseDto>) {
    Object.assign(this, init);
  }
}
