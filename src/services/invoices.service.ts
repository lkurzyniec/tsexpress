import { InvoiceStatus } from './../enums/invoice.status.enum';
import { InvoiceItem } from './../models/invoice-item.model';
import { InvoiceItemResponseDto } from './../dtos/invoice/invoice-item.dto';
import { AddressResponseDto } from './../dtos/address/address.dto';
import { Partner } from './../models/partner.model';
import { PartnerResponseDto } from './../dtos/partner/partner.dto';
import { InvoiceResponseDto, InvoiceRequestDto } from './../dtos/invoice/invoice.dto';
import { Invoice } from './../models/invoice.model';
import { InvoicesRepository } from './../repositories/invoices.repository';
import { User } from '../models/user.model';
import { inject, injectable } from 'inversify';
import { BaseService } from './base.service';

@injectable()
export class InvoicesService extends BaseService<InvoiceResponseDto, InvoiceRequestDto, Invoice> {
  @inject(InvoicesRepository) protected readonly repo: InvoicesRepository;

  public async getAll(user: string, withDeleted: boolean): Promise<InvoiceResponseDto[]> {
    let query = {
      user,
    } as any;
    if (!withDeleted) {
      query = {
        user,
        status: { $ne: InvoiceStatus.Deleted as number }
      }
    }

    const data = await this.repo.getAll(query, { invoiceDate: 'desc' });
    const result = data.map((item) => this.modelToDto(item));
    return result;
  }

  public async findById(id: string, user: string): Promise<InvoiceResponseDto> {
    const data = await this.repo.findById(id);
    if (data && data.user == user) {
      return this.modelToDto(data);
    }
    return null;
  }

  public async create(dto: InvoiceRequestDto, userId: string): Promise<InvoiceResponseDto> {
    let model = this.dtoToModel(dto);
    model.status = InvoiceStatus.Created;
    model.user = new User({
      _id: userId
    });

    model = await this.repo.create(model);
    const result = this.modelToDto(model);
    return result;
  }

  public async delete(id: string, user: string): Promise<boolean> {
    const exist = await this.repo.exists({ _id: id, user });
    if (!exist) {
      return null;
    }

    let model = new Invoice({
      _id: id,
      status: InvoiceStatus.Deleted,
    });
    model = await this.repo.update(id, model);
    return !!model;
  }

  protected modelToDto(model: Invoice): InvoiceResponseDto {
    const dto = new InvoiceResponseDto({
      id: model._id,
      number: model.number,
      invoiceDate: model.invoiceDate,
      paymentDate: model.paymentDate,
      status: model.status,

      invoiceItems: model.invoiceItems.map(item => (new InvoiceItemResponseDto({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      }))),
    });

    const partner = model.partner as Partner;
    dto.partner = new PartnerResponseDto({
      id: partner._id,
      name: partner.name,
      taxNumber: partner.taxNumber,
      address: partner.address ? new AddressResponseDto({
        street: partner.address.street,
        city: partner.address.city,
      }) : null,
    });

    return dto;
  }

  protected dtoToModel(dto: InvoiceRequestDto): Invoice {
    return new Invoice({
      number: dto.number,
      invoiceDate: dto.invoiceDate,
      paymentDate: dto.paymentDate,

      invoiceItems: dto.invoiceItems.map(item => (new InvoiceItem({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      }))),

      partner: new Partner({
        _id: dto.partnerId
      })
    });
  };
}
