import { InvoiceItemRequestDto, InvoiceItemResponseDto } from './invoice-item.dto';
import { PartnerResponseDto } from './../partner/partner.dto';
import { MinLength, ValidateNested, IsDateString, IsMongoId, ArrayMinSize, MaxDate, MinDate } from 'class-validator';
import { Type } from 'class-transformer/decorators';

export class InvoiceRequestDto {
  @MinLength(5)
  public number: string;

  @IsDateString()
  public invoiceDate: Date;

  @IsDateString()
  public paymentDate: Date;

  @ValidateNested()
  @ArrayMinSize(1)
  @Type(() => InvoiceItemRequestDto)
  public invoiceItems: InvoiceItemRequestDto[];

  @IsMongoId()
  public partnerId: string;
}

export class InvoiceResponseDto {
  public id: string;
  public number: string;
  public invoiceDate: Date | string;
  public paymentDate: Date | string;
  public status: number;

  public invoiceItems: InvoiceItemResponseDto[];

  public partner: PartnerResponseDto;

  constructor(init?: Partial<InvoiceResponseDto>) {
    Object.assign(this, init);
  }
}
