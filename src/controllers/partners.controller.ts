import { ValidationError, ValidationErrorPlace } from './../errors/validation.error';
import { AuthenticatedRequest } from './../interfaces/authenticated.request';
import { PartnersService } from './../services/partners.service';
import { PartnerRequestDto } from './../dtos/partner/partner.dto';
import { injectable, inject } from 'inversify';
import { BaseController } from './base.controller';
import { Response, NextFunction } from "express";
import { StatusHelper } from './../helpers/status.helper';
import { isNullOrWhitespace } from './../helpers/string.helper';

@injectable()
export class PartnersController extends BaseController {
  @inject(PartnersService) private readonly service: PartnersService;

  constructor() {
    super('/partners');
  }

  public initializeRoutes(): void {
    this.router
      .get(this.path, this.getAll)
      .get(`${this.path}/:id`, this.validator.checkId(), this.getById)
      .post(this.path, this.validator.checkBody(PartnerRequestDto), this.create)
      .put(`${this.path}/:id`, this.validator.checkIdAndBody(PartnerRequestDto), this.update)
      .delete(`${this.path}/:id`, this.validator.checkId(), this.delete);
  }

  private getAll = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
    const withDeleted = this.getBoolFromQuery(request, 'withDeleted');
    this.service.getAll(request.auth.userId, withDeleted)
      .then((data) => {
        response.send(data);
        next();
      })
      .catch(next);
  }

  private getById = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
    const id = request.params.id;
    this.service.findById(id, request.auth.userId)
      .then((data) => {
        if (data) {
          response.send(data);
        } else {
          next(StatusHelper.error404NotFound);
          return;
        }
        next();
      })
      .catch(next);
  }

  private create = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
    const dto = request.body as PartnerRequestDto;

    const uniqueError = await this.service.isUnique(['name', 'taxNumber'], dto, request.auth.userId);
    if (!isNullOrWhitespace(uniqueError)) {
      next(new ValidationError(ValidationErrorPlace.Body, [uniqueError]));
      return;
    }

    this.service.create(dto, request.auth.userId)
      .then((data) => {
        response
          .location(`${this.path}/${data.id}`)
          .status(StatusHelper.status201Created)
          .send(data);
        next();
      })
      .catch(next);
  }

  private update = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
    const id = request.params.id;
    const dto = request.body as PartnerRequestDto;

    const uniqueError = await this.service.isUnique(['name', 'taxNumber'], dto, request.auth.userId, id);
    if (!isNullOrWhitespace(uniqueError)) {
      next(new ValidationError(ValidationErrorPlace.Body, [uniqueError]));
      return;
    }

    this.service.update(id, dto, request.auth.userId)
      .then((data) => {
        if (data) {
          response.send(data);
        } else {
          next(StatusHelper.error404NotFound);
          return;
        }
        next();
      })
      .catch(next);
  }

  private delete = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
    const id = request.params.id;
    this.service.delete(id, request.auth.userId)
      .then((deleted) => {
        if (deleted) {
          response.sendStatus(StatusHelper.status204NoContent);
        } else {
          next(StatusHelper.error404NotFound);
          return;
        }
        next();
      })
      .catch(next);
  }
}
