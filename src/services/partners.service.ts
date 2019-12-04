import { Partner } from './../models/partner.model';
import { PartnersRepository } from './../repositories/partners.repository';
import { inject, injectable } from 'inversify';
import { PartnerResponseDto, PartnerRequestDto } from './../dtos/partner/partner.dto';
import { AddressResponseDto } from './../dtos/address/address.dto';
import { BaseService } from './base.service';
import { Address } from './../models/address.model';

@injectable()
export class PartnersService extends BaseService<PartnerResponseDto, PartnerRequestDto, Partner> {
  @inject(PartnersRepository) protected readonly repo: PartnersRepository;

  public async getAll(userId: string): Promise<PartnerResponseDto[]> {
    const data = await this.repo.getAll({ userId }, { name: 'asc' });
    const result = data.map((item) => this.modelToDto(item));
    return result;
  }

  public async findById(id: string, userId: string): Promise<PartnerResponseDto> {
    const partner = await this.repo.findById(id);
    if (partner && partner.userId === userId) {
      return this.modelToDto(partner);
    }
    return null;
  }

  public async create(dto: PartnerRequestDto, userId: string): Promise<PartnerResponseDto> {
    let model = this.dtoToModel(dto);
    model.userId = userId;

    model = await this.repo.create(model);
    const result = this.modelToDto(model);
    return result;
  }

  public async update(id: string, dto: PartnerRequestDto, userId: string): Promise<PartnerResponseDto> {
    const exist = await this.repo.exists({ _id: id, userId });
    if (!exist) {
      return null;
    }

    let model = this.dtoToModel(dto);
    model = await this.repo.update(id, model);
    return this.modelToDto(model);
  }

  public async delete(id: string, userId: string): Promise<boolean> {
    const exist = await this.repo.exists({ _id: id, userId });
    if (!exist) {
      return null;
    }

    return this.repo.delete(id);
  }

  protected modelToDto(model: Partner): PartnerResponseDto {
    return new PartnerResponseDto({
      id: model._id,
      name: model.name,
      taxNumber: model.taxNumber,

      address: model.address ? new AddressResponseDto({
        street: model.address.street,
        city: model.address.city,
      }) : null,
    });
  }

  protected dtoToModel(dto: PartnerRequestDto): Partner {
    return new Partner({
      name: dto.name,
      taxNumber: dto.taxNumber,

      address: dto.address ? new Address({
        street: dto.address.street,
        city: dto.address.city,
      }) : null,
    });
  };
}
