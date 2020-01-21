import { ValidationError, ValidationErrorPlace } from './../errors/validation.error';
import { AuthRequest } from '../interfaces/auth.request';
import { PartnersService } from './../services/partners.service';
import { PartnerRequestDto } from './../dtos/partner/partner.dto';
import { injectable, inject } from 'inversify';
import { BaseController } from './base.controller';
import { Response } from "express";
import { StatusHelper } from './../helpers/status.helper';
import { isNullOrWhitespace } from './../helpers/string.helper';
import { BodyRequest } from './../interfaces/body.request';
import { DtoValidator } from './../decorators/dto-validator.decorator';
import { IdValidator } from './../decorators/id-validator.decorator';

@injectable()
export class PartnersController extends BaseController {
  @inject(PartnersService) private readonly service: PartnersService;

  constructor() {
    super('/partners');
  }

  public initializeRoutes(): void {
    this.router
      .get(this.path, this.getAll.bind(this))
      .get(`${this.path}/:id`, this.getById.bind(this))
      .post(this.path, this.create.bind(this))
      .put(`${this.path}/:id`, this.update.bind(this))
      .delete(`${this.path}/:id`, this.delete.bind(this));
  }

  private async getAll(request: AuthRequest, response: Response) {
    const withDeleted = this.getBoolFromQueryParams(request, 'withDeleted');
    const data = await this.service.getAll(request.auth.userId, withDeleted);
    response.send(data);
  }

  @IdValidator()
  private async getById(request: AuthRequest, response: Response) {
    const id = request.params.id;
    const data = await this.service.findById(id, request.auth.userId);
    if (data) {
      response.send(data);
    } else {
      throw StatusHelper.error404NotFound;
    }
  }

  @DtoValidator(PartnerRequestDto)
  private async create(request: BodyRequest<PartnerRequestDto>, response: Response) {
    const dto = request.body;

    const uniqueError = await this.service.isUnique(['name', 'taxNumber'], dto, request.auth.userId);
    if (!isNullOrWhitespace(uniqueError)) {
      throw new ValidationError(ValidationErrorPlace.Body, uniqueError);
    }

    const data = await this.service.create(dto, request.auth.userId);
    response
      .location(`${this.path}/${data.id}`)
      .status(StatusHelper.status201Created)
      .send(data);
  }

  @IdValidator()
  @DtoValidator(PartnerRequestDto)
  private async update(request: BodyRequest<PartnerRequestDto>, response: Response) {
    const id = request.params.id;
    const dto = request.body;

    const uniqueError = await this.service.isUnique(['name', 'taxNumber'], dto, request.auth.userId, id);
    if (!isNullOrWhitespace(uniqueError)) {
      throw new ValidationError(ValidationErrorPlace.Body, uniqueError);
    }

    const data = await this.service.update(id, dto, request.auth.userId);
    if (data) {
      response.send(data);
    } else {
      throw StatusHelper.error404NotFound;
    }
  }

  @IdValidator()
  private async delete(request: AuthRequest, response: Response) {
    const id = request.params.id;
    const deleted = await this.service.delete(id, request.auth.userId);
    if (deleted) {
      response.sendStatus(StatusHelper.status204NoContent);
    } else {
      throw StatusHelper.error404NotFound;
    }
  }
}
