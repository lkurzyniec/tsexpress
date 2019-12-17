import { PartnersService } from './../services/partners.service';
import { InvoiceRequestDto } from './../dtos/invoice/invoice.dto';
import { InvoicesService } from './../services/invoices.service';
import { ValidationError, ValidationErrorPlace } from '../errors/validation.error';
import { AuthRequest } from '../interfaces/auth.request';
import { injectable, inject } from 'inversify';
import { BaseController } from './base.controller';
import { Response } from "express";
import { StatusHelper } from '../helpers/status.helper';
import { isNullOrWhitespace } from '../helpers/string.helper';
import { BodyRequest } from './../interfaces/body.request';
import { DtoValidator } from './../decorators/dto-validator.decorator';
import { IdValidator } from './../decorators/id-validator.decorator';

@injectable()
export class InvoicesController extends BaseController {
  @inject(InvoicesService) private readonly service: InvoicesService;
  @inject(PartnersService) private readonly partnersService: PartnersService;

  constructor() {
    super('/invoices');
  }

  public initializeRoutes(): void {
    this.router
      .get(this.path, this.getAll.bind(this))
      .get(`${this.path}/:id`, this.getById.bind(this))
      .post(this.path, this.create.bind(this))
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

  @DtoValidator(InvoiceRequestDto)
  private async create(request: BodyRequest<InvoiceRequestDto>, response: Response) {
    const dto = request.body;

    const uniqueError = await this.service.isUnique(['number'], dto, request.auth.userId);
    if (!isNullOrWhitespace(uniqueError)) {
      throw new ValidationError(ValidationErrorPlace.Body, uniqueError);
    }

    const partner = await this.partnersService.findById(dto.partnerId, request.auth.userId);
    if (!partner) {
      throw new ValidationError(ValidationErrorPlace.Body, 'partner does not exists');
    }
    if (partner.deleted) {
      throw new ValidationError(ValidationErrorPlace.Body, 'partner deleted');
    }

    const data = await this.service.create(dto, request.auth.userId);
    response
      .location(`${this.path}/${data.id}`)
      .status(StatusHelper.status201Created)
      .send(data);
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
